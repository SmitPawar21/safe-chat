import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';

const Sidebar = () => {

    const {userSelectedId, usersForSidebar} = useChatStore();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchUsers = async() => {
            const data = await usersForSidebar();
            console.log("sidebar me users = ", data);
            setUsers(data);
        }
        fetchUsers();
    }, [usersForSidebar]);

    const handleSelectUser = (id) => {
        console.log("handleSelectUser: ", id);
        useChatStore.setState({userSelected: true}); 
        useChatStore.setState({userSelectedId: id});       
    }

    return (
        <div className='bg-black w-[35%] h-full p-4 overflow-y-scroll'>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-4 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-3">
                {filteredUsers.map(user => (
                    <div key={user._id} className={`flex items-center rounded-md p-2 shadow cursor-pointer ${userSelectedId===user._id ? 'bg-blue-500' : 'bg-[#1F2937]'} `} onClick={() => handleSelectUser(user._id)}>
                        <img
                            src={user.profilePhoto}
                            alt={user.username}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-1">
                            <p className="font-medium text-white">{user.username}</p>
                            <p className={`text-sm ${user.online ? 'text-green-600' : 'text-gray-500'}`}>
                                {user.online ? 'Online' : 'Offline'}
                            </p>
                        </div>  
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;

