import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useChannel } from '../contexts/ChannelContext';
import { format } from 'date-fns';

const ChatContainer = styled.div`
  grid-area: chat;
  padding: 10px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--terminal-bg);
`;

const ChatHeader = styled.div`
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--terminal-border);
  font-size: 1.2rem;
  color: var(--terminal-accent);
  display: flex;
  justify-content: space-between;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  scrollbar-width: thin;
  scrollbar-color: var(--terminal-dim) var(--terminal-bg);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--terminal-bg);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--terminal-dim);
    border-radius: 0;
  }
`;

const MessageRow = styled.div<{ isSystem?: boolean }>`
  margin-bottom: 2px;
  line-height: 1.3;
  word-wrap: break-word;
  font-family: 'VT323', 'Courier New', monospace;
  
  ${props => props.isSystem && `
    color: var(--terminal-accent);
    font-style: italic;
  `}
`;

const Timestamp = styled.span`
  color: var(--terminal-dim);
  margin-right: 5px;
`;

const Username = styled.span`
  color: var(--terminal-accent);
  margin-right: 5px;
`;

const Message = styled.span`
  color: var(--terminal-text);
`;

const TerminalChatWindow: React.FC = () => {
  const { currentChannel, channels, messages } = useChannel();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get current channel name
  const currentChannelName = channels.find(c => c.id === currentChannel)?.name || '';

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Format message timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '[--:--]';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return `[${format(date, 'HH:mm')}]`;
    } catch (error) {
      return '[--:--]';
    }
  };

  // Check if message is a system message
  const isSystemMessage = (content: string) => {
    return content.startsWith('System:');
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <div>#{currentChannelName} <span className="blink">_</span></div>
        <div>{messages.length} messages</div>
      </ChatHeader>
      
      <ChatMessages>
        {/* Welcome message */}
        <MessageRow isSystem={true}>
          <Timestamp>[SYS]</Timestamp>
          <Message>Welcome to #{currentChannelName}. Start typing below to chat.</Message>
        </MessageRow>
        
        {/* Channel messages */}
        {messages.map((msg) => (
          <MessageRow key={msg.id} isSystem={isSystemMessage(msg.content)}>
            <Timestamp>{formatTimestamp(msg.timestamp)}</Timestamp>
            {!isSystemMessage(msg.content) && (
              <Username>&lt;{msg.nickname}&gt;</Username>
            )}
            <Message>{msg.content}</Message>
          </MessageRow>
        ))}
        
        {/* Auto scroll anchor */}
        <div ref={messagesEndRef} />
      </ChatMessages>
    </ChatContainer>
  );
};

export default TerminalChatWindow; 