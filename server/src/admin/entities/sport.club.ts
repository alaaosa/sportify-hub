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

@Table({
  tableName: 'sports_club',
  timestamps: true,
})
export class SportClub extends Model {
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
  clubId!: number;

  @BelongsTo(() => Club)
  club!: Club;

  @ForeignKey(() => Sport)
  @Column({
    type: DataType.NUMBER,
  })
  sportId!: number;

  @BelongsTo(() => Sport)
  sport!: Sport;
}
