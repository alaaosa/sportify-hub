import { InjectModel } from '@nestjs/sequelize';
import { User, UserCreationAttributes } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  findById(id: number) {
    return this.userModel.findByPk(id);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  create(user: UserCreationAttributes) {
    return this.userModel.create(user);
  }

  getAllUser(clubId: number) {
    return this.userModel.findAndCountAll({ where: { clubId }, raw: true });
  }
}
