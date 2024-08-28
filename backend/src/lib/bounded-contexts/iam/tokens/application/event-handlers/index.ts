import { RefreshTokenUsedEventHandler } from './refresh-token-used-event.handler';
import { TokenGeneratedEventHandler } from './token-generated.event.handler';

export const EventHandlers = [
  TokenGeneratedEventHandler,
  RefreshTokenUsedEventHandler,
];
