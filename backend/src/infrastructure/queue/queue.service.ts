import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';

import { RedisService } from '../cache/redis.service';
import { LoggerService } from '../../utils/logger.util';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly queues = new Map<string, Queue>();

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async enqueue(
    queueName: string,
    jobName: string,
    payload: Record<string, unknown>,
    options?: JobsOptions,
  ): Promise<string> {
    const queue = this.getOrCreateQueue(queueName);
    const job = await queue.add(jobName, payload, {
      removeOnComplete: 200,
      removeOnFail: 1000,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 500,
      },
      ...options,
    });

    const jobId = String(job.id);
    this.logger.debug('Queued integration job', {
      queueName,
      jobName,
      jobId,
    });
    return jobId;
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all([...this.queues.values()].map((queue) => queue.close()));
    this.queues.clear();
  }

  private getOrCreateQueue(queueName: string): Queue {
    const existingQueue = this.queues.get(queueName);
    if (existingQueue) {
      return existingQueue;
    }

    const queue = new Queue(queueName, {
      connection: this.redisService.getClient(),
    });

    this.queues.set(queueName, queue);
    return queue;
  }
}
