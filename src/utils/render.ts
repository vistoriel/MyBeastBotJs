import * as ejs from 'ejs'
import sequelize from 'sequelize'

/**
 * Render given `view` EJS file.
 */
export async function renderView(widget: string, view: string, data: ejs.Data = {}): Promise<string> {
  return ejs.renderFile(`src/modules/bot/widgets/${widget}/views/${view}.ejs`, data)
}
