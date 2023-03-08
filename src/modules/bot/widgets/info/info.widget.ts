import { InjectModel } from '@nestjs/sequelize';
import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { ImageService } from 'src/modules/api/services/image.service';
import { BeastModel } from 'src/modules/database/models/beast.model';
import { CallbackDataFactory } from 'src/utils/keyboard';
import { renderView } from 'src/utils/render';
import { Context } from 'telegraf';
import { DataService } from '../../../database/services/data.service';
import { getGeneralKeyboard, getStatKeyboard } from './info.keyboards';

@Update()
export class InfoWidget {
  constructor(
    @InjectModel(BeastModel) private beastModel: typeof BeastModel,
    private dataService: DataService,
    private imageService: ImageService,
  ) {}

  @Command('beast')
  async startCommand(@Ctx() ctx: Context) {
    const beast = await this.dataService.findBeastByUserAndChat(ctx.from.id, ctx.chat.id);
    if (!beast) {
      await ctx.reply(await renderView('info', 'failed', {}));
      return;
    }

    await ctx.replyWithPhoto(beast.image ? beast.image : this.imageService.default, {
      caption: await renderView('info', 'general', { beast }),
      parse_mode: 'HTML',
      reply_markup: getGeneralKeyboard(ctx.from.id, beast.id),
    });
  }

  @Action(CallbackDataFactory.filter('info', 'general'))
  async generalCallback(@Ctx() ctx: Context) {
    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data);
    if (ctx.from.id !== Number(callbackData.data.userId)) {
      await ctx.answerCbQuery('Напиши /beast щоб отримати інформацію про своє чудовисько');
      return;
    }

    const beast = await this.dataService.findBeastById(callbackData.data.beastId);
    if (!beast) {
      await ctx.answerCbQuery('Цього чудовиська вже не існує');
      return;
    }

    await ctx.editMessageCaption(await renderView('info', 'general', { beast }), {
      parse_mode: 'HTML',
      reply_markup: getGeneralKeyboard(ctx.from.id, beast.id),
    });
  }

  @Action(CallbackDataFactory.filter('info', 'stat'))
  async infoCallback(@Ctx() ctx: Context) {
    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data);
    if (ctx.from.id !== Number(callbackData.data.userId)) {
      await ctx.answerCbQuery('Напиши /beast щоб отримати інформацію про своє чудовисько');
      return;
    }

    const beast = await this.dataService.findBeastById(callbackData.data.beastId);
    if (!beast) {
      await ctx.answerCbQuery('Цього чудовиська вже не існує');
      return;
    }

    await ctx.editMessageCaption(await renderView('info', 'stat', { beast }), {
      parse_mode: 'HTML',
      reply_markup: getStatKeyboard(ctx.from.id, beast.id),
    });
  }
}
