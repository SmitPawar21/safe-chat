
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import NoChatOpen from '../components/NoChatOpen';
import MessageWindow from '../components/MessageWindow';
import { useChatStore } from '../store/useChatStore';

const HomePage = () => {

  const {userSelected} = useChatStore();
  console.log("selected user = ", userSelected);

  return (
    <div className='flex justify-center items-center top-10 overflow-hidden'>
      <div className='h-[90vh] w-[95vw] bg-[#4B352A] flex'>
        <Sidebar />
        {
          userSelected ? <MessageWindow /> : <NoChatOpen />
        }
      </div>
    </div>
  )
}

export default HomePage