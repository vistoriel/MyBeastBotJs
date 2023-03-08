import { InjectModel } from '@nestjs/sequelize';
import { Action, Command, Ctx, Hears, Update } from 'nestjs-telegraf';
import { DataService } from '../../../database/services/data.service';
import { CallbackDataFactory } from 'src/utils/keyboard';
import { chance } from 'src/utils/math';
import { renderView } from 'src/utils/render';
import { ImageService } from 'src/modules/api/services/image.service';
import { ExtendedContext } from 'src/modules/middlewares/chat-session';
import { getRequestKeyboard } from './duel.keyboards';
import { User } from 'telegraf/typings/core/types/typegram';

export interface DuelBeast {
  id: number
  icon: string
  name: string
  maxHealth: number
  health: number
  damage: number
}

export interface DuelPlayer {
  id: number
  name: string
  username: string
  beast: DuelBeast
}

export interface DuelProperties {
  players: DuelPlayer[]
  currentPlayer: number
}

@Update()
export class DuelWidget {
  constructor(
    private dataService: DataService,
  ) {}

  @Command('duel')
  async duelCommand(@Ctx() ctx: ExtendedContext) {
    const playerA = ctx.message.from;

    const beastA = await this.dataService.findBeastByUserAndChat(playerA.id, ctx.chat.id);
    if (!beastA) {
      await ctx.reply('Нажаль в тебе немає чудовиська 🙁', {
        parse_mode: 'HTML'
      })
      return
    }

    const playerB = (ctx.message as any).reply_to_message?.from as User;
    if (!playerB) {
      await ctx.reply('Щоб викликати чудовисько на дуель, треба <u>відповісти</u> на повідомлення його власника командою <code>/duel</code>.', {
        parse_mode: 'HTML'
      })
      return
    }

    const beastB = await this.dataService.findBeastByUserAndChat(playerB.id, ctx.chat.id);
    if (!beastB) {
      await ctx.reply(`Нажаль у ${playerB.first_name} немає чудовиська 🙁`, {
        parse_mode: 'HTML'
      })
      return
    }

    const isSceneEmpty = !ctx.sessions.chat.scene;
    const message = await ctx.reply(await renderView('duel', 'request', { playerA, playerB, isSceneEmpty }), {
      parse_mode: 'HTML',
      reply_markup: getRequestKeyboard(playerA.id, playerB.id)
    })
    await ctx.telegram.forwardMessage(playerA.id, ctx.chat.id, message.message_id)
    await ctx.telegram.sendMessage(playerA.id, `Ви визвали на дуель ${playerB.first_name}`, {
      parse_mode: 'HTML'
    })
    await ctx.telegram.forwardMessage(playerB.id, ctx.chat.id, message.message_id)
    await ctx.telegram.sendMessage(playerB.id, `Вас визвали на дуель ${playerA.first_name}`, {
      parse_mode: 'HTML'
    })
  }

  @Action(CallbackDataFactory.filter('duel', 'revoke'))
  async revokeCallback(@Ctx() ctx: ExtendedContext) {
    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data);
    if (ctx.callbackQuery.from.id !== Number(callbackData.data.playerAId)) {
      await ctx.answerCbQuery('Тільки та(той) хто викликала(в) на дуель може її відкликати')
      return
    }
    await ctx.editMessageText(await renderView('duel', 'revoke', { playerA: ctx.callbackQuery.from }), {
      parse_mode: 'HTML'
    })
  }

  @Action(CallbackDataFactory.filter('duel', 'refuse'))
  async refuseCallback(@Ctx() ctx: ExtendedContext) {
    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data);
    if (ctx.callbackQuery.from.id !== Number(callbackData.data.playerBId)) {
      await ctx.answerCbQuery('Тільки та(той) кого викликали на дуель може відповісти')
      return
    }
    await ctx.editMessageText(await renderView('duel', 'refuse', { playerB: ctx.callbackQuery.from }), {
      parse_mode: 'HTML'
    })
  }

  @Action(CallbackDataFactory.filter('duel', 'accept'))
  async acceptCallback(@Ctx() ctx: ExtendedContext) {
    const callbackData = CallbackDataFactory.parse(ctx.callbackQuery.data);
    if (ctx.callbackQuery.from.id !== Number(callbackData.data.playerBId)) {
      await ctx.answerCbQuery('Тільки та(той) кого викликали на дуель може відповісти')
      return
    }

    if (ctx.sessions.chat.scene) {
      await ctx.answerCbQuery('Зараз вже відбувається якась подія, дочекайтесь її закінчення')
      return
    }

    const playerA = (await ctx.telegram.getChat(callbackData.data.playerAId)) as unknown as User
    const playerB = (await ctx.telegram.getChat(ctx.callbackQuery.from.id)) as unknown as User
    const beastA = await this.dataService.findBeastByUserAndChat(playerA.id, ctx.chat.id);
    const beastB = await this.dataService.findBeastByUserAndChat(playerB.id, ctx.chat.id);
    const duelBeastA: DuelBeast = {
      id: beastA.id,
      icon: '🔷',
      name: beastA.name,
      maxHealth: beastA.health,
      health: beastA.health,
      damage: beastA.damage
    }
    const duelBeastB: DuelBeast = {
      id: beastB.id,
      icon: '🔶',
      name: beastB.name,
      maxHealth: beastB.health,
      health: beastB.health,
      damage: beastB.damage
    }

    ctx.sessions.chat.scene = 'duel';
    ctx.sessions.chat.stage = 'starting';
    ctx.sessions.chat.properties = {
      players: [
        {
          id: playerA.id,
          name: playerA.first_name,
          username: playerA.username,
          beast: duelBeastA
        },
        {
          id: playerB.id,
          name: playerB.first_name,
          username: playerB.username,
          beast: duelBeastB
        }
      ],
      currentPlayer: chance.integer({ min: 0, max: 1 })
    } as DuelProperties
    ctx.sessions.commit()

    await ctx.editMessageText(await renderView('duel', 'starting', { beastA: duelBeastA, beastB: duelBeastB }), {
      parse_mode: 'HTML'
    })
  }


  @Command('session')
  async sessionCommand(@Ctx() ctx: ExtendedContext) {
    await ctx.reply(
      `<b>Сессія чату</b>\n${JSON.stringify(ctx.sessions.chat, null, 2)}\n\n<b>Сессія користувача</b>\n${JSON.stringify(ctx.sessions.user, null, 2)}`,
      { parse_mode: 'HTML' }
    )
  }

  @Command('session_clear')
  async sessionClearCommand(@Ctx() ctx: ExtendedContext) {
    ctx.sessions.chat.scene = null
    ctx.sessions.chat.stage = null
    ctx.sessions.chat.properties = null
    ctx.sessions.commit()

    await ctx.reply('Сессію чату очищено')
  }
}

// if (ctx.sessions.chat.scene) {
//   await ctx.reply('scene is not empty')
//   await ctx.deleteMessage(ctx.message.message_id)
//   return
// }

// ctx.sessions.chat.scene = 'duel';
// ctx.sessions.chat.stage = 'request';
// ctx.sessions.chat.properties = {
//   playerA: {
//     id: playerA.id
//   },
//   playerB: {
//     id: playerB.id
//   }
// } as DuelProperties
// ctx.sessions.commit()