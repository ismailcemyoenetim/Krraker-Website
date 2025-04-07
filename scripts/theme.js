document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const toggleIcon = darkModeToggle.querySelector('.toggle-icon');
    
    // Sayfa yüklendiğinde hemen dark mode'u uygula
    body.classList.add('dark-mode');
    toggleIcon.textContent = '☀';
    localStorage.setItem('darkMode', 'true');
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        toggleIcon.textContent = isDark ? '☀' : '☾';
        
        localStorage.setItem('darkMode', isDark);
    });
}); 