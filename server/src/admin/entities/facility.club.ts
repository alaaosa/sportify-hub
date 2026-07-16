import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Club } from './club.entity';
import { Sport } from './sports';
import { Facility } from './facilities';

@Table({
  tableName: 'facilities_club',
  timestamps: true,
})
export class FacilityClub extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Club)
  @Column({
    type: DataType.INTEGER,
  })
  declare clubId: number;

  @BelongsTo(() => Club)
  declare club: Club;

  @ForeignKey(() => Facility)
  @Column({
    type: DataType.INTEGER,
  })
  declare facilityId: number;

  @BelongsTo(() => Facility)
  declare facility: Facility;
}
