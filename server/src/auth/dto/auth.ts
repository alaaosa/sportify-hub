import { IsEmail, IsString, Length } from 'class-validator';
// import { IsEmail, Length } from 'sequelize-typescript';

export class SignUpDTO {
  @IsString({ message: 'Full name must be a string' })
  @Length(3, 50, { message: 'Full name must be between 3 and 50 characters' })
  fullName!: string;
  @IsEmail({}, { message: 'must be a valid email' })
  email!: string;
  @IsString({ message: 'phone number must be a string' })
  pNumber!: string;
  @IsString({ message: 'phone number must be a string' })
  password!: string;
  @IsString({ message: 'phone number must be a string' })
  cPassword!: string;
}
export class SignInDTO {
  @IsEmail({}, { message: 'must be a valid email' })
  email!: string;

  @IsString({ message: 'phone number must be a string' })
  password!: string;
}
