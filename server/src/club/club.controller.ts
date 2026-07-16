import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { Auth } from 'src/common/decorators/decorater.composition';
import { UserRole } from 'src/common/enums/index.enum';
import { FacilityDTO, SportDTO } from 'src/admin/dto/admin.dto';
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
import type { Request } from 'express';
import { formatTimeTo12Hour } from 'src/common/service/time.service';

@Controller('club')
export class AdminController {
  constructor(private readonly clubService: ClubService) {}

  // @Auth(UserRole.SUPER_ADMIN)
  @Post('sports')
  async addSport(@Body() sport: SportDTO) {
    const data = await this.clubService.addSports(sport);

    return {
      status: true,
      message: 'sport created successfully',
      data,
    };
  }
  @Get('sports')
  async getAllSports() {
    try {
      const data = await this.clubService.getAllSports();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to load sports',
        data: [],
      };
    }
  }
  @Delete('sports/:id')
  async deleteSportById(@Param('id', ParseIntPipe) id: number) {
    try {
      const rows = await this.clubService.deleteSportById(id);
      return { success: true, deleted: rows };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to delete sport',
      };
    }
  }

  @Delete('sports')
  async deleteSportByName(@Query('name') name: string) {
    try {
      const rows = await this.clubService.deleteSportByName(name);
      return { success: true, deleted: rows };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to delete sport',
      };
    }
  }
  // @Auth(UserRole.SUPER_ADMIN)
  @Post('facility')
  async addFacility(@Body() facilityDTO: FacilityDTO) {
    const data = await this.clubService.addFacility(facilityDTO);

    return {
      status: true,
      message: 'facility created successfully',
      data,
    };
  }
  @Get('facility')
  async getAllFacilities() {
    try {
      const data = await this.clubService.getAllFacilities();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to load facilities',
        data: [],
      };
    }
  }
  @Delete('facility/:id')
  async deleteFacilityById(@Param('id', ParseIntPipe) id: number) {
    try {
      const rows = await this.clubService.deleteFacilityById(id);
      return { success: true, deleted: rows };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to delete facility',
      };
    }
  }

  @Delete('facility')
  async deleteFacilityByName(@Query('name') name: string) {
    try {
      const rows = await this.clubService.deleteFacilityByName(name);
      return { success: true, deleted: rows };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to delete facility',
      };
    }
  }

  // @Auth(UserRole.CLUB_ADMIN)
  @Get('sports/:id')
  async getSports(@Param('id', ParseIntPipe) id: number) {
    const data = await this.clubService.findSports(id);
    return {
      success: true,
      data,
    };
  }

  // @Auth(UserRole.CLUB_ADMIN)
  @Post(':id/activity')
  async addActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActivityDTo,
  ) {
    const data = await this.clubService.addActivity(id, dto);
    return {
      success: true,
      message: 'activity created successfully',
      data,
    };
  }

  // لسه مربطتش دي
  @Get(':id/activity')
  async getActivities(@Param('id', ParseIntPipe) id: number) {
    const activities = await this.clubService.findAllActivity(id);
    const data = activities.map((activity) => {
      const rawActivity = activity.toJSON();
      const formattedSlots = Array.isArray(rawActivity.slots)
        ? rawActivity.slots.map((slot: any) => ({
            ...slot,
            start_time: formatTimeTo12Hour(slot.start_time),
            end_time: formatTimeTo12Hour(slot.end_time),
          }))
        : [];

      return {
        ...rawActivity,
        slots: formattedSlots,
      };
    });

    return {
      success: true,
      data,
    };
  }

  // @Auth(UserRole.CLUB_ADMIN)
  @Put(':id/activity/:activityId')
  async editedActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditedActivity,
    @Param('activityId', ParseIntPipe) activId: number,
  ) {
    const data = await this.clubService.editActivity(activId, dto);
    return {
      success: true,
      message: 'activity updated successfully',
      data,
    };
  }
  // @Auth(UserRole.CLUB_ADMIN)
  @Delete(':id/activity/:activityId')
  async delActivity(
    @Param('id', ParseIntPipe) id: number,

    @Param('activityId', ParseIntPipe) activId: number,
  ) {
    const data = await this.clubService.deleteActivity(activId);
    return {
      success: true,
      message: 'activity deleted successfully',
    };
  }

  @Post(':id/event')
  async addEvent(@Param('id', ParseIntPipe) id: number, @Body() dto: EventDTO) {
    const event = await this.clubService.createEvent(id, dto);
    return {
      success: true,
      message: 'event created successfully',
      data: event,
    };
  }

  @Put(':id/event/:eventId')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditEventDTO,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    const updateEvent = await this.clubService.editEvent(eventId, dto);
    return {
      success: true,
      message: 'event updated successfully',
      data: updateEvent,
    };
  }
  @Delete(':id/event/:eventId')
  async delEvent(
    @Param('id', ParseIntPipe) id: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    const updateEvent = await this.clubService.deleteEvent(eventId);
    return {
      success: true,
      message: 'event deleted successfully',
    };
  }

  @Get(':id/event')
  async getAllEvents(@Param('id', ParseIntPipe) id: number) {
    try {
      const events = await this.clubService.findAllEvents(id);
      return {
        success: true,
        data: events,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to load events',
        data: [],
      };
    }
  }

  @Auth(UserRole.CLUB_ADMIN)
  @Get(':id/dashboard/bookings')
  async dashboardBookings(@Param('id', ParseIntPipe) id: number) {
    try {
      const bookings = await this.clubService.getDashboardBookings(id);
      const normalized = (bookings || []).map((booking: any) => ({
        id: booking.id,
        userId: booking.userId,
        slotId: booking.slotId,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        user: booking.user || null,
        slot: booking.slot
          ? {
              id: booking.slot.id,
              activityId: booking.slot.activityId,
              start_time: booking.slot.start_time,
              end_time: booking.slot.end_time,
              is_booked: booking.slot.is_booked,
              activity: booking.slot.activity || null,
            }
          : null,
      }));

      return {
        success: true,
        data: normalized,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to load bookings',
        data: [],
      };
    }
  }

  @Auth(UserRole.CLUB_ADMIN)
  @Get(':id/dashboard/stats')
  async dashboardStats(@Param('id', ParseIntPipe) id: number) {
    try {
      const stats = await this.clubService.getDashboardStats(id);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to load stats',
        data: null,
      };
    }
  }

  @Post(':id/plan')
  async createPlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PlanDTO,
  ) {
    const plan = await this.clubService.createPlan(id, dto);
    return {
      success: true,
      message: 'plan created successfully',
      data: plan,
    };
  }

  @Put(':id/plan/:planId')
  async updatePlan(
    @Param('planId', ParseIntPipe) planId: number,
    @Body() dto: EditedPlanDTO,
  ) {
    const updated = await this.clubService.updatePlan(planId, dto);
    return {
      success: true,
      message: 'plan updated successfully',
      data: updated,
    };
  }

  @Delete(':id/plan/:planId')
  async delPlan(@Param('planId', ParseIntPipe) planId: number) {
    const del = await this.clubService.deletePlan(planId);
    return {
      success: true,
      message: 'plan deleted successfully',
    };
  }
  @Get(':id/plan')
  async allPlans(@Param('id', ParseIntPipe) id: number) {
    try {
      const plans = await this.clubService.findAllPlan(id);
      return {
        success: true,
        data: plans,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'failed to load plans',
        data: [],
      };
    }
  }

  @Post(':id/coach')
  async addCoach(@Param('id', ParseIntPipe) id: number, @Body() dto: CoachDTO) {
    const coach = await this.clubService.createCoach(id, dto);
    return {
      success: true,
      message: 'coach created successfully',
      data: coach,
    };
  }

  @Put(':id/coach/:coachId')
  async updateCoach(
    @Param('coachId', ParseIntPipe) id: number,
    @Body() dto: EditCoachDTO,
  ) {
    const coach = await this.clubService.updateCoach(id, dto);
    return {
      success: true,
      message: 'coach updated successfully',
    };
  }
  @Delete(':id/coach/:coachId')
  async delCoach(@Param('coachId', ParseIntPipe) id: number) {
    const coach = await this.clubService.deleteCoach(id);
    return {
      success: true,
      message: 'coach deleted successfully',
    };
  }

  @Get(':id/coach')
  async allCoaches(@Param('id', ParseIntPipe) id: number) {
    const coaches = await this.clubService.findAllCoach(id);
    return {
      success: true,
      data: coaches,
    };
  }

  @Get(':id/activity/:activityId/slots')
  async getActivitySlots(
    @Param('activityId', ParseIntPipe) activityId: number,
  ) {
    const slots = await this.clubService.getSlotsByActivity(activityId);
    return {
      success: true,
      data: slots.map((slot) => {
        const rawSlot =
          slot && typeof slot.toJSON === 'function' ? slot.toJSON() : slot;
        return {
          ...rawSlot,
          start_time: formatTimeTo12Hour(rawSlot.start_time),
          end_time: formatTimeTo12Hour(rawSlot.end_time),
        };
      }),
    };
  }

  @Post(':id/activity/:activityId/slot')
  async createSlot(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SlotDto,
  ) {
    const slot = await this.clubService.createSlot(activityId, dto);
    return {
      success: true,
      message: 'slot created successfully',
      data: {
        ...slot.toJSON(),
        start_time: formatTimeTo12Hour(slot.start_time),
        end_time: formatTimeTo12Hour(slot.end_time),
      },
    };
  }

  @Delete(':id/activity/:activityId/slot/:slotId')
  async deleteSlot(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Param('slotId', ParseIntPipe) slotId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.clubService.deleteSlot(slotId);
    return {
      success: true,
      message: 'slot deleted successfully',
      data: null,
    };
  }

  @Auth(UserRole.USER)
  @Post(':id/activity/:activityId/slot/:slotId/book')
  async createBooking(
    @Param('slotId', ParseIntPipe) slotId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('activityId', ParseIntPipe) activityId: number,
    @Req() req: Request,
  ) {
    try {
      const booking = await this.clubService.createBooking(
        slotId,
        req['user'].id,
      );
      return {
        success: true,
        message: 'booking created successfully',
        data: booking,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'booking failed',
        data: null,
      };
    }
  }

  @Auth(UserRole.USER)
  @Get(':id/event/:eventId/registered')
  async getEventRegistrationStatus(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const eventUser = await this.clubService.isUserRegisteredForEvent(
      eventId,
      req['user'].id,
    );

    return {
      success: true,
      data: {
        isRegistered: Boolean(eventUser),
      },
    };
  }

  @Auth(UserRole.USER)
  @Post(':id/event/:eventId/register')
  async registerForEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const eventRegistration = await this.clubService.createEventUser(
      eventId,
      req['user'].id,
    );
    return {
      success: true,
      message: 'User registered for event successfully',
      data: eventRegistration,
    };
    // } catch (error) {
    //   return {
    //     success: false,
    //     message:
    //       error instanceof Error ? error.message : 'Event registration failed',
    //     data: null,
    //   };
    // }
  }

  @Auth(UserRole.USER)
  @Delete(':id/event/:eventId/unregister')
  async unregisterFromEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    try {
      const result = await this.clubService.unSubscribeEventUser(
        eventId,
        req['user'].id,
      );
      return {
        success: true,
        message: 'User unregistered from event successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to unregister',
      };
    }
  }
}
