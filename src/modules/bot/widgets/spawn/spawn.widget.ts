import { InjectModel } from '@nestjs/sequelize';
import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { BeastService } from '../../../database/services/beast.service';
import { BeastModel } from 'src/modules/database/models/beast.model';
import { CallbackDataFactory, chance, renderView } from 'src/utils';
import { Context } from 'telegraf';
import { getTameKeyboard } from './spawn.keyboards';
import { ImageService } from 'src/modules/api/services/image.service';

@Update()
export class SpawnWidget {
  constructor(
    @InjectModel(BeastModel) private beastModel: typeof BeastModel,
    private beastService: BeastService,
    private imageService: ImageService,
  ) {}

  @Command('spawn')
  async spawnCommand(@Ctx() ctx: Context) {
    const beast = await this.beastService.spawn(ctx.chat.id, await this.imageService.generateBeastImage());
    await ctx.replyWithPhoto(beast.image, {
      caption: await renderView('spawn', 'prompt', { beast }),
      reply_markup: getTameKeyboard(beast.id),
      parse_mode: 'HTML',
    });
  }

  @Action(CallbackDataFactory.filter('spawn', 'tame'))
  async tameCallback(@Ctx() ctx: Context) {
    const userBeast = await this.beastService.findByUserAndChat(ctx.callbackQuery.from.id, ctx.chat.id);
    if (userBeast) {
      await ctx.answerCbQuery('У тебе вже є чудовисько');
      return;
    }

    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data);
    const beast = await this.beastService.findById(callbackData.data.beastId);
    if (!beast) throw Error('lol');

    if (chance.bool({ likelihood: beast.tameChance * 100 })) {
      await beast.tame(ctx.callbackQuery.from.id).save();
      await ctx.editMessageCaption(await renderView('spawn', 'success', { user: ctx.callbackQuery.from }), {
        parse_mode: 'HTML',
      });
    } else {
      await ctx.editMessageCaption(await renderView('spawn', 'failed', { user: ctx.callbackQuery.from }), {
        parse_mode: 'HTML',
      });
    }
  }

  @Command('drop')
  async dropCommand(@Ctx() ctx: Context) {
    this.beastService.drop(ctx.chat.id);
    await ctx.replyWithPhoto(this.imageService.getDropImage(), {
      caption: await renderView('spawn', 'drop', {}),
      parse_mode: 'HTML',
    });
  }
}
