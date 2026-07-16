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
  tableName: 'coaches',
  timestamps: true,
})
export class Coach extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;
  @Column({
    type: DataType.STRING,
  })
  declare fullName: string;
  @Column({
    type: DataType.STRING,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
  })
  declare phone: string;
  @Column({
    type: DataType.INTEGER,
  })
  declare experience: number;
  @Column({
    type: DataType.STRING,
  })
  declare spechiality: string;
  @Column({
    type: DataType.STRING,
  })
  declare sport: string;
  @Column({
    type: DataType.STRING,
  })
  declare bio: string;

  @ForeignKey(() => Club)
  @Column({
    type: DataType.INTEGER,
  })
  declare clubId: number;

  @BelongsTo(() => Club)
  declare club: Club;
}
