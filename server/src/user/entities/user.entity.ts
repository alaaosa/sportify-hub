import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserRole } from 'src/common/enums/index.enum';
import { Optional } from 'sequelize';
import { Club } from 'src/admin/entities/club.entity';

export interface UserAttributes {
  id: number;
  fullName: string;
  email: string;
  pNumber?: string;
  password: string;
  role: UserRole;
  clubId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'pNumber' | 'role' | 'clubId' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare pNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [Object.values(UserRole)],
    },
  })
  declare role: UserRole;

  @ForeignKey(() => Club)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare clubId?: number | null;

  @BelongsTo(() => Club)
  declare club: Club;
}
