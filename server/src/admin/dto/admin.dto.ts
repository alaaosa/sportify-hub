import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { BiliingType, ClubStatus } from 'src/common/enums/index.enum';

export class ClubDTO {
  @IsString({ message: 'Name Must be a string' })
  clubName!: string;

  @IsString({ message: 'Description Must be a string' })
  decription!: string;

  @IsString({ message: 'City Must be a string' })
  city!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxMembers?: number;

  @IsString({ message: 'Address Must be a string' })
  address!: string;

  @IsString({ message: 'Working hours must be a string' })
  workingHoures!: string; // 6AM - 8PM

  @Transform(({ value }) =>
    value == null ? [] : Array.isArray(value) ? value : [value],
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  sportsIds?: number[];

  @Transform(({ value }) =>
    value == null ? [] : Array.isArray(value) ? value : [value],
  )
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  facilityIds?: number[];

  @Transform(({ value }) =>
    value == null ? [] : Array.isArray(value) ? value : [value],
  )
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sports?: string[];

  @Transform(({ value }) =>
    value == null ? [] : Array.isArray(value) ? value : [value],
  )
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facilities?: string[];

  @IsEmail({}, { message: 'this not valid email' })
  email!: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString({ message: 'Website must be a string' })
  @IsOptional()
  website?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateJoined?: Date;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(BiliingType)
  @IsOptional()
  billingType?: BiliingType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(ClubStatus)
  @IsOptional()
  status?: ClubStatus;
  //   @IsBoolean()
  //   isVerivied!: boolean;
}

export class EditedClubDTO extends ClubDTO {}

export class FacilityDTO {
  @IsString()
  facility!: string;
}

export class SportDTO {
  @IsString()
  sport!: string;
}
