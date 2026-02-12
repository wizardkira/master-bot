declare module 'bullmq' {
  export interface JobsOptions {
    removeOnComplete?: number | boolean;
    removeOnFail?: number | boolean;
    attempts?: number;
    backoff?: {
      type: string;
      delay: number;
    };
    [key: string]: unknown;
  }

  export class Queue {
    constructor(name: string, options?: { connection?: unknown });
    add(
      name: string,
      data: Record<string, unknown>,
      options?: JobsOptions,
    ): Promise<{ id?: string | number }>;
    close(): Promise<void>;
  }
}
