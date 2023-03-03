import { Injectable } from "@nestjs/common";
import { ExtendedContext, Session } from ".";
import { DataService } from "@database/services";
import { MiddlewareFn } from "telegraf";
import { SessionModel } from "@database/models";

@Injectable()
export class SessionService {
  constructor(private dataService: DataService) {}
  
  public middleware(): MiddlewareFn<ExtendedContext> {
    return async (ctx: ExtendedContext, next: () => Promise<void>) => {
      const chatSession = await this.findOrCreateChatSession(ctx.chat.id);
      ctx.sessions = {
        chat: JSON.parse(chatSession.dataValues.value),
        user: JSON.parse(chatSession.dataValues.value),
        commit: async () => {
          await this.updateChatSession(ctx.chat.id, ctx.sessions.chat);
        }
      }
      await next()
    }
  }

  public async updateChatSession(chatId: number, session: Session): Promise<void> {
    const value = JSON.stringify(session);
    await this.dataService.sessionModel.update({ value }, {
      where: { chatId, isUser: false }
    })
  }

  private async findOrCreateChatSession(chatId: number): Promise<SessionModel> {
    const [session, created] = await this.dataService.sessionModel.findOrCreate({
      where: { chatId, isUser: false },
      defaults: { value: '{"scene":null,"stage":null,"properties":null}' }
    });
    return session;
  }
}
