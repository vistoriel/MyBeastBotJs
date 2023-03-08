import { CallbackDataFactory } from 'src/utils/keyboard';
import { Markup } from 'telegraf';

export const duelCDF = CallbackDataFactory.new('duel', ['playerAId', 'playerBId']);

export function getRequestKeyboard(playerAId: number, playerBId: number) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('⚔️ Прийняти', duelCDF.prepare('accept', playerAId.toString(), playerBId.toString())), 
      Markup.button.callback('🚫 Відмовитись', duelCDF.prepare('refuse', playerAId.toString(), playerBId.toString()))
    ],
    [Markup.button.callback('✌️ Відізвати', duelCDF.prepare('revoke', playerAId.toString(), playerBId.toString()))]
  ]).reply_markup;
}
