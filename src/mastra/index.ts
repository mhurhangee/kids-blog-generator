import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { blogPublisherAgent } from './agents/blogPublisher';

export const mastra = new Mastra({
  agents: { blogPublisherAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});