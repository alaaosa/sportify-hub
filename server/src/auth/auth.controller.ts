import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDTO) {
    const user = await this.authService.signUp(dto);

    return {
      success: true,
      message: 'user created successsfully',
      data: user,
    };
  }
  @Post('signin')
  async signIn(@Body() dto: SignInDTO) {
    const user = await this.authService.signIn(dto);

    return {
      success: true,
      data: user,
    };
  }
}
