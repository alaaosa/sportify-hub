import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/repo/user.repo';
import { TokenService } from 'src/common/service/token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
  exports: [TokenService, JwtService],
})
export class AuthModule {}
