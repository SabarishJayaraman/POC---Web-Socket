import { parentPort } from 'worker_threads';
import { EventHubConsumerClient } from '@azure/event-hubs';
import e from 'express';

const consumerClient = new EventHubConsumerClient(
  'consumer',
  'Endpoint=sb://aviio-ns.servicebus.windows.net/;SharedAccessKeyName=consumer;SharedAccessKey=/kYR0ALknk6Lu4vdt4VdUNQc8ha9PBeRW+AEhNEZp8A=;EntityPath=flight-status', //<to-be-changed>
  'flight-status'
);

const subscription = consumerClient.subscribe({
  processEvents: async (events, context) => {
    console.log(`Received ${events.length} events`);
    for (const event of events) {
      console.log(`Event: ${event.body}`);
      console.log(`Event: ${event.partitionKey}`);
      parentPort.postMessage({ body: '' + event.body, partitionKey: event.partitionKey });
    }
  },
  processError: async (err, context) => {
    console.error(err);
  }
});