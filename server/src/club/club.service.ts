import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FacilityDTO, SportDTO } from 'src/admin/dto/admin.dto';
import { AdminRepository } from 'src/admin/repo/admin.repo';
import {
  ActivityDTo,
  CoachDTO,
  EditCoachDTO,
  EditedActivity,
  EditedPlanDTO,
  EditEventDTO,
  EventDTO,
  PlanDTO,
  SlotDto,
} from './dto/club.dto';
import { ClubRepository } from './repo/club.repo';
import { UserRepository } from 'src/user/repo/user.repo';

@Injectable()
export class ClubService {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly clubRepository: ClubRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // admin add  sport
  async addSports(sport: SportDTO) {
    const s = await this.adminRepo.addSport({ sport: sport.sport });

    return s;
  }
  // admin add facility
  async addFacility(f: FacilityDTO) {
    const facility = await this.adminRepo.addFacility({
      facility: f.facility,
    });

    return facility;
  }

  // return all platform sports
  async getAllSports() {
    const records = await this.adminRepo.findAllSports();
    return (records || []).map((r: any) => r.sport ?? r);
  }

  // return all platform facilities
  async getAllFacilities() {
    const records = await this.adminRepo.findAllFacilities();
    return (records || []).map((r: any) => r.facility ?? r);
  }

  // delete sport by id or name
  async deleteSportById(id: number) {
    const res = await this.adminRepo.deleteSportById(id);
    return res; // number of rows deleted
  }

  async deleteSportByName(name: string) {
    const res = await this.adminRepo.deleteSportByName(name);
    return res;
  }

  // delete facility by id or name
  async deleteFacilityById(id: number) {
    const res = await this.adminRepo.deleteFacilityById(id);
    return res;
  }

  async deleteFacilityByName(name: string) {
    const res = await this.adminRepo.deleteFacilityByName(name);
    return res;
  }

  async findSports(clubId: number) {
    const sports = await this.adminRepo.findSports(clubId);
    return sports;
  }

  async addActivity(clubId: number, activityDTO: ActivityDTo) {
    const club = await this.adminRepo.findClub(clubId);

    if (!club) throw new NotFoundException('club not found');

    const activity = await this.clubRepository.create({
      ...activityDTO,
      clubId: club.id,
    });

    return activity;
  }

  async editActivity(activityId: number, editedActivity: EditedActivity) {
    const club = await this.clubRepository.update(activityId, editedActivity);
    return club;
  }

  async deleteActivity(activityId: number) {
    // Remove dependent bookings and slots before deleting an activity to avoid foreign key constraint issues.
    await this.clubRepository.deleteBookingsByActivityId(activityId);
    await this.clubRepository.deleteSlotsByActivityId(activityId);
    const result = await this.clubRepository.delete(activityId);
    return result;
  }

  async findAllActivity(clubId: number) {
    const activities = await this.clubRepository.findAllActivity(clubId);
    return activities;
  }

  async createEvent(clubId: number, dto: EventDTO) {
    const event = await this.clubRepository.createEvent(clubId, dto);
    return event;
  }

  async editEvent(eventId: number, dto: EditEventDTO) {
    const event = await this.clubRepository.updateEvent(eventId, dto);
    return event;
  }

  async deleteEvent(eventId: number) {
    const event = await this.clubRepository.deleteEvent(eventId);
    return event;
  }

  async findAllEvents(clubId: number) {
    const events = await this.clubRepository.findAllEvents(clubId);
    return events;
  }

  async getDashboardBookings(clubId: number, limit?: number) {
    return this.clubRepository.findRecentBookingsByClub(clubId, limit);
  }

  async getDashboardStats(clubId: number) {
    const totalMembers = await this.clubRepository.countMembersByClub(clubId);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysBookings = await this.clubRepository.countBookingsByClubInRange(
      clubId,
      startOfToday,
      endOfToday,
    );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date();
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyRevenue =
      await this.clubRepository.sumBookingRevenueByClubInRange(
        clubId,
        startOfMonth,
        endOfMonth,
      );

    const upcomingEvents =
      await this.clubRepository.countUpcomingEvents(clubId);

    return {
      totalMembers,
      todaysBookings,
      monthlyRevenue,
      upcomingEvents,
    };
  }

  ///////////////////////||

  async getAllUser(clubId: number) {
    const users = await this.userRepository.getAllUser(clubId);
    return users;
  }
  ////////////////////
  async createPlan(clubId: number, dto: PlanDTO) {
    const plan = await this.clubRepository.createPlan(clubId, dto);
    return plan;
  }

  async updatePlan(planId: number, dto: EditedPlanDTO) {
    const plan = await this.clubRepository.updatePlan(planId, dto);
    return plan;
  }
  async deletePlan(planId: number) {
    const plan = await this.clubRepository.deletePlan(planId);
    return plan;
  }

  async findAllPlan(clubId: number) {
    const plans = await this.clubRepository.findAllPlan(clubId);
    return plans;
  }

  async createCoach(clubId: number, dto: CoachDTO) {
    const coach = await this.clubRepository.addCoach(clubId, dto);
    return coach;
  }

  async updateCoach(coachId: number, dto: EditCoachDTO) {
    const coach = await this.clubRepository.updateCoach(coachId, dto);
    return coach;
  }
  async deleteCoach(coachId: number) {
    const coach = await this.clubRepository.deleteCoach(coachId);
    return coach;
  }
  async findAllCoach(clubId: number) {
    const coaches = await this.clubRepository.findAllCoach(clubId);
    return coaches;
  }

  async createSlot(activityId: number, dto: SlotDto) {
    const slot = await this.clubRepository.createSlot(activityId, {
      ...dto,
      is_booked: false,
    });
    return slot;
  }

  async getSlotsByActivity(activityId: number) {
    return this.clubRepository.findSlotsByActivity(activityId);
  }

  async deleteSlot(slotId: number) {
    return this.clubRepository.deleteSlot(slotId);
  }

  async createBooking(slotId: number, userId: number) {
    const existingBooking = await this.clubRepository.findBookingBySlotAndUser(
      slotId,
      userId,
    );

    if (existingBooking) {
      throw new Error('You already booked this slot');
    }

    const slot = await this.clubRepository.findSlotById(slotId);
    if (!slot) {
      throw new Error('slot not found');
    }

    if (slot.is_booked) {
      throw new Error('slot already booked');
    }

    const booking = await this.clubRepository.createBooking(slotId, userId);
    if (booking) {
      await slot.update({ is_booked: true });
    }

    return booking;
  }
  async isUserRegisteredForEvent(eventId: number, userId: number) {
    return this.clubRepository.findEventUserByEventAndUser(eventId, userId);
  }
  async createEventUser(eventId: number, userId: number) {
    const existingEventUser =
      await this.clubRepository.findEventUserByEventAndUser(eventId, userId);
    if (existingEventUser) {
      throw new NotFoundException('User is already registered for this event');
    }

    const event = await this.clubRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const currentCapacity = Number(event.current_capacity ?? 0);
    const maxCapacity = Number(event.max_capacity ?? 0);

    if (maxCapacity > 0 && currentCapacity >= maxCapacity) {
      throw new Error('Event is fully booked');
    }

    await event.update({ current_capacity: currentCapacity + 1 });
    const createdEventUser = await this.clubRepository.createEventUser(
      eventId,
      userId,
    );
    const updatedEvent = await this.clubRepository.findEventById(eventId);

    return {
      eventUser: createdEventUser,
      event: updatedEvent,
    };
  }
  async unSubscribeEventUser(eventId: number, userId: number) {
    const existingEventUser =
      await this.clubRepository.findEventUserByEventAndUser(eventId, userId);

    if (!existingEventUser) {
      throw new NotFoundException('User is not registered for this event');
    }

    // remove the EventUser entry
    await this.clubRepository.unSubscribeEventUser(eventId, userId);

    // decrement current_capacity on the event (but not below 0)
    const event = await this.clubRepository.findEventById(eventId);
    if (event) {
      const currentCapacity = Number(event.current_capacity ?? 0);
      const nextCapacity = Math.max(0, currentCapacity - 1);
      await event.update({ current_capacity: nextCapacity });
      const updatedEvent = await this.clubRepository.findEventById(eventId);
      return { event: updatedEvent };
    }

    return { event: null };
  }
}
