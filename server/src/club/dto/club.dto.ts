import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class ActivityDTo {
  @IsString()
  declare name: string;
  @IsString()
  declare coach_name: string;
  @IsNumber()
  declare price: number;
  @IsString()
  declare category: string;
}

export class EditedActivity extends ActivityDTo {}

export class EventDTO {
  @IsString()
  declare title: string;
  @IsNumber()
  declare price: number;
  @IsNumber()
  declare max_capacity: number;
  @Type(() => Date)
  @IsDate()
  declare start_date: Date;
  @Type(() => Date)
  @IsDate()
  declare end_date: Date;
  @IsString()
  declare category: string;
}

export class EditEventDTO extends EventDTO {}

export class PlanDTO {
  @IsString()
  declare name: string;
  @IsNumber()
  declare price: number;
  @IsNumber()
  declare sessions: number;
  @IsString()
  declare color: string;

  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // try to parse JSON string like '["a","b"]'
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // not a JSON array string
      }
      return value ? [value] : [];
    }
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  declare features: string[];
}

export class EditedPlanDTO extends PlanDTO {}

export class CoachDTO {
  @IsString()
  declare fullName: string;
  @IsString()
  declare email: string;
  @IsString()
  declare phone: string;
  @IsNumber()
  declare experience: number;
  @IsString()
  declare spechiality: string;
  @IsString()
  declare sport: string;
  @IsString()
  declare bio: string;
}

export class EditCoachDTO extends CoachDTO {}

export class SlotDto {
  @IsString()
  declare start_time: string;
  @IsString()
  declare end_time: string;
}
