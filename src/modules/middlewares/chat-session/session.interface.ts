import { Context } from "telegraf";

export interface Session {
  [key: string]: any
}

export interface ExtendedContext extends Context {
  sessions: {
    chat: Session
    user: Session
    commit: () => Promise<void>
  }
}
