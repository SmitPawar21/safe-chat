import React, { useEffect, useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';

const MessageWindow = () => {

  const { userSelectedId, selectedUserData, sendMessage, messages, realTimeMessage, offRealTimeMessage, groupSelectedId, getGroupDataById, realTimeMessageForGroup, offRealTimeMessageForGroup } = useChatStore();
  const { authUser, getUserDataById, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [sendMessageValue, setSendMessageValue] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (!userSelectedId) {
      console.log("userSelectedId is null/undefined, skipping fetch");
      return;
    }

    const fetchDetails = async () => {
      offRealTimeMessage();

      await selectedUserData(userSelectedId);

      // Set up new listener
      realTimeMessage();

      const receiver = await getUserDataById(userSelectedId);
      setReceiverName(receiver.username);
    }

    fetchDetails();

    // Cleanup function
    return () => offRealTimeMessage();
  }, [userSelectedId]);

  useEffect(() => {

    if (!groupSelectedId) {
      console.log("groupSelectedId is null/undefined, skipping fetch");
      return;
    }

    console.log("trying to fetch in message window...");
    const fetchDetails = async () => {
      offRealTimeMessage();

      const response = await getGroupDataById(groupSelectedId);
      console.log("response in message controller: ", response);
      // Set up new listener
      realTimeMessageForGroup();
      setGroupName(response.group.name);
    }

    fetchDetails();

    // Cleanup function
    return () => offRealTimeMessageForGroup();
  }, [groupSelectedId]);

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
    
    const newMessage = {
      id: Date.now(), // temporary unique ID
      text: sendMessageValue,
      senderId: authUser, // make sure this matches how you compare sender in your UI
      createdAt: new Date().toISOString(),
    };

    // Optimistically update messages locally (before backend response)
    useChatStore.setState((state) => ({
      messages: [...state.messages, newMessage],
    }));

    try {
      await sendMessage(sendMessageValue, "", userSelectedId, groupSelectedId);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
    setSendMessageValue("");
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
    <div className='bg-slate-900 w-[65%] h-full flex flex-col relative overflow-hidden'>
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md px-6 py-4 w-full border-b border-slate-800 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 ring-2 ring-slate-800">
            {userSelectedId ? (receiverName?.charAt(0)?.toUpperCase() || '?') : groupSelectedId ? (groupName?.charAt(0)?.toUpperCase() || '?') : '?'}
          </div>
          <div className="flex flex-col">
            {userSelectedId && (
              <>
                <h1 className="text-slate-100 font-semibold text-lg tracking-wide">{receiverName}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {onlineUsers.includes(userSelectedId) ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <p className="text-emerald-400/80 text-xs font-medium">Online</p>
                    </>
                  ) : (
                    <>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                      <p className="text-slate-500 text-xs font-medium">Offline</p>
                    </>
                  )}
                </div>
              </>
            )}
            {groupSelectedId && (
              <>
                <h1 className="text-slate-100 font-semibold text-lg tracking-wide">{groupName}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  <p className="text-indigo-400/80 text-xs font-medium">Group Chat</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, index) => {
          var isOwnMessage = msg.senderId === authUser;
          const showDate = index === 0 ||
            formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

          return (
            <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Date separator */}
              {showDate && (
                <div className="flex justify-center my-6">
                  <span className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-400 text-xs px-4 py-1.5 rounded-full font-medium shadow-sm">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* Message bubble */}
              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group mt-2 transition-all`}>
                <div className={`max-w-[85%] lg:max-w-[70%] px-5 py-3 rounded-2xl relative shadow-sm transition-transform hover:-translate-y-0.5 ${isOwnMessage
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm shadow-indigo-500/20'
                  : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-bl-sm'
                  }`}>
                  <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                  <p className={`text-[11px] mt-1.5 font-medium flex items-center gap-1 ${isOwnMessage ? 'text-indigo-100/80 justify-end' : 'text-slate-500 justify-start'
                    }`}>
                    {formatTime(msg.createdAt)}
                    {isOwnMessage && (
                      <svg className="w-3 h-3 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input area */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-4 z-10 w-full">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full pl-6 pr-12 py-3.5 bg-slate-800 border border-slate-700/50 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-200 placeholder-slate-500 transition-all shadow-inner text-[15px]"
              value={sendMessageValue}
              onChange={handleInput}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            />
          </div>
          <button 
            className={`flex items-center justify-center p-3.5 rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
              ${sendMessageValue.trim() 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/40 active:scale-95' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'}`} 
            onClick={sendMessageValue.trim() ? handleSendMessage : undefined}
            disabled={!sendMessageValue.trim()}
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${sendMessageValue.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageWindow