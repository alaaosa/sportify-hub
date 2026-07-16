import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Club } from './club.entity';
import { FacilityClub } from './facility.club';

@Table({
  tableName: 'facilities',
  timestamps: true,
})
export class Facility extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  facility!: string;

  @BelongsToMany(() => Club, () => FacilityClub)
  clubs!: Club[];
}
