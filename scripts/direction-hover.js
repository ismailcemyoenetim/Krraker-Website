document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        let rect = link.getBoundingClientRect();
        let prevX = 0;
        
        // Link'in sınırlarına girildiğinde yönü belirle
        link.addEventListener('mouseenter', (e) => {
            // Link'in orta noktasını hesapla
            rect = link.getBoundingClientRect();
            const linkCenterX = rect.left + rect.width / 2;
            
            // Mouse'un giriş pozisyonunu al
            const mouseX = e.clientX;
            
            // Mouse'un hangi taraftan geldiğini belirle
            if (mouseX < linkCenterX) {
                // Soldan giriş
                link.classList.remove('direction-right');
                link.classList.add('direction-left');
            } else {
                // Sağdan giriş
                link.classList.remove('direction-left');
                link.classList.add('direction-right');
            }
        });
        
        // Link'ten çıkıldığında sınıfı koru ama yönü kaydet
        link.addEventListener('mouseleave', (e) => {
            // Mevcut yönü koruyun, ancak sonraki hover için hazır olun
            prevX = e.clientX;
        });
    });
}); 