import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Club } from 'src/admin/entities/club.entity';

@Table({
  tableName: 'events',
  timestamps: true,
})
export class Event extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare title: string;
  @Column({
    type: DataType.INTEGER,
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare max_capacity: number;
  @Column({
    type: DataType.INTEGER,
  })
  declare current_capacity: number;

  @Column({
    type: DataType.DATE,
  })
  declare start_date: Date;
  @Column({
    type: DataType.DATE,
  })
  declare end_date: Date;

  @Column({
    type: DataType.STRING,
  })
  declare category: string;

  @ForeignKey(() => Club)
  @Column({
    type: DataType.INTEGER,
  })
  declare clubId: number;
  @BelongsTo(() => Club)
  declare club: Club;
}
