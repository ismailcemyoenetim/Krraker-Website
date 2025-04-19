import React from 'react';
import styled from 'styled-components';
import { useChannel } from '../contexts/ChannelContext';
import { useAuth } from '../contexts/AuthContext';

const PanelContainer = styled.div`
  grid-area: users;
  background-color: var(--sidebar-bg);
  border-left: 1px solid var(--terminal-border);
  padding: 10px;
  overflow-y: auto;

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid var(--terminal-border);
  }
`;

const PanelHeader = styled.div`
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--terminal-border);
  font-size: 1.2rem;
  color: var(--terminal-accent);
  text-transform: uppercase;
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserItem = styled.div<{ isCurrentUser: boolean }>`
  padding: 3px 0;
  display: flex;
  align-items: center;
  color: ${props => props.isCurrentUser ? 'var(--terminal-accent)' : 'var(--terminal-text)'};
  font-weight: ${props => props.isCurrentUser ? 'bold' : 'normal'};

  &:hover {
    color: var(--terminal-accent);
  }
`;

const UserRole = styled.span<{ role: string }>`
  margin-right: 5px;
  color: ${props => {
    switch(props.role) {
      case 'admin': return '#ff5555';
      case 'mod': return '#5555ff';
      default: return 'var(--terminal-dim)';
    }
  }};
`;

const UserStatus = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--terminal-accent);
  margin-right: 8px;
  display: inline-block;
`;

const UserListPanel: React.FC = () => {
  const { channelUsers } = useChannel();
  const { currentUser, nickname } = useAuth();

  // Sort users by role and then by name
  const sortedUsers = [...channelUsers].sort((a, b) => {
    // Admin first, then mods, then regular users
    const roleOrder = { admin: 0, mod: 1, user: 2 };
    const roleA = a.role ? (roleOrder[a.role as keyof typeof roleOrder] || 2) : 2;
    const roleB = b.role ? (roleOrder[b.role as keyof typeof roleOrder] || 2) : 2;
    
    if (roleA !== roleB) {
      return roleA - roleB;
    }
    
    // Then sort alphabetically by nickname
    return a.nickname.localeCompare(b.nickname);
  });

  const getUserRoleSymbol = (role?: string) => {
    switch(role) {
      case 'admin': return '@';
      case 'mod': return '+';
      default: return '';
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>Users ({channelUsers.length})</PanelHeader>
      
      <UsersList>
        {sortedUsers.map(user => (
          <UserItem 
            key={user.id} 
            isCurrentUser={user.nickname === nickname}
          >
            <UserStatus />
            {user.role && user.role !== 'user' && (
              <UserRole role={user.role}>
                {getUserRoleSymbol(user.role)}
              </UserRole>
            )}
            {user.nickname}
          </UserItem>
        ))}
      </UsersList>
    </PanelContainer>
  );
};

export default UserListPanel; 