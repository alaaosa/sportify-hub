import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Activity } from './activity.entity';

@Table({
  tableName: 'slots',
  timestamps: true,
})
export class Slot extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Activity)
  @Column({
    type: DataType.INTEGER,
  })
  declare activityId: number;
  @BelongsTo(() => Activity)
  declare activity: Activity;

  @Column({
    type: DataType.TIME,
  })
  declare start_time: string;
  @Column({
    type: DataType.TIME,
  })
  declare end_time: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_booked: boolean;
}
