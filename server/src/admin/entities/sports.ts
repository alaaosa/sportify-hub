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
import { SportClub } from './sport.club';

@Table({
  tableName: 'sports',
  timestamps: true,
})
export class Sport extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare sport: string;

  @BelongsToMany(() => Club, () => SportClub)
  clubs!: Club[];
}
