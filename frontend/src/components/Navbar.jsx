import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Cog, LogOut, MessageSquare, MessagesSquare, User } from 'lucide-react';

const Navbar = () => {

    const { authUser, logout, getUserForProfile } = useAuthStore();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [userData, setUserData] = useState({});

    const handleProfile = async () => {
        setIsProfileModalOpen(true);
        const user = await getUserForProfile(authUser.id);
        console.log(user);
        setUserData({
            username: user.username,
            createdTime: user.createdAt,
        })
    }

    return (
        <div className='relative flex justify-between w-full h-[10vh] items-center pl-[50px]'>
            <h1 className='flex gap-1 p-1 cursor-pointer'>
                <MessagesSquare />
                Safe Chat
            </h1>
            <ul className='flex gap-[10px] pr-[50px]'>
                <li className='flex gap-1 p-1 bg-gray-700 cursor-pointer hover:bg-gray-800' href="/settings">
                    <Cog />
                    Settings
                </li>
                {authUser && <li className='flex gap-1 p-1 bg-gray-700 cursor-pointer hover:bg-gray-800' href="/profile" onClick={handleProfile}>
                    <User />
                    Profile
                </li>}
                {authUser && <li className='flex gap-1 p-1 bg-gray-700 cursor-pointer hover:bg-gray-800' onClick={logout}>
                    <LogOut />
                    Logout
                </li>}
                {
                    isProfileModalOpen && <div className="absolute top-[10vh] p-4 w-[200px] border bg-gray-300 rounded-lg shadow-lg flex flex-col justify-between gap-3">
                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">{userData.username}</h1>
                            <h3 className="text-sm text-gray-700">{userData.createdTime}</h3>
                        </div>

                        <button
                            className="mt-2 w-full px-3 py-1 bg-white text-red-500 border border-red-400 rounded hover:bg-red-100 transition"
                            onClick={() => setIsProfileModalOpen(false)} // You'll implement this
                        >
                            Close
                        </button>
                    </div>

                }
            </ul>
        </div>
    )
}

export default Navbar;