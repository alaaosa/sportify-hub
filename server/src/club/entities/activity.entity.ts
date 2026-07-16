import { Model } from 'sequelize-typescript';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Club } from 'src/admin/entities/club.entity';
import { Slot } from './slot.entity';

@Table({
  tableName: 'activities',
  timestamps: true,
})
export class Activity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;
  @Column({
    type: DataType.STRING,
  })
  declare coach_name: string;
  @Column({
    type: DataType.STRING,
  })
  declare category: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare price: number;

  @ForeignKey(() => Club)
  @Column({
    type: DataType.INTEGER,
  })
  declare clubId: number;

  @BelongsTo(() => Club)
  declare club: Club;

  @HasMany(() => Slot)
  declare slots: Slot[];
}
