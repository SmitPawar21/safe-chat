import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import {CircleUser, GroupIcon} from 'lucide-react';

const Sidebar = () => {

    const {userSelectedId, usersForSidebar, groupsForSidebar, groupSelectedId} = useChatStore();

    const {onlineUsers} = useAuthStore();

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchUsers = async() => {
            const usersData = await usersForSidebar();
            const groupsData = await groupsForSidebar();
            console.log("sidebar me users = ", usersData);
            console.log("sidebar me groups = ", groupsData);
            setUsers(usersData);
            setGroups(groupsData);
        }
        fetchUsers();
    }, [usersForSidebar]);

    const handleSelectUser = (id) => {
        useChatStore.setState({groupSelected: false});
        useChatStore.setState({groupSelectedId: null});
        console.log("handleSelectUser: ", id);
        useChatStore.setState({userSelected: true}); 
        useChatStore.setState({userSelectedId: id});       
    }

    const handleSelectGroup = (id) => {
        useChatStore.setState({userSelected: false}); 
        useChatStore.setState({userSelectedId: null});
        console.log("handleSelectGroup: ", id);
        useChatStore.setState({groupSelected: true});
        useChatStore.setState({groupSelectedId: id});
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

            <h1>Groups You Are In</h1>
            <div className="space-y-3">
                {groups.map(group => (
                    <div key={group._id} className={`flex items-center gap-[10px] rounded-md p-2 shadow cursor-pointer ${groupSelectedId===group._id ? 'bg-blue-900' : 'bg-[#1F2937]'} `} onClick={() => handleSelectGroup(group._id)}>
                        <GroupIcon />
                        <div className="flex-1">
                            <p className="font-medium text-white">{group.name}</p>
                        </div>  
                    </div>
                ))}
            </div>

            <h1>Personal Chats</h1>
            <div className="space-y-3">
                {filteredUsers.map(user => (
                    <div key={user._id} className={`flex items-center gap-[10px] rounded-md p-2 shadow cursor-pointer ${userSelectedId===user._id ? 'bg-blue-900' : 'bg-[#1F2937]'} `} onClick={() => handleSelectUser(user._id)}>
                        <CircleUser />
                        <div className="flex-1">
                            <p className="font-medium text-white">{user.username}</p>
                            <p className={`text-sm ${onlineUsers.includes(user._id) ? 'text-green-500' : 'text-gray-500'}`}>
                                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                            </p>
                        </div>  
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;

