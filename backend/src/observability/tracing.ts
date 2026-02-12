import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

let sdk: NodeSDK | null = null;

export const bootstrapTracing = (): void => {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint || sdk) return;

  sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({ url: endpoint }),
  });

  sdk.start();
};
