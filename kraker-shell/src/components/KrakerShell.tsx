import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChannelListSidebar from './ChannelListSidebar';
import UserListPanel from './UserListPanel';
import TerminalChatWindow from './TerminalChatWindow';
import ShellInputPrompt from './ShellInputPrompt';
import { useAuth } from '../contexts/AuthContext';
import { useChannel } from '../contexts/ChannelContext';
import { useNavigate } from 'react-router-dom';

const ShellContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 200px 1fr 180px;
  grid-template-rows: 1fr 50px;
  grid-template-areas:
    "channels chat users"
    "channels input users";
  border: 2px solid var(--terminal-border);
  box-shadow: 0 0 10px var(--terminal-accent);
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto auto;
    grid-template-areas:
      "chat"
      "input"
      "channels"
      "users";
  }
`;

const ShellHeader = styled.div`
  grid-area: header;
  padding: 5px 10px;
  border-bottom: 1px solid var(--terminal-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--sidebar-bg);
  color: var(--terminal-text);
`;

const KrakerShell: React.FC = () => {
  const { currentUser, nickname, logout } = useAuth();
  const { currentChannel, channels, messages, channelUsers, sendMessage } = useChannel();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSendMessage = (content: string) => {
    // Check if the message is a command
    if (content.startsWith('/')) {
      handleCommand(content);
    } else {
      sendMessage(content);
    }
  };

  const handleCommand = (command: string) => {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    
    switch (cmd) {
      case '/join':
        if (parts.length > 1) {
          const channelName = parts[1].startsWith('#') ? parts[1].substring(1) : parts[1];
          const channel = channels.find(c => c.name.toLowerCase() === channelName.toLowerCase());
          if (channel) {
            useChannel().setCurrentChannel(channel.id);
          } else {
            // Handle channel not found
            sendMessage(`System: Channel #${channelName} not found.`);
          }
        }
        break;
        
      case '/nick':
        if (parts.length > 1) {
          useAuth().setNickname(parts[1]);
        }
        break;
        
      case '/help':
        sendMessage(`System: Available commands:
/join #channel - Join a channel
/nick nickname - Change your nickname
/help - Show this help
/quit - Logout`);
        break;
        
      case '/quit':
        logout();
        break;
        
      default:
        sendMessage(`System: Unknown command: ${cmd}`);
    }
  };

  return (
    <ShellContainer>
      <ChannelListSidebar />
      <TerminalChatWindow />
      <UserListPanel />
      <ShellInputPrompt onSendMessage={handleSendMessage} />
    </ShellContainer>
  );
};

export default KrakerShell; 