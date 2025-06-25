import React from 'react'
import { EyeOff, Shield, MessageCircle, Lock, Sparkles } from "lucide-react";

const NoChatOpen = () => {
  return (
    <div className='bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 w-[65%] h-full flex items-center justify-center relative overflow-hidden'>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-blue-200 rounded-full animate-pulse delay-700"></div>
      </div>
      
      {/* Main content */}
      <div className="text-center z-10 px-8">
        {/* Logo area with shield and eye icon */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-200 animate-pulse" />
              <EyeOff className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          {/* App name with gradient text */}
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-2 tracking-tight">
            SafeChat
          </h1>
          
          {/* Tagline */}
          <p className="text-blue-200 text-lg font-medium mb-8">
            Secure conversations, complete privacy
          </p>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Lock className="w-6 h-6 text-blue-300 mb-2" />
            <span className="text-xs text-blue-200 font-medium">Encrypted</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <EyeOff className="w-6 h-6 text-blue-300 mb-2" />
            <span className="text-xs text-blue-200 font-medium">Private</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-blue-300 mb-2" />
            <span className="text-xs text-blue-200 font-medium">Secure</span>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-blue-300">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Select a chat to start messaging</span>
          </div>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
          
          <p className="text-xs text-blue-400 opacity-75">
            Your messages are end-to-end encrypted
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-xl"></div>
    </div>
  )
}

export default NoChatOpen;