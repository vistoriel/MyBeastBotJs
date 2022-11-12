import { Telegraf } from "telegraf"
import dotenv from "dotenv"
dotenv.config()

const token: string = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : ''

const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

console.log('Bot started!')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))