import { CallbackDataFactory } from 'src/utils/keyboard';
import { Markup } from 'telegraf';

const infoCDF = CallbackDataFactory.new('info', ['userId', 'beastId']);

export function getGeneralKeyboard(userId, beastId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📈 Статистика', infoCDF.prepare('stat', userId, beastId))],
    [Markup.button.callback('Перейменувати', infoCDF.prepare('rename', userId, beastId))],
  ]).reply_markup;
}

export function getStatKeyboard(userId, beastId) {
  return Markup.inlineKeyboard([[Markup.button.callback('😈 Головне', infoCDF.prepare('general', userId, beastId))]])
    .reply_markup;
}
