import { Ctx, Start, Update } from 'nestjs-telegraf'
import { renderView } from 'src/utils/render'
import { Context } from 'telegraf'

@Update()
export class InfoWidget {
  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const str = await renderView('info', 'start', {
      name: ctx.message.from.first_name
    })
    await ctx.reply(str)
  }
}
