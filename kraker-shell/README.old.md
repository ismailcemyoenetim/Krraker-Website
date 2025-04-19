# KrakerShell - Retro Terminal Chat

A retro-themed web chat interface inspired by classic mIRC, integrated into a stylized terminal/CRT UI.

## Features

- Retro terminal style interface with CRT screen effects
- IRC-like channel system with user lists
- Command line interface for actions like joining channels and changing nicknames
- Firebase integration for real-time chat functionality
- Responsive design that works on desktop and mobile

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Anonymous sign-in) and Firestore in your Firebase project
   - Update the Firebase configuration in `src/services/firebase.ts` with your project details

4. Start the development server:
   ```
   npm start
   ```

## Available Commands

Once in the chat interface, you can use these commands:

- `/join #channelname` - Join a different channel
- `/nick nickname` - Change your display name
- `/help` - Display all available commands
- `/quit` - Logout from the chat

## Project Structure

- `src/components/` - React components for the UI
  - `KrakerShell.tsx` - Main container component
  - `ChannelListSidebar.tsx` - Left sidebar with channel list
  - `TerminalChatWindow.tsx` - Main chat display area
  - `UserListPanel.tsx` - Right sidebar with user list
  - `ShellInputPrompt.tsx` - Command input area
  - `LoginScreen.tsx` - Initial screen for setting nickname
- `src/contexts/` - React context for state management
  - `AuthContext.tsx` - Authentication state
  - `ChannelContext.tsx` - Channel and messages state
- `src/services/` - External services
  - `firebase.ts` - Firebase configuration and initialization
- `src/styles/` - CSS styling
  - `global.css` - Global styles and CRT effects

## Customization

You can customize the terminal appearance by modifying the CSS variables in `src/styles/global.css`. The key variables include:

```css
:root {
  --terminal-bg: #000000;      /* Background color */
  --terminal-text: #33ff33;    /* Main text color */
  --terminal-accent: #00ff00;  /* Accent color for UI elements */
  /* ... other variables ... */
}
```

## License

MIT 