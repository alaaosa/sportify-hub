import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dto/auth';
import { UserRepository } from 'src/user/repo/user.repo';
import { compare, hash } from 'src/common/security/hash';
import { TokenService } from 'src/common/service/token.service';
import EventEmitter2 from 'eventemitter2';
import { OnEvent } from '@nestjs/event-emitter';
import { CLUB } from 'src/common/event';
import { UserRole } from 'src/common/enums/index.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private tokenService: TokenService,
    private eventEmitter2: EventEmitter2,
  ) {}
  async signUp(signUpDTO: SignUpDTO) {
    const { email, password, cPassword, ...details } = signUpDTO;

    if (!email) throw new BadRequestException('enter email');

    const userExist = await this.userRepo.findByEmail(email);

    if (userExist) throw new ConflictException('User already exist');

    if (password !== cPassword)
      throw new BadRequestException(
        'Password and Confirm Password Must be the same',
      );

    const data = {
      ...details,
      password: hash(password),
      email,
    };

    const user = await this.userRepo.create({
      ...details,
      password: hash(password),
      email,
      role: UserRole.USER,
    });

    return user;
  }

  async signIn(signInDTO: SignInDTO) {
    const { email } = signInDTO;

    const userExist = await this.userRepo.findByEmail(email);

    if (!userExist) throw new BadRequestException('User Not Found');

    if (!compare(signInDTO.password, userExist.password))
      throw new BadRequestException('Invalid Password');

    const token = this.tokenService.sign(
      { id: userExist.id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );

    return { token, user: userExist };
  }

  @OnEvent(CLUB.ADMIN)
  async confirm_profile() {}
}
