import React, { useEffect, useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';

const MessageWindow = () => {

  const { userSelectedId, selectedUserData, sendMessage } = useChatStore();
  const { authUser, getUserDataById } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [sendMessageValue, setSendMessageValue] = useState("");
  const [receiverName, setReceiverName] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const result = await selectedUserData(userSelectedId);
      console.log("fetchDetails: ", result);
      setMessages(result);

      const receiver = await getUserDataById(userSelectedId);
      console.log("receiver ka data: ", receiver);
      setReceiverName(receiver.username);
    }

    fetchDetails();
  }, [userSelectedId]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setSendMessageValue(val);
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(userSelectedId, sendMessageValue, "");
    setSendMessageValue("");

    const updatedMessages = await selectedUserData(userSelectedId);
    setMessages(updatedMessages);
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className='bg-slate-700 w-[65%] h-full flex flex-col'>

      <div className="flex justify-between bg-black px-4 py-3 w-full">
        <div className="flex items-center space-x-3">
          <h1>You Are Talking With <strong>{receiverName}</strong></h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((msg, index) => {
          var isOwnMessage = msg.senderId === authUser;
          console.log("ownmessage hai kya re", isOwnMessage)
          const showDate = index === 0 ||
            formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

          return (
            <div key={msg.id}>
              {/* Date separator */}
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* Message bubble */}
              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-300 text-gray-800 rounded-bl-md'
                  }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-black px-4 py-3 w-full">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sendMessageValue}
            onChange={handleInput}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200" onClick={handleSendMessage}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageWindow