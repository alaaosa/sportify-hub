import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { BiliingType, ClubStatus } from 'src/common/enums/index.enum';
import { User } from 'src/user/entities/user.entity';
import { Sport } from './sports';
import { SportClub } from './sport.club';
import { FacilityClub } from './facility.club';
import { Facility } from './facilities';
import { Event } from 'src/club/entities/event.entity';

@Table({
  tableName: 'clubs',
  timestamps: true,
})
export class Club extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  // @ForeignKey(() => User)
  // @Column({
  //   type: DataType.INTEGER,
  // })
  // declare userId: number;

  // @BelongsTo(() => User)
  // declare adminClub: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare clubName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare decription: string;
  @Column({ type: DataType.STRING, allowNull: false })
  declare city: string;
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare maxMembers: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare address: string;
  @Column({ type: DataType.STRING, allowNull: false })
  declare workingHoures: string;

  @Column({
    type: DataType.STRING,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
  })
  declare webiste: string;
  @Column({
    type: DataType.DATE,
  })
  declare dateJoined: Date;
  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(BiliingType)],
    },
  })
  declare billingType: BiliingType;

  @Column({
    type: DataType.INTEGER,
  })
  declare price: number;

  @Column({
    type: DataType.DATE,
  })
  declare startDate: Date;

  @Column({
    type: DataType.DATE,
  })
  declare endDate: Date;

  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [Object.values(ClubStatus)],
    },
  })
  declare status: ClubStatus;

  @BelongsToMany(() => Sport, () => SportClub)
  declare sports: Sport[];

  @BelongsToMany(() => Facility, () => FacilityClub)
  declare facilities: Facility[];

  //   @Column({
  //     type:DataType.BOOLEAN

  //   })

  //   isVerivied;
}
