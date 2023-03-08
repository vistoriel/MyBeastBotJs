import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BeastModel } from '../models/beast.model';
import { chance } from 'src/utils/math';
import { SessionModel } from '@database/models';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(BeastModel) public beastModel: typeof BeastModel,
    @InjectModel(SessionModel) public sessionModel: typeof SessionModel,
  ) {}

  async findBeastById(id: number): Promise<BeastModel> {
    return this.beastModel.findOne({ where: { id } });
  }

  async findBeastByUserAndChat(userId: number, chatId: number): Promise<BeastModel> {
    return this.beastModel.findOne({ where: { userId, chatId } });
  }

  async spawnBeast(chatId: number, image?: string): Promise<BeastModel> {
    return this.beastModel.create({
      chatId,
      image,
      name: 'Чудовисько',
      experience: chance.integer({ min: 5, max: 12 }),
      basicHealth: chance.integer({ min: 5, max: 30 }),
      basicDamage: chance.integer({ min: 5, max: 11 }),
    });
  }

  async drop(chatId: number): Promise<number> {
    return this.beastModel.destroy({ where: { chatId } });
  }
}
