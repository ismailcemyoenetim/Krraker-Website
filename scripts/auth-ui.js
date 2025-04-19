// Auth UI updates based on authentication state
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD55KdXc0PcnhIh9WgdcByS0-EVvk4pxxI",
  authDomain: "email-kraker.firebaseapp.com",
  projectId: "email-kraker",
  storageBucket: "email-kraker.firebasestorage.app",
  messagingSenderId: "887189683401",
  appId: "1:887189683401:web:15b6a238b8d24319ece118",
  measurementId: "G-TE7M225KP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const rightMenuContainer = document.querySelector('.right-menu-container .nav-menu');
const loginNavItem = document.querySelector('.right-menu-container .nav-menu .nav-item:nth-child(1)');
const registerNavItem = document.querySelector('.right-menu-container .nav-menu .nav-item:nth-child(2)');

// Update UI based on auth state
function updateUIForAuthState(user) {
  if (user) {
    // User is signed in
    // Hide login and register links
    if (loginNavItem) loginNavItem.style.display = 'none';
    if (registerNavItem) registerNavItem.style.display = 'none';
    
    // Check if profile link exists, if not create it
    let profileNavItem = document.getElementById('profile-nav-item');
    if (!profileNavItem && rightMenuContainer) {
      // Create profile nav item
      profileNavItem = document.createElement('li');
      profileNavItem.id = 'profile-nav-item';
      profileNavItem.className = 'nav-item';
      
      // Create user menu with dropdown
      profileNavItem.innerHTML = `
        <a href="#" class="nav-link">MY ACCOUNT</a>
        <div class="dropdown">
          <ul>
            <li><a href="/pages/profile.html">Profile</a></li>
            <li><a href="#" id="logout-link">Sign Out</a></li>
          </ul>
        </div>
      `;
      
      // Insert at the beginning of the menu
      rightMenuContainer.insertBefore(profileNavItem, rightMenuContainer.firstChild);
      
      // Add event listener for logout
      document.getElementById('logout-link').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await auth.signOut();
          window.location.href = '/index.html';
        } catch (error) {
          console.error('Error signing out:', error);
        }
      });
    }
    
    // Add favorites menu item for balance (3 items on each side)
    let favoritesNavItem = document.getElementById('favorites-nav-item');
    if (!favoritesNavItem && rightMenuContainer) {
      // Create favorites nav item
      favoritesNavItem = document.createElement('li');
      favoritesNavItem.id = 'favorites-nav-item';
      favoritesNavItem.className = 'nav-item';
      
      // Create favorites menu with dropdown
      favoritesNavItem.innerHTML = `
        <a href="#" class="nav-link">FAVORITES</a>
        <div class="dropdown">
          <ul>
            <li><a href="/pages/favorites/recent.html">Recent Items</a></li>
            <li><a href="/pages/favorites/saved.html">Saved Items</a></li>
          </ul>
        </div>
      `;
      
      // Insert after profile nav item
      const cartNavItem = document.querySelector('.right-menu-container .nav-menu .nav-item:last-child');
      rightMenuContainer.insertBefore(favoritesNavItem, cartNavItem);
    }
  } else {
    // User is signed out
    // Show login and register links
    if (loginNavItem) loginNavItem.style.display = '';
    if (registerNavItem) registerNavItem.style.display = '';
    
    // Remove profile nav item if it exists
    const profileNavItem = document.getElementById('profile-nav-item');
    if (profileNavItem) {
      profileNavItem.remove();
    }
    
    // Remove favorites nav item if it exists
    const favoritesNavItem = document.getElementById('favorites-nav-item');
    if (favoritesNavItem) {
      favoritesNavItem.remove();
    }
  }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  updateUIForAuthState(user);
});

// Export the update function for use in other scripts
export { updateUIForAuthState }; 