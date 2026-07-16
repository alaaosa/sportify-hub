import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Club } from '../entities/club.entity';
import { Sequelize, Transaction, where } from 'sequelize';
import { FacilityClub } from '../entities/facility.club';
import { SportClub } from '../entities/sport.club';
import { Sport } from '../entities/sports';
import { Facility } from '../entities/facilities';
import { Event } from 'src/club/entities/event.entity';
import { Coach } from 'src/club/entities/coach.entity';
import { Booking } from 'src/club/entities/booking.entity';
import { Activity } from 'src/club/entities/activity.entity';
import { Slot } from 'src/club/entities/slot.entity';
import { Plan } from 'src/club/entities/plan.entity';
import { EventUser } from 'src/club/entities/event.user';
import { ClubStatus } from 'src/common/enums/index.enum';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Club) private readonly clubModel: typeof Club,
    @InjectModel(FacilityClub)
    private readonly facilityClub: typeof FacilityClub,
    @InjectModel(SportClub)
    private readonly sportClub: typeof SportClub,
    @InjectModel(Sport)
    private readonly sportModel: typeof Sport,
    @InjectModel(Facility)
    private readonly facilityModel: typeof Facility,
    @InjectModel(Coach)
    private readonly coachModel: typeof Coach,
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
    @InjectModel(Activity)
    private readonly activityModel: typeof Activity,
    @InjectModel(Slot)
    private readonly slotModel: typeof Slot,
    @InjectModel(Plan)
    private readonly planModel: typeof Plan,
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
    @InjectModel(EventUser)
    private readonly eventUserModel: typeof EventUser,

    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  create(data: Partial<Club>, transaction?: Transaction) {
    return this.clubModel.create(data, { transaction });
  }

  async findOrCreateSport(sport: string) {
    const [record] = await this.sportModel.findOrCreate({
      where: { sport },
      defaults: { sport },
    });
    return record;
  }

  async findOrCreateFacility(facility: string) {
    const [record] = await this.facilityModel.findOrCreate({
      where: { facility },
      defaults: { facility },
    });
    return record;
  }

  async transaction<T>(callback: (t: Transaction) => Promise<T>) {
    return await this.sequelize.transaction(callback);
  }

  createFacilityClub(data: Partial<FacilityClub>[], transaction?: Transaction) {
    return this.facilityClub.bulkCreate(data, { transaction });
  }
  createSportClub(data: Partial<SportClub>[], transaction?: Transaction) {
    return this.sportClub.bulkCreate(data, { transaction });
  }

  addSport(sport: Partial<Sport>) {
    return this.sportModel.create(sport);
  }

  addFacility(f: Partial<Facility>) {
    return this.facilityModel.create(f);
  }

  // return all sports available on platform
  findAllSports() {
    return this.sportModel.findAll({ order: [['sport', 'ASC']] });
  }

  // return all facilities available on platform
  findAllFacilities() {
    return this.facilityModel.findAll({ order: [['facility', 'ASC']] });
  }

  // delete sport by id
  deleteSportById(id: number) {
    return this.sportModel.destroy({ where: { id } });
  }

  // delete sport by name
  deleteSportByName(sport: string) {
    return this.sportModel.destroy({ where: { sport } });
  }

  // delete facility by id
  deleteFacilityById(id: number) {
    return this.facilityModel.destroy({ where: { id } });
  }

  // delete facility by name
  deleteFacilityByName(facility: string) {
    return this.facilityModel.destroy({ where: { facility } });
  }

  findClub(id: number) {
    return this.clubModel.findByPk(id, {
      include: [
        { model: Sport, through: { attributes: [] } },
        { model: Facility, through: { attributes: [] } },
      ],
    });
  }

  findAllClubs() {
    return this.clubModel.findAll({
      include: [
        { model: Sport, through: { attributes: [] } },
        { model: Facility, through: { attributes: [] } },
      ],
    });
  }

  updateClub(clubId: number, updatedData: Partial<Club>) {
    return this.clubModel.update(updatedData, {
      where: { id: clubId },
    });
  }

  deleteClub(clubId: number) {
    // delete related records in a safe order inside a transaction to avoid FK constraint errors
    return this.sequelize.transaction(async (t) => {
      await this.sportClub.destroy({ where: { clubId }, transaction: t });
      await this.facilityClub.destroy({ where: { clubId }, transaction: t });

      // coaches
      await this.coachModel.destroy({ where: { clubId }, transaction: t });

      // plans
      await this.planModel.destroy({ where: { clubId }, transaction: t });

      // activities -> slots -> bookings
      const activities = await this.activityModel.findAll({
        where: { clubId },
        transaction: t,
        attributes: ['id'],
      });
      const activityIds = activities.map((a: any) => a.id).filter(Boolean);
      if (activityIds.length > 0) {
        const slots = await this.slotModel.findAll({
          where: { activityId: activityIds },
          transaction: t,
          attributes: ['id'],
        });
        const slotIds = slots.map((s: any) => s.id).filter(Boolean);
        if (slotIds.length > 0) {
          await this.bookingModel.destroy({
            where: { slotId: slotIds },
            transaction: t,
          });
        }
        await this.slotModel.destroy({
          where: { activityId: activityIds },
          transaction: t,
        });
      }
      await this.activityModel.destroy({ where: { clubId }, transaction: t });

      // events -> event_users
      const events = await this.eventModel.findAll({
        where: { clubId },
        transaction: t,
        attributes: ['id'],
      });
      const eventIds = events.map((e: any) => e.id).filter(Boolean);
      if (eventIds.length > 0) {
        await this.eventUserModel.destroy({
          where: { eventId: eventIds },
          transaction: t,
        });
      }
      await this.eventModel.destroy({ where: { clubId }, transaction: t });

      // finally delete the club
      return this.clubModel.destroy({ where: { id: clubId }, transaction: t });
    });
  }

  findSports(clubId: number) {
    return this.sportModel.findAll({
      include: [
        {
          model: Club,
          attributes: [],
          where: { id: clubId },
          through: { attributes: [] },
        },
      ],
    });
  }
}
