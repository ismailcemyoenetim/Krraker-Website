import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 20px;
  margin: 50px auto;
  border: 2px solid var(--terminal-border);
  box-shadow: 0 0 10px var(--terminal-accent);
  background-color: var(--terminal-bg);
  color: var(--terminal-text);
  font-family: 'VT323', 'Courier New', monospace;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--terminal-border);
  padding-bottom: 10px;
`;

const Title = styled.h1`
  color: var(--terminal-accent);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 5px var(--terminal-accent);
  font-size: 2.5rem;
  margin: 0;
`;

const Subtitle = styled.h2`
  color: var(--terminal-dim);
  font-size: 1.2rem;
  margin: 5px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: var(--terminal-dim);
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 1.2rem;
  background-color: var(--terminal-bg);
  color: var(--terminal-text);
  border: 1px solid var(--terminal-border);
  outline: none;

  &:focus {
    border-color: var(--terminal-accent);
    box-shadow: 0 0 5px var(--terminal-accent);
  }
`;

const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 1.2rem;
  background-color: var(--terminal-bg);
  color: var(--terminal-accent);
  border: 1px solid var(--terminal-border);
  cursor: pointer;

  &:hover {
    background-color: var(--channel-active);
    color: var(--terminal-text);
    border-color: var(--terminal-accent);
    box-shadow: 0 0 5px var(--terminal-accent);
  }
`;

const AsciiArt = styled.pre`
  color: var(--terminal-accent);
  font-size: 0.7rem;
  text-align: center;
  line-height: 1;
  margin: 0 0 20px 0;
`;

const LoginScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/chat');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Nickname is required');
      return;
    }
    
    try {
      setIsLoading(true);
      await login(nickname);
      navigate('/chat');
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <AsciiArt>{`
  _  __          _              _____ _          _ _ 
 | |/ /_ __ __ _| | _____ _ __|_   _| |__   ___| | |
 | ' /| '__/ _\` | |/ / _ \\ '__| | | | '_ \\ / _ \\ | |
 | . \\| | | (_| |   <  __/ |    | | | | | |  __/ | |
 |_|\\_\\_|  \\__,_|_|\\_\\___|_|    |_| |_| |_|\\___|_|_|
        `}</AsciiArt>
        <Title>KrakerShell</Title>
        <Subtitle>Enter the Terminal. Join the Conversation.</Subtitle>
      </LoginHeader>
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Choose a Nickname:</Label>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="kraker_user"
            autoFocus
          />
        </InputGroup>
        
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'CONNECT >'}
        </Button>
      </Form>
    </LoginContainer>
  );
};

export default LoginScreen; 