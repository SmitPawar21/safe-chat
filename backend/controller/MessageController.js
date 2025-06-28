import Message from "../model/Message.js"
import {getReceiverSocketId, io} from "../lib/socket.js";
import { decryptText, encryptText } from "../lib/encrypt.js";

const safeDecrypt = (encryptedText) => {
  try {
    return decryptText(encryptedText);
  } catch (err) {
    return encryptedText; // fallback: return original plain text if decryption fails
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const msgs = await Message.find();

    const decryptedMsgs = msgs.map(msg => ({
      ...msg.toObject(),
      text: safeDecrypt(msg.text),
    }));

    return res.status(200).json({ "message": "success", "messages": decryptedMsgs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ "error": "INTERNAL SERVER ERROR" });
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
      ]
    });

    const decryptedMessages = messages.map(msg => ({
      ...msg.toObject(),
      text: safeDecrypt(msg.text),
    }));

    return res.status(200).json({ "messages": decryptedMessages });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ "error": "INTERNAL SERVER ERROR" });
  }
};

export const sendMessage = async (req, res) => {
    try {
        console.log("yeh hai aapka user yayy: ", req.user);
        const {id: userToChatId} = req.params;
        const myId = req.user.id;

        const {text, image} = req.body;

        let imageurl;
        if(image) {
            // upload it on aws
        }

        const encryptedText = encryptText(text);

        console.log(encryptedText);

        const newMessage = new Message({
            senderId: myId,
            receiverId: userToChatId,
            text: encryptedText,
            image: imageurl
        });

        await newMessage.save();

        // database me save hone ke baad socket functionality -

        const receiverSocketId = getReceiverSocketId(userToChatId);
        if(receiverSocketId) {
            const decryptedMsg = decryptText(newMessage.text);
            io.to(receiverSocketId).emit("newMessage",  {
                ...newMessage.toObject(),
                text: decryptedMsg, 
            });
        }

        return res.status(200).json({"message": "success", "message": newMessage});

    } catch (err) {
        console.log(err);
        return res.status(500).json({"error": "INTERNAL SERVER ERROR"});
    }
}