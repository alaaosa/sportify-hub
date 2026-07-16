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
  tableName: 'plans',
  timestamps: true,
})
export class Plan extends Model {
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
    type: DataType.INTEGER,
  })
  declare price: number;
  @Column({
    type: DataType.INTEGER,
  })
  declare sessions: number;
  @Column({
    type: DataType.STRING(7),
  })
  declare color: string;

  @Column({
    type: DataType.JSON,
  })
  declare features: string[];

  @ForeignKey(() => Club)
  @Column({
    type: DataType.INTEGER,
  })
  declare clubId: number;

  @BelongsTo(() => Club)
  declare club: Club;
}
