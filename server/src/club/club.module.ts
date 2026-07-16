import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { AdminController } from './club.controller';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { ClubRepository } from './repo/club.repo';
import { SequelizeModule } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { Plan } from './entities/plan.entity';
import { Event } from './entities/event.entity';
import { Coach } from './entities/coach.entity';
import { Booking } from './entities/booking.entity';
import { Slot } from './entities/slot.entity';
import { EventUser } from './entities/event.user';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    AdminModule,
    UserModule,
    SequelizeModule.forFeature([
      Activity,
      Plan,
      Event,
      Coach,
      Booking,
      Slot,
      EventUser,
      User
    ]),
  ],
  controllers: [AdminController],
  providers: [ClubService, ClubRepository],
})
export class ClubModule {}
