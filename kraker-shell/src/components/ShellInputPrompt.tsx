import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

interface ShellInputPromptProps {
  onSendMessage: (message: string) => void;
}

const InputContainer = styled.div`
  grid-area: input;
  padding: 10px;
  background-color: var(--terminal-bg);
  border-top: 1px solid var(--terminal-border);
  display: flex;
  align-items: center;
`;

const Prompt = styled.span`
  color: var(--terminal-accent);
  margin-right: 10px;
  font-weight: bold;
  user-select: none;
`;

const InputField = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 1.1rem;
  color: var(--terminal-text);
  outline: none;
  padding: 0;
  
  &:focus {
    outline: none;
  }
`;

// Message history size
const MAX_HISTORY_SIZE = 50;

const ShellInputPrompt: React.FC<ShellInputPromptProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { nickname } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message);
      
      // Add message to history
      setMessageHistory(prev => {
        const newHistory = [...prev, message];
        if (newHistory.length > MAX_HISTORY_SIZE) {
          return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
        }
        return newHistory;
      });
      
      setMessage('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Up arrow - navigate to previous message in history
    if (e.key === 'ArrowUp') {
      if (messageHistory.length > 0 && historyIndex < messageHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setMessage(messageHistory[messageHistory.length - 1 - newIndex]);
      }
      e.preventDefault();
    }
    
    // Down arrow - navigate to next message in history
    else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setMessage(messageHistory[messageHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setMessage('');
      }
      e.preventDefault();
    }
    
    // Tab completion for commands
    else if (e.key === 'Tab') {
      e.preventDefault();
      
      const commands = ['/join', '/nick', '/help', '/quit'];
      if (message.startsWith('/')) {
        const matchingCommands = commands.filter(cmd => cmd.startsWith(message));
        
        if (matchingCommands.length === 1) {
          setMessage(matchingCommands[0] + ' ');
        }
      }
    }
  };

  return (
    <InputContainer>
      <Prompt>{nickname}@kraker:~$</Prompt>
      <form onSubmit={handleSendMessage} style={{ display: 'flex', flex: 1 }}>
        <InputField
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or command (/help)"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </InputContainer>
  );
};

export default ShellInputPrompt; 