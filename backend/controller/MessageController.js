import Message from "../model/Message.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { decryptText, encryptText } from "../lib/encrypt.js";
import { publishMessage } from "../lib/kafkaProducer.js";

const safeDecrypt = (encryptedText) => {
  try {
    return decryptText(encryptedText);
  } catch (err) {
    return encryptedText; // fallback
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const msgs = await Message.find();
    const decryptedMsgs = msgs.map((msg) => ({
      ...msg.toObject(),
      text: safeDecrypt(msg.text),
    }));
    return res.status(200).json({ message: "success", messages: decryptedMsgs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getMessageForOne = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    const decryptedMessages = messages.map((msg) => ({
      ...msg.toObject(),
      text: safeDecrypt(msg.text),
    }));

    return res.status(200).json({ messages: decryptedMessages });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    console.log("userTochatId: ", userToChatId);
    
    const { text, image } = req.body;
    
    let imageurl;
    if (image) {
      // upload it on aws (same as your existing logic)
    }
    
    const encryptedText = encryptText(text);
    
    const newMessage = new Message({
      senderId: myId,
      receiverId: userToChatId,
      text: encryptedText,
      image: imageurl,
    });
    
    await newMessage.save();
    
    // Prepare the payload consumers/clients expect (send decrypted text to client)
    const decryptedMsg = safeDecrypt(newMessage.text);
    const originServerId = process.env.SERVER_ID || "1";
    
    const payload = {
      ...newMessage.toObject(),
      text: decryptedMsg,
      originServerId,
    };
    
    // 1) Emit locally to the connected receiver (if they are on this server)
    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", payload);
    }
    
    console.log("Receiver socket id for", userToChatId, "=", receiverSocketId);
    // 2) Publish to Kafka so all other server instances (consumers) will deliver
    //    Use receiver id as key so messages for same receiver go to same partition (preserve order)
    await publishMessage("private-chat-messages", userToChatId, payload);
    
    return res.status(200).json({ message: "success", messageObj: newMessage });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
