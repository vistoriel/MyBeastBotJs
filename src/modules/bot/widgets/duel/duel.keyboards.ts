import { CallbackDataFactory } from 'src/utils/keyboard';
import { Markup } from 'telegraf';

const tameCDF = CallbackDataFactory.new('spawn', ['beastId']);

export function getTameKeyboard(beastId) {
  return Markup.inlineKeyboard([[Markup.button.callback('Спробувати приручити', tameCDF.prepare('tame', beastId))]])
    .reply_markup;
}
