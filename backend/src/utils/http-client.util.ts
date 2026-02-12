import axios, { AxiosInstance } from 'axios';
import * as rax from 'retry-axios';

export const buildResilientHttpClient = (timeoutMs = 8_000): AxiosInstance => {
  const client = axios.create({ timeout: timeoutMs });

  client.defaults.raxConfig = {
    retry: 3,
    noResponseRetries: 2,
    backoffType: 'exponential',
    httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE', 'POST'],
    statusCodesToRetry: [
      [100, 199],
      [429, 429],
      [500, 599],
    ],
  };

  rax.attach(client);
  return client;
};
