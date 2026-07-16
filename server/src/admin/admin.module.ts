import { Module } from '@nestjs/common';
import { ClubService } from './admin.service';
import { ClubController } from './admin.controller';
import { AdminRepository } from './repo/admin.repo';
import { SequelizeModule } from '@nestjs/sequelize';
import { Club } from './entities/club.entity';
import { Sport } from './entities/sports';
import { Facility } from './entities/facilities';
import { SportClub } from './entities/sport.club';
import { FacilityClub } from './entities/facility.club';
import { Event } from 'src/club/entities/event.entity';
import { Coach } from 'src/club/entities/coach.entity';
import { Booking } from 'src/club/entities/booking.entity';
import { Activity } from 'src/club/entities/activity.entity';
import { Slot } from 'src/club/entities/slot.entity';
import { Plan } from 'src/club/entities/plan.entity';
import { EventUser } from 'src/club/entities/event.user';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forFeature([
      Club,
      Sport,
      Facility,
      SportClub,
      FacilityClub,
      Event,
      Coach,
      Booking,
      Activity,
      Slot,
      Plan,
      EventUser,
    ]),
  ],
  controllers: [ClubController],
  providers: [ClubService, AdminRepository],
  exports: [AdminRepository],
})
export class AdminModule {}
