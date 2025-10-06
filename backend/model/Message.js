import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: false
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
}, {timestamps: true});

messageSchema.pre('save', function (next) {
    if(!this.receiverId && !this.groupId) {
        return next(new Error("Message must have either receiver id or group id"));
    }

    next();
})

export default mongoose.model("Message", messageSchema);