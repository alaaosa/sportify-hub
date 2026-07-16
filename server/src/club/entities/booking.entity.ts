import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Slot } from './slot.entity';

@Table({
  timestamps: true,
  tableName: 'bookings',
})
export class Booking extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number;
  @ForeignKey(() => Slot)
  @Column({
    type: DataType.INTEGER,
  })
  declare slotId: number;

  @BelongsTo(() => Slot)
  declare slot: Slot;

  @BelongsTo(() => User)
  declare user: User;
}
