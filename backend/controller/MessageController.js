import Message from "../model/Message.js"

export const getAllMessages = async (req, res) => {
    try {
        const msgs = await Message.find();

        return res.status(201).json({"message": "success", "messages": msgs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({"error": "INTERNAL SERVER ERROR"});
    }
}

export const getMessageForOne = async (req, res) => {
    try {
        const {id: userToChatId} = req.params; // destructuring
        // this line can also be written as:
        // const userToChatId = req.params.id;

        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        })

        return res.status(200).json({"messages": messages});

    } catch (err) {
        console.log(err);
        return res.status(500).json({"error": "INTERNAL SERVER ERROR"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        console.log("yeh hai aapka user yayy: ", req.user);
        const {id: userToChatId} = req.params;
        const myId = req.user.id;

        const {text, image} = req.body;

        let imageurl;
        if(image) {
            // upload it on cloudinary
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: userToChatId,
            text: text,
            image: imageurl
        });

        await newMessage.save();

        // Real time functionality goes here : socket.io

        return res.status(200).json({"message": "success", "message": newMessage});

    } catch (err) {
        console.log(err);
        return res.status(500).json({"error": "INTERNAL SERVER ERROR"});
    }
}