import React, { useState } from 'react';
import styled from 'styled-components';
import { useChannel } from '../contexts/ChannelContext';

const SidebarContainer = styled.div`
  grid-area: channels;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--terminal-border);
  padding: 10px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border-top: 1px solid var(--terminal-border);
    border-right: none;
  }
`;

const ChannelList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const SidebarHeader = styled.div`
  padding: 5px 10px 10px;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--terminal-accent);
  border-bottom: 1px solid var(--terminal-border);
  margin-bottom: 10px;
`;

const ChannelItem = styled.div<{ active: boolean }>`
  padding: 5px 10px;
  cursor: pointer;
  margin: 2px 0;
  color: ${props => props.active ? 'var(--terminal-accent)' : 'var(--terminal-text)'};
  background-color: ${props => props.active ? 'var(--channel-active)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? 'var(--terminal-accent)' : 'transparent'};
  
  &:hover {
    background-color: var(--channel-bg);
    color: var(--terminal-accent);
  }
  
  &::before {
    content: "#";
    margin-right: 5px;
    opacity: 0.7;
  }
`;

const AddChannelForm = styled.form`
  padding: 0 10px 10px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--terminal-border);
  padding-top: 10px;
`;

const AddChannelInput = styled.input`
  background-color: var(--terminal-bg);
  color: var(--terminal-text);
  border: 1px solid var(--terminal-border);
  padding: 5px;
  margin-bottom: 5px;
  font-family: 'VT323', 'Courier New', monospace;
  
  &:focus {
    outline: none;
    border-color: var(--terminal-accent);
    box-shadow: 0 0 5px var(--terminal-accent);
  }
`;

const AddChannelButton = styled.button`
  background-color: var(--channel-bg);
  color: var(--terminal-text);
  border: 1px solid var(--terminal-border);
  padding: 5px;
  cursor: pointer;
  font-family: 'VT323', 'Courier New', monospace;
  
  &:hover {
    background-color: var(--channel-active);
    color: var(--terminal-accent);
    border-color: var(--terminal-accent);
  }
`;

const ChannelListSidebar: React.FC = () => {
  const { channels, currentChannel, setCurrentChannel, createChannel } = useChannel();
  const [newChannelName, setNewChannelName] = useState('');
  const [showAddChannel, setShowAddChannel] = useState(false);

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newChannelName.trim()) {
      createChannel(newChannelName);
      setNewChannelName('');
      setShowAddChannel(false);
    }
  };

  return (
    <SidebarContainer>
      <SidebarHeader>Channels <span className="blink">_</span></SidebarHeader>
      
      <ChannelList>
        {channels.map(channel => (
          <ChannelItem
            key={channel.id}
            active={channel.id === currentChannel}
            onClick={() => setCurrentChannel(channel.id)}
          >
            {channel.name}
          </ChannelItem>
        ))}
        
        <ChannelItem 
          active={false} 
          onClick={() => setShowAddChannel(!showAddChannel)}
          style={{ fontStyle: 'italic', opacity: 0.7 }}
        >
          + Add Channel
        </ChannelItem>
      </ChannelList>
      
      {showAddChannel && (
        <AddChannelForm onSubmit={handleCreateChannel}>
          <AddChannelInput
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="channel name"
            autoFocus
          />
          <AddChannelButton type="submit">Create</AddChannelButton>
        </AddChannelForm>
      )}
    </SidebarContainer>
  );
};

export default ChannelListSidebar; 