import { Context } from 'telegraf';

export interface Session {
  scene: string | null;
  stage: number | string | null;
  properties: any;
}

export interface ExtendedContext extends Context {
  sessions: {
    chat: Session;
    user: Session;
    commit: () => Promise<void>;
  };
}
