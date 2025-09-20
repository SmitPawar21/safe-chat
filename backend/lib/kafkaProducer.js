import { producer } from "./kafka.js";

/**
 * publishMessage - sends a JSON message to a topic
 * topic
 * key - used for partitioning (use receiverId for ordering)
 * message - will be JSON.stringified
 */

export async function publishMessage(topic, key, message) {
  if (!producer) throw new Error("Kafka producer not initialized");
  await producer.send({
    topic,
    messages: [
      {
        key: String(key ?? ""),
        value: JSON.stringify(message),
      },
    ],
  });
}
