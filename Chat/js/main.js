/**
 * Main application script
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Terminal Chat application loaded');
    
    // Initialize modules
    Boot.init();
    
    // Start boot animation
    Boot.simulateBoot(() => {
        // After boot, show menu
        document.getElementById('menuScreen').style.display = 'block';
        
        // Initialize menu event listeners
        setupMenu();
    });
    
    // Setup menu functionality
    function setupMenu() {
        const menuItems = document.querySelectorAll('.menu-item');
        const menuInput = document.getElementById('menuPromptCursor');
        let currentCommand = '';
        
        // Handle keyboard input on menu screen
        document.addEventListener('keydown', function(e) {
            // Only process if menu is visible
            if (document.getElementById('menuScreen').style.display !== 'block') {
                return;
            }
            
            if (e.key === 'Enter' && currentCommand) {
                processMenuCommand(currentCommand);
                currentCommand = '';
                menuInput.previousElementSibling.textContent = 'user@minerva:~$ ';
            } else if (e.key === 'Backspace') {
                if (currentCommand.length > 0) {
                    currentCommand = currentCommand.slice(0, -1);
                    updateMenuPrompt();
                }
            } else if (e.key.length === 1) {
                currentCommand += e.key;
                updateMenuPrompt();
            }
        });
        
        // Handle menu item clicks
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                processMenuCommand(action);
            });
        });
        
        // Update the menu prompt with current command
        function updateMenuPrompt() {
            menuInput.previousElementSibling.textContent = 'user@minerva:~$ ' + currentCommand;
        }
    }
    
    // Process menu commands
    function processMenuCommand(command) {
        console.log('Processing command:', command);
        command = command.toLowerCase();
        
        // Check for chat
        if (command.includes('chat')) {
            loadChat();
        }
        // Check for projects
        else if (command.includes('project')) {
            Boot.simulateLoading('projects', function() {
                window.location.href = '../pages/projects.html';
            });
        }
        // Check for shop 
        else if (command.includes('shop')) {
            Boot.simulateLoading('shop', function() {
                window.location.href = '../pages/shop/apparel.html';
            });
        }
        // Check for login
        else if (command.includes('login')) {
            Boot.simulateLoading('login', function() {
                window.location.href = '../pages/login.html';
            });
        }
        // Check for register
        else if (command.includes('register')) {
            Boot.simulateLoading('register', function() {
                window.location.href = '../pages/register.html';
            });
        }
        // Check for canvas
        else if (command.includes('canvas')) {
            Boot.simulateLoading('canvas', function() {
                // Placeholder for canvas functionality
                alert('Canvas functionality is not yet implemented');
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('menuScreen').style.display = 'block';
            });
        }
        // Check for admin
        else if (command.includes('admin')) {
            Boot.simulateLoading('admin', function() {
                // Show admin login overlay
                document.getElementById('admin-overlay').style.display = 'flex';
                document.getElementById('loadingScreen').style.display = 'none';
                // Start matrix animation
                initMatrixAnimation();
            });
        }
        // Unknown command
        else {
            alert('Command not recognized: ' + command);
        }
    }
    
    // Load chat interface
    function loadChat() {
        Boot.simulateLoading('chat', function() {
            // Hide loading screen
            document.getElementById('loadingScreen').style.display = 'none';
            
            // Show nickname selector
            document.getElementById('nicknameDialog').style.display = 'block';
            
            // Set focus on nickname input
            setTimeout(function() {
                document.getElementById('nickname').focus();
            }, 100);
            
            // Handle form submission
            document.getElementById('nicknameForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const nickname = document.getElementById('nickname').value.trim();
                
                if (nickname.length < 3) {
                    alert('Nickname must be at least 3 characters long');
                    return;
                }
                
                // Hide nickname dialog
                document.getElementById('nicknameDialog').style.display = 'none';
                
                // Show IRC container
                const ircContainer = document.getElementById('ircContainer');
                ircContainer.style.display = 'block';
                
                // Set nickname in UI
                document.getElementById('profileNick').textContent = nickname;
                
                // Initialize chat
                setupChatInterface(nickname);
            });
        });
    }
    
    // Set up chat interface
    function setupChatInterface(nickname) {
        const chatWindow = document.getElementById('ircChatWindow');
        const inputField = document.getElementById('ircInputField');
        const messageTypes = ['message', 'join', 'leave', 'action', 'notice'];
        const channels = document.querySelectorAll('.irc-room');
        const addRoomButton = document.querySelector('.irc-add-room');
        const addRoomDialog = document.getElementById('addRoomDialog');
        const exitChatButton = document.getElementById('exit-chat');
        
        // Add welcome messages
        addChatMessage('System', `Welcome to KrakerChat, ${nickname}!`, 'notice');
        addChatMessage('System', 'Use /help to see available commands', 'notice');
        
        // Handle message input
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const message = this.value.trim();
                if (message) {
                    processUserInput(message);
                    this.value = '';
                }
            }
        });
        
        // Process user input and commands
        function processUserInput(input) {
            // Check if it's a command
            if (input.startsWith('/')) {
                const commandParts = input.slice(1).split(' ');
                const command = commandParts[0].toLowerCase();
                const args = commandParts.slice(1).join(' ');
                
                switch (command) {
                    case 'help':
                        showHelp();
                        break;
                    case 'nick':
                        changeNickname(args);
                        break;
                    case 'me':
                        sendAction(args);
                        break;
                    case 'join':
                        joinChannel(args);
                        break;
                    case 'msg':
                    case 'query':
                        sendPrivateMessage(args);
                        break;
                    case 'quit':
                    case 'exit':
                        exitChat();
                        break;
                    default:
                        addChatMessage('System', `Unknown command: ${command}`, 'notice');
                        break;
                }
            } else {
                // Regular message
                sendMessage(input);
            }
        }
        
        // Send a regular chat message
        function sendMessage(text) {
            const activeChannel = document.querySelector('.irc-room.active').textContent;
            addChatMessage(nickname, text, 'message');
        }
        
        // Send an action (/me command)
        function sendAction(text) {
            addChatMessage('', `* ${nickname} ${text}`, 'action');
        }
        
        // Change nickname
        function changeNickname(newNick) {
            if (newNick && newNick.length >= 3) {
                const oldNick = nickname;
                nickname = newNick;
                document.getElementById('profileNick').textContent = nickname;
                addChatMessage('System', `* ${oldNick} is now known as ${nickname}`, 'notice');
                updateUserInList(oldNick, nickname);
            } else {
                addChatMessage('System', 'Usage: /nick <new_nickname> (minimum 3 characters)', 'notice');
            }
        }
        
        // Join a new channel
        function joinChannel(channelName) {
            if (!channelName) {
                addChatMessage('System', 'Usage: /join <channel>', 'notice');
                return;
            }
            
            if (!channelName.startsWith('#')) {
                channelName = '#' + channelName;
            }
            
            // Check if channel already exists
            const existingChannel = Array.from(channels).find(el => el.textContent === channelName);
            if (existingChannel) {
                // Switch to existing channel
                channels.forEach(ch => ch.classList.remove('active'));
                existingChannel.classList.add('active');
                addChatMessage('System', `Switched to channel ${channelName}`, 'notice');
            } else {
                // Add new channel
                const channelsList = document.querySelector('.irc-rooms');
                const newChannel = document.createElement('li');
                newChannel.className = 'irc-room active';
                newChannel.textContent = channelName;
                
                // Remove active class from other channels
                channels.forEach(ch => ch.classList.remove('active'));
                
                channelsList.appendChild(newChannel);
                addChatMessage('System', `Joined channel ${channelName}`, 'join');
                
                // Update event listeners for the new channel
                newChannel.addEventListener('click', function() {
                    document.querySelectorAll('.irc-room').forEach(ch => ch.classList.remove('active'));
                    this.classList.add('active');
                    updateUserListForChannel(this.textContent);
                });
            }
            
            // Update user list
            updateUserListForChannel(channelName);
        }
        
        // Send private message
        function sendPrivateMessage(args) {
            const parts = args.split(' ');
            if (parts.length < 2) {
                addChatMessage('System', 'Usage: /msg <nickname> <message>', 'notice');
                return;
            }
            
            const recipient = parts[0];
            const message = parts.slice(1).join(' ');
            
            addChatMessage('-> ' + recipient, message, 'whisper');
        }
        
        // Show help message
        function showHelp() {
            const helpMessages = [
                '/help - Show this help message',
                '/nick <nickname> - Change your nickname',
                '/me <action> - Send an action message',
                '/join <channel> - Join a channel',
                '/msg <nickname> <message> - Send a private message',
                '/quit or /exit - Exit the chat'
            ];
            
            helpMessages.forEach(msg => {
                addChatMessage('Help', msg, 'notice');
            });
        }
        
        // Exit chat
        function exitChat() {
            if (confirm('Are you sure you want to exit the chat?')) {
                document.getElementById('ircContainer').style.display = 'none';
                document.getElementById('menuScreen').style.display = 'block';
            }
        }
        
        // Channel switching
        channels.forEach(channel => {
            channel.addEventListener('click', function() {
                document.querySelectorAll('.irc-room').forEach(ch => ch.classList.remove('active'));
                this.classList.add('active');
                updateUserListForChannel(this.textContent);
            });
        });
        
        // Add room button
        addRoomButton.addEventListener('click', function() {
            addRoomDialog.style.display = 'block';
        });
        
        // Add room dialog buttons
        document.getElementById('confirmAddRoom').addEventListener('click', function() {
            const roomName = document.getElementById('roomNameInput').value.trim();
            if (roomName) {
                joinChannel(roomName);
                addRoomDialog.style.display = 'none';
                document.getElementById('roomNameInput').value = '';
            }
        });
        
        document.getElementById('cancelAddRoom').addEventListener('click', function() {
            addRoomDialog.style.display = 'none';
            document.getElementById('roomNameInput').value = '';
        });
        
        // Exit chat button
        exitChatButton.addEventListener('click', exitChat);
        
        // Add a message to the chat window
        function addChatMessage(sender, text, type) {
            const messageElement = document.createElement('div');
            messageElement.className = 'irc-message';
            
            const now = new Date();
            const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            let formattedMessage = '';
            
            switch (type) {
                case 'message':
                    formattedMessage = `<span class="irc-timestamp">[${timestamp}]</span> <span class="irc-nick" style="color: ${getColorForNick(sender)}">${sender}:</span> <span class="irc-text">${escapeHTML(text)}</span>`;
                    break;
                case 'join':
                case 'leave':
                case 'notice':
                    formattedMessage = `<span class="irc-timestamp">[${timestamp}]</span> <span class="irc-system">${escapeHTML(text)}</span>`;
                    break;
                case 'action':
                    formattedMessage = `<span class="irc-timestamp">[${timestamp}]</span> <span class="irc-action">${escapeHTML(text)}</span>`;
                    break;
                case 'whisper':
                    formattedMessage = `<span class="irc-timestamp">[${timestamp}]</span> <span class="irc-whisper">${sender}: ${escapeHTML(text)}</span>`;
                    break;
            }
            
            messageElement.innerHTML = formattedMessage;
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
        
        // Update a user's nickname in the user list
        function updateUserInList(oldNick, newNick) {
            const userList = document.getElementById('ircUsers');
            const users = Array.from(userList.children);
            const updatedUsers = users.map(li => {
                if (li.textContent === oldNick) {
                    const newLi = document.createElement('li');
                    newLi.className = li.className;
                    newLi.textContent = newNick;
                    return newLi;
                }
                return li;
            });
            userList.innerHTML = '';
            updatedUsers.forEach(li => userList.appendChild(li));
        }
        
        // Update user list for different channels
        function updateUserListForChannel(channel) {
            // Clear current user list
            const ircUsers = document.getElementById('ircUsers');
            ircUsers.innerHTML = '';
            
            // Different users for different channels
            let users = [];
            
            if (channel === '#krakerchat') {
                users = [
                    { name: 'KrakerAdmin', status: 'online' },
                    { name: 'Guest123', status: 'online' },
                    { name: 'NewUser42', status: 'online' },
                    { name: 'Designer', status: 'online' },
                    { name: 'CodeMaster', status: 'online' },
                    { name: 'Pixel_Artist', status: 'away' },
                    { name: 'WebWizard', status: 'online' },
                    { name: 'CRTlover', status: 'online' }
                ];
            } else if (channel === '#design') {
                users = [
                    { name: 'Designer', status: 'online' },
                    { name: 'Pixel_Artist', status: 'online' },
                    { name: 'ArtGuru', status: 'online' },
                    { name: 'UX_Master', status: 'away' },
                    { name: 'CSS_Wizard', status: 'online' },
                    { name: 'Illustrator', status: 'online' }
                ];
            } else {
                // Default users for new channels
                users = [
                    { name: 'Channel_Bot', status: 'online' },
                    { name: 'FirstUser', status: 'online' },
                    { name: 'Helper', status: 'online' }
                ];
            }
            
            // Add current user if not already in the list
            if (!users.some(u => u.name === nickname)) {
                users.push({ name: nickname, status: 'online' });
            }
            
            // Sort alphabetically
            users.sort((a, b) => a.name.localeCompare(b.name));
            
            // Add users to the list
            users.forEach(user => {
                const userItem = document.createElement('li');
                userItem.className = 'irc-user';
                if (user.status === 'away') userItem.classList.add('away');
                userItem.textContent = user.name;
                ircUsers.appendChild(userItem);
            });
            
            // Update user count
            document.querySelector('.irc-userlist-header').textContent = 'Online users: ' + users.length;
        }
        
        // Helper function to generate a consistent color for a nickname
        function getColorForNick(nickname) {
            // Simple hash function
            let hash = 0;
            for (let i = 0; i < nickname.length; i++) {
                hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
            }
            
            // Convert to hex color
            const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
            return '#' + '00000'.substring(0, 6 - c.length) + c;
        }
        
        // Helper function to escape HTML
        function escapeHTML(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Focus input field
        inputField.focus();
    }
    
    // Matrix animation for admin screen
    function initMatrixAnimation() {
        const canvas = document.createElement('canvas');
        const container = document.getElementById('matrix-container');
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Make canvas full size
        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Characters to display
        const chars = '01'.split('');
        const columns = Math.floor(canvas.width / 14);
        const drops = [];
        
        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height);
        }
        
        // Set text style
        ctx.font = '16px monospace';
        
        // Draw the matrix
        function drawMatrix() {
            // Semi-transparent black to create fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Green text
            ctx.fillStyle = '#0F0';
            
            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = chars[Math.floor(Math.random() * chars.length)];
                
                // Draw character
                ctx.fillText(char, i * 14, drops[i] * 14);
                
                // Move drop
                if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        // Start animation
        setInterval(drawMatrix, 33);
        
        // Set up admin form
        const adminForm = document.getElementById('admin-login-form');
        const adminMessage = document.getElementById('admin-message');
        
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = document.getElementById('admin-id').value;
            const password = document.getElementById('admin-password').value;
            
            if (id === 'admin' && password === 'password') {
                adminMessage.textContent = 'Access granted. Redirecting...';
                adminMessage.style.color = '#0F0';
                
                setTimeout(() => {
                    document.getElementById('admin-overlay').style.display = 'none';
                    // Show admin panel (placeholder)
                    alert('Admin functionality is not implemented in this demo');
                    document.getElementById('menuScreen').style.display = 'block';
                }, 2000);
            } else {
                adminMessage.textContent = 'Access denied. Invalid credentials.';
                adminMessage.style.color = '#F00';
                
                // Clear password field
                document.getElementById('admin-password').value = '';
            }
        });
        
        // Close admin overlay on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('admin-overlay').style.display === 'flex') {
                document.getElementById('admin-overlay').style.display = 'none';
                document.getElementById('menuScreen').style.display = 'block';
            }
        });
    }
}); 