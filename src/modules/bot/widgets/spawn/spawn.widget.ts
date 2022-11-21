import { InjectModel } from '@nestjs/sequelize'
import { Action, Command, Ctx, Update } from 'nestjs-telegraf'
import { BeastService } from 'src/modules/database/beast.service'
import { BeastModel } from 'src/modules/database/models/beast.model'
import { CallbackDataFactory } from 'src/utils/keyboard'
import { chance } from 'src/utils/math'
import { renderView } from 'src/utils/render'
import { Context } from 'telegraf'
import { getTameKeyboard } from './keyboards/tame.keyboard'

@Update()
export class SpawnWidget {
  constructor(
    @InjectModel(BeastModel) private beastModel: typeof BeastModel,
    private beastService: BeastService,
  ) {}
  
  @Command('spawn')
  async spawnCommand(@Ctx() ctx: Context) {
    const beast = await this.beastService.spawn(ctx.chat.id, '')
    await ctx.replyWithHTML(await renderView('spawn', 'prompt', { beast }), {
      reply_markup: getTameKeyboard(beast.id)
    })
  }

  @Action(CallbackDataFactory.filter('spawn', 'tame'))
  async tameCallback(@Ctx() ctx: Context) {
    const userBeast = await this.beastService.findByUserAndChat(ctx.callbackQuery.from.id, ctx.chat.id)
    console.log(userBeast)
    if (userBeast) {
      await ctx.answerCbQuery('У тебе вже є чудовисько')
      return
    }

    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data)

    const beast = await this.beastService.findById(callbackData.data.beastId)
    if (!beast) throw Error('lol')

    const ch = chance.bool({likelihood: beast.tameChance * 100})
    console.log(ch)

    if (ch) {
      await beast.tame(ctx.callbackQuery.from.id).save()
      await ctx.editMessageText(await renderView('spawn', 'success', { user: ctx.callbackQuery.from }), { parse_mode: 'HTML' })
    }
    else
      await ctx.editMessageText(await renderView('spawn', 'failed', { user: ctx.callbackQuery.from }), { parse_mode: 'HTML' })
  }
}
