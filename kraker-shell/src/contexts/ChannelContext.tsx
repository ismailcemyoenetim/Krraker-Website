import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  nickname: string;
  timestamp: Timestamp;
  userId: string;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
}

interface ChannelUser {
  id: string;
  nickname: string;
  role?: string;
  lastActive: Timestamp;
}

interface ChannelContextType {
  currentChannel: string;
  channels: Channel[];
  messages: Message[];
  channelUsers: ChannelUser[];
  setCurrentChannel: (channelId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  createChannel: (name: string, description?: string) => Promise<void>;
  joinChannel: (channelId: string) => Promise<void>;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
};

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChannel, setCurrentChannel] = useState<string>('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelUsers, setChannelUsers] = useState<ChannelUser[]>([]);
  const { currentUser, nickname } = useAuth();

  // Fetch available channels
  useEffect(() => {
    const channelsRef = collection(firestore, 'channels');
    const q = query(channelsRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const channelList: Channel[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        channelList.push({
          id: doc.id,
          name: data.name,
          description: data.description || '',
          createdAt: data.createdAt,
        });
      });
      
      setChannels(channelList);
      
      // Set default channel if needed
      if (channelList.length > 0 && !currentChannel) {
        setCurrentChannel(channelList[0].id);
      }
    });
    
    return () => unsubscribe();
  }, [currentChannel]);

  // Fetch messages for current channel
  useEffect(() => {
    if (!currentChannel) return;

    const messagesRef = collection(firestore, `channels/${currentChannel}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: Message[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageList.push({
          id: doc.id,
          content: data.content,
          nickname: data.nickname,
          timestamp: data.timestamp,
          userId: data.userId,
        });
      });
      
      setMessages(messageList);
    });
    
    return () => unsubscribe();
  }, [currentChannel]);

  // Fetch active users in current channel
  useEffect(() => {
    if (!currentChannel) return;

    const usersRef = collection(firestore, `channels/${currentChannel}/users`);
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    const q = query(
      usersRef, 
      where('lastActive', '>', Timestamp.fromDate(fiveMinutesAgo))
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList: ChannelUser[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        userList.push({
          id: doc.id,
          nickname: data.nickname,
          role: data.role || 'user',
          lastActive: data.lastActive,
        });
      });
      
      setChannelUsers(userList);
    });
    
    return () => unsubscribe();
  }, [currentChannel]);

  // Send message to current channel
  const sendMessage = async (content: string) => {
    if (!currentUser || !currentChannel) return;
    
    const messagesRef = collection(firestore, `channels/${currentChannel}/messages`);
    
    await addDoc(messagesRef, {
      content,
      nickname: nickname || 'Anonymous',
      userId: currentUser.uid,
      timestamp: serverTimestamp(),
    });
  };

  // Create a new channel
  const createChannel = async (name: string, description?: string) => {
    if (!currentUser) return;
    
    const channelsRef = collection(firestore, 'channels');
    
    const docRef = await addDoc(channelsRef, {
      name,
      description,
      createdAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });
    
    setCurrentChannel(docRef.id);
  };

  // Join a channel
  const joinChannel = async (channelId: string) => {
    if (!currentUser) return;
    
    const userRef = collection(firestore, `channels/${channelId}/users`);
    
    await addDoc(userRef, {
      nickname: nickname || 'Anonymous',
      userId: currentUser.uid,
      lastActive: serverTimestamp(),
      role: 'user',
    });
    
    setCurrentChannel(channelId);
  };

  const value = {
    currentChannel,
    channels,
    messages,
    channelUsers,
    setCurrentChannel,
    sendMessage,
    createChannel,
    joinChannel,
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
}; 