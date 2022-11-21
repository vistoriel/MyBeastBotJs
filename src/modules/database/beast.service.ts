import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { BeastModel } from './models/beast.model'
import { getRandomInteger } from 'src/utils/math'
import { chance } from 'src/utils/math'

@Injectable()
export class BeastService {
  constructor(
    @InjectModel(BeastModel) private beastModel: typeof BeastModel,
  ) {}

  async findById(id: number): Promise<BeastModel> {
    return this.beastModel.findOne({where: { id }})
  }

  async findByUserAndChat(userId: number, chatId: number): Promise<BeastModel> {
    return this.beastModel.findOne({where: { userId, chatId }})
  }

  async spawn(chatId: number, image?: string): Promise<BeastModel> {
    return this.beastModel.create({
      chatId,
      image,
      name: 'Чудовисько',
      experience: chance.integer({min: 5, max: 12}),
      basicHealth: chance.integer({min: 5, max: 30}),
      basicDamage: chance.integer({min: 5, max: 11})
    })
  }

  async drop(chatId: number): Promise<number> {
    return this.beastModel.destroy({where: { chatId }})
  }
}
