import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Activity } from '../entities/activity.entity';
import { Op } from 'sequelize';
import { Event } from '../entities/event.entity';
import { Plan } from '../entities/plan.entity';
import { Coach } from '../entities/coach.entity';
import { Slot } from '../entities/slot.entity';
import { Booking } from '../entities/booking.entity';
import { EventUser } from '../entities/event.user';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ClubRepository {
  constructor(
    @InjectModel(Activity) private readonly activityModel: typeof Activity,
    @InjectModel(Event) private readonly eventModel: typeof Event,
    @InjectModel(Plan) private readonly planModel: typeof Plan,
    @InjectModel(Coach) private readonly coachModel: typeof Coach,
    @InjectModel(Slot) private readonly slotModel: typeof Slot,
    @InjectModel(Booking) private readonly bookModel: typeof Booking,
    @InjectModel(EventUser) private readonly eventUserModel: typeof EventUser,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  create(data: Partial<Activity>) {
    return this.activityModel.create(data);
  }

  update(activityId: number, updatedData: Partial<Activity>) {
    return this.activityModel.update(updatedData, {
      where: { id: activityId },
    });
  }

  delete(activityId: number) {
    return this.activityModel.destroy({ where: { id: activityId } });
  }

  async deleteBookingsByActivityId(activityId: number) {
    const slots = await this.slotModel.findAll({
      where: { activityId },
      attributes: ['id'],
      raw: true,
    });
    const slotIds = slots.map((slot) => slot.id);
    if (!slotIds.length) return 0;

    return this.bookModel.destroy({
      where: { slotId: slotIds },
    });
  }

  deleteSlotsByActivityId(activityId: number) {
    return this.slotModel.destroy({ where: { activityId } });
  }

  findAllActivity(clubId: number) {
    return this.activityModel.findAll({
      where: { clubId },
      include: [{ model: Slot }],
    });
  }

  createEvent(clubId: number, data: Partial<Event>) {
    return this.eventModel.create({ ...data, clubId });
  }

  async findRecentBookingsByClub(clubId: number, limit?: number) {
    const queryOptions: any = {
      attributes: ['id', 'userId', 'slotId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: this.slotModel,
          as: 'slot',
          attributes: [
            'id',
            'activityId',
            'start_time',
            'end_time',
            'is_booked',
          ],
          include: [
            {
              model: this.activityModel,
              as: 'activity',
              where: { clubId },
              attributes: ['id', 'name', 'category', 'coach_name', 'price'],
            },
          ],
        },
        {
          model: this.userModel,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    };

    if (limit) {
      queryOptions.limit = limit;
    }

    return this.bookModel.findAll(queryOptions);
  }

  async countMembersByClub(clubId: number) {
    return this.eventUserModel.sequelize!.models.User.count({
      where: { clubId },
    });
  }

  async countBookingsByClubInRange(clubId: number, start: Date, end: Date) {
    const BookingModel = this.eventUserModel.sequelize!.models.Booking;
    const SlotModel = this.eventUserModel.sequelize!.models.Slot;
    const ActivityModel = this.eventUserModel.sequelize!.models.Activity;
    if (!BookingModel) return 0;
    return BookingModel.count({
      include: [
        {
          model: SlotModel,
          as: 'slot',
          include: [
            {
              model: ActivityModel,
              as: 'activity',
              where: { clubId },
            },
          ],
        },
      ],
      where: {
        createdAt: { [Op.between]: [start, end] },
      },
    });
  }

  async sumBookingRevenueByClubInRange(clubId: number, start: Date, end: Date) {
    const BookingModel = this.eventUserModel.sequelize!.models.Booking;
    const SlotModel = this.eventUserModel.sequelize!.models.Slot;
    const ActivityModel = this.eventUserModel.sequelize!.models.Activity;
    if (!BookingModel) return 0;
    const rows = await BookingModel.findAll({
      include: [
        {
          model: SlotModel,
          as: 'slot',
          include: [
            {
              model: ActivityModel,
              as: 'activity',
              where: { clubId },
              attributes: ['price'],
            },
          ],
        },
      ],
      where: {
        createdAt: { [Op.between]: [start, end] },
      },
      raw: true,
      nest: true,
    });

    return rows.reduce((sum: number, r: any) => {
      const price = Number(r.slot?.activity?.price ?? 0);
      return sum + price;
    }, 0);
  }

  async countUpcomingEvents(clubId: number) {
    const now = new Date();
    return this.eventModel.count({
      where: { clubId, start_date: { [Op.gte]: now } },
    });
  }

  updateEvent(eventId: number, updatedData: Partial<Event>) {
    return this.eventModel.update(updatedData, {
      where: { id: eventId },
    });
  }

  deleteEvent(eventId: number) {
    return this.eventModel.destroy({ where: { id: eventId } });
  }

  findAllEvents(clubId: number) {
    return this.eventModel.findAll({ where: { clubId }, raw: true });
  }

  findEventById(eventId: number) {
    return this.eventModel.findByPk(eventId);
  }

  createPlan(clubId: number, data: Partial<Plan>) {
    return this.planModel.create({ clubId, ...data });
  }

  findAllPlan(clubId: number) {
    return this.planModel.findAll({ where: { clubId }, raw: true });
  }

  deletePlan(planId: number) {
    return this.planModel.destroy({ where: { id: planId } });
  }

  updatePlan(planId: number, updatePlan: Partial<Plan>) {
    return this.planModel.update(updatePlan, { where: { id: planId } });
  }

  addCoach(clubId: number, data: Partial<Coach>) {
    return this.coachModel.create({ clubId, ...data });
  }

  updateCoach(coachId: number, updated: Partial<Coach>) {
    return this.coachModel.update(updated, {
      where: { id: coachId },
    });
  }

  deleteCoach(coachId: number) {
    return this.coachModel.destroy({ where: { id: coachId } });
  }

  findAllCoach(clubId: number) {
    return this.coachModel.findAll({ where: { clubId }, raw: true });
  }

  createSlot(activityId: number, data: Partial<Slot>) {
    return this.slotModel.create({ activityId, ...data });
  }

  findSlotsByActivity(activityId: number) {
    return this.slotModel.findAll({ where: { activityId }, raw: true });
  }

  deleteSlot(slotId: number) {
    return this.slotModel.destroy({ where: { id: slotId } });
  }

  createBooking(slotId: number, userId: number) {
    return this.bookModel.create({ slotId, userId });
  }

  findBookingBySlotAndUser(slotId: number, userId: number) {
    return this.bookModel.findOne({ where: { slotId, userId } });
  }

  findSlotById(slotId: number) {
    return this.slotModel.findByPk(slotId);
  }

  createEventUser(eventId: number, userId: number) {
    return this.eventUserModel.create({ eventId, userId });
  }
  findEventUserByEventAndUser(eventId: number, userId: number) {
    return this.eventUserModel.findOne({ where: { eventId, userId } });
  }

  unSubscribeEventUser(eventId: number, userId: number) {
    return this.eventUserModel.destroy({ where: { eventId, userId } });
  }
}
