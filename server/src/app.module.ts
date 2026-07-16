import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ClubModule } from './club/club.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppSequelizeModule } from './DB/sequelize.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AppSequelizeModule,
    AuthModule,
    UserModule,
    AdminModule,
    ClubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
