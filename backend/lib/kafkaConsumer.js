import { kafka } from "./kafka.js";
import { getReceiverSocketId } from "./socket.js";

/**
 * startKafkaConsumer(io)
 * Subscribes to topics and routes incoming Kafka messages to socket.io clients.
 *
 * NOTE: consumer group is set using SERVER_ID so that each server instance
 * receives all messages (each server must have a unique SERVER_ID).
 */
export async function startKafkaConsumer(io) {
  const serverId = process.env.SERVER_ID || "1";
  const groupId = process.env.KAFKA_CONSUMER_GROUP || `safechat-consumer-${serverId}`;

  const consumer = kafka.consumer({ groupId });
  await consumer.connect();

  // topics to subscribe
  await consumer.subscribe({ topic: "private-chat-messages", fromBeginning: false });
  await consumer.subscribe({ topic: "user-status-updates", fromBeginning: false });

  console.log("✅ Kafka consumer connected & subscribed (groupId:", groupId, ")");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const raw = message.value.toString();
        const parsed = JSON.parse(raw);

        // Avoid broadcasting messages originated by this server (we already emit locally)
        const origin = parsed.originServerId || null;
        const myServerId = process.env.SERVER_ID || "1";
        if (origin && origin === myServerId) return;

        if (topic === "private-chat-messages") {
          // parsed should include receiverId and the decrypted text
          const receiverSocketId = getReceiverSocketId(parsed.receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", parsed);
          } else {
            // user not connected to THIS server — other servers won't be able to send, but they will if they are consumers.
            // we simply skip (they'll get it on servers where they are connected).
          }
        } else if (topic === "user-status-updates") {
          // broadcast presence change to all connected clients of this server
          io.emit("userStatusUpdate", parsed);
        }
      } catch (err) {
        console.error("Error handling kafka message:", err);
      }
    },
  });
}
