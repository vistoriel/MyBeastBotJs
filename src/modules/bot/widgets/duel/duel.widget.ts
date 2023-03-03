import { InjectModel } from '@nestjs/sequelize';
import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { DataService } from '../../../database/services/data.service';
import { BeastModel } from 'src/modules/database/models/beast.model';
import { CallbackDataFactory } from 'src/utils/keyboard';
import { chance } from 'src/utils/math';
import { renderView } from 'src/utils/render';
import { Context } from 'telegraf';
import { ImageService } from 'src/modules/api/services/image.service';
import { ExtendedContext } from 'src/modules/middlewares/chat-session';

export const duelCDF = CallbackDataFactory.new('duel', ['firstUserId', 'secondUserId', 'currentUserId']);

@Update()
export class DuelWidget {
  constructor(
    @InjectModel(BeastModel) private beastModel: typeof BeastModel,
    private dataService: DataService,
    private imageService: ImageService,
  ) {}

  @Command('duel')
  async duelCommand(@Ctx() ctx: ExtendedContext) {
    console.log('DUEL WIDGET');
    ctx.sessions.chat.properties = 'hello'
    console.log(ctx.sessions);
    ctx.sessions.commit()
  }

  @Action(CallbackDataFactory.filter('duel', 'revoke'))
  async revokeCallback(@Ctx() ctx: Context) {}
}
