import { InjectModel } from '@nestjs/sequelize';
import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { BeastService } from '../../../database/services/beast.service';
import { BeastModel } from 'src/modules/database/models/beast.model';
import { CallbackDataFactory } from 'src/utils/keyboard';
import { chance } from 'src/utils/math';
import { renderView } from 'src/utils/render';
import { Context } from 'telegraf';
import { ImageService } from 'src/modules/api/services/image.service';

export const duelCDF = CallbackDataFactory.new('duel', ['firstUserId', 'secondUserId', 'currentUserId']);

@Update()
export class DuelWidget {
  constructor(
    @InjectModel(BeastModel) private beastModel: typeof BeastModel,
    private beastService: BeastService,
    private imageService: ImageService,
  ) {}

  @Command('duel')
  async duelCommand(@Ctx() ctx: Context) {}

  @Action(CallbackDataFactory.filter('duel', 'revoke'))
  async revokeCallback(@Ctx() ctx: Context) {}
}
