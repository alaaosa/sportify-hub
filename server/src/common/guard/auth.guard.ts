import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.service';
import { Request } from 'express';
import { UserRepository } from 'src/user/repo/user.repo';

@Injectable()
export class Authguard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private readonly userRepo: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const { authorization } = req.headers as { authorization: string };

      if (!authorization || !authorization?.startsWith('Bearer ')) {
        throw new BadRequestException('Invalid Token');
      }

      const token = authorization.split(' ')[1];

      const decoded = this.tokenService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userRepo.findById(decoded.id);

      if (!user) throw new NotFoundException('User Not Found');

      req.user = user;

      return true;
    } catch (err) {
      console.log(err);

      throw new BadRequestException('Token is Invalid or Expired');
    }
  }
}
