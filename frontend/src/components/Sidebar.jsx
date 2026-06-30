import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import {CircleUser, GroupIcon} from 'lucide-react';

const Sidebar = () => {

    const {userSelectedId, users, groups, usersForSidebar, groupsForSidebar, groupSelectedId} = useChatStore();

    const {onlineUsers} = useAuthStore();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchUsers = async() => {
            await usersForSidebar();
            await groupsForSidebar();
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
        <div className='w-[35%] h-full flex flex-col bg-slate-900 border-r border-slate-800 overflow-hidden relative z-20'>
            {/* Header & Search */}
            <div className="p-5 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white mb-4 tracking-wide">Chats</h2>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner text-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {/* Groups Section */}
                {groups.length > 0 && (
                    <div>
                        <div className="px-2 mb-2">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Groups</h3>
                        </div>
                        <div className="space-y-1">
                            {groups.map(group => {
                                const isActive = groupSelectedId === group._id;
                                return (
                                    <div 
                                        key={group._id} 
                                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${isActive ? 'bg-indigo-500/10 shadow-sm' : 'hover:bg-slate-800/50'}`} 
                                        onClick={() => handleSelectGroup(group._id)}
                                    >
                                        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${isActive ? 'bg-indigo-500' : 'bg-slate-700 group-hover:bg-slate-600'} transition-colors`}>
                                            <GroupIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${isActive ? 'text-indigo-100' : 'text-slate-200'}`}>
                                                {group.name}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Personal Chats Section */}
                <div>
                    <div className="px-2 mb-2 flex items-center justify-between">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Direct Messages</h3>
                        <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-0.5 rounded-full">{filteredUsers.length}</span>
                    </div>
                    <div className="space-y-1">
                        {filteredUsers.length === 0 ? (
                            <div className="px-2 py-4 text-center text-slate-500 text-sm">No users found.</div>
                        ) : (
                            filteredUsers.map(user => {
                                const isOnline = onlineUsers.includes(user._id);
                                const isActive = userSelectedId === user._id;
                                
                                return (
                                    <div 
                                        key={user._id} 
                                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${isActive ? 'bg-indigo-500/10 shadow-sm' : 'hover:bg-slate-800/50'}`} 
                                        onClick={() => handleSelectUser(user._id)}
                                    >
                                        <div className="relative">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500/80 to-purple-500/80 text-white font-semibold shadow-sm shrink-0">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            {isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${isActive ? 'text-indigo-100' : 'text-slate-200'}`}>
                                                {user.username}
                                            </p>
                                            <p className={`text-[11px] font-medium truncate ${isOnline ? 'text-emerald-400/80' : 'text-slate-500'}`}>
                                                {isOnline ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

