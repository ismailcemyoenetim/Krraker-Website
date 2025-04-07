document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gridContainer');
    const dots = [];
    const spacing = 20; // CSS'deki --grid-spacing değeriyle aynı olmalı
    const gridLineSpacing = spacing * 4; // Her 4 grid noktasında bir çizgi
    const maxDistance = spacing * 6; // 6 nokta uzaklığında maksimum etki
    const trailDots = []; // Mouse izini takip etmek için
    const maxTrailLength = 3; // İz noktası sayısını azalttım
    const fadeSpeed = 0.5; // Sönme hızını artırdım
    const checkRadius = maxDistance * 1.2; // Kontrol alanını küçülttüm
    const fadeDelay = 1333; // 1.33 saniye (ms cinsinden)

    function updateGridDimensions() {
        // Viewport boyutlarını al
        const CANVAS_WIDTH = window.innerWidth;
        const CANVAS_HEIGHT = window.innerHeight;
        
        return { CANVAS_WIDTH, CANVAS_HEIGHT };
    }

    let { CANVAS_WIDTH, CANVAS_HEIGHT } = updateGridDimensions();

    // Grid çizgilerini oluştur
    function createGridLines() {
        // Mevcut çizgileri temizle
        const existingLines = container.querySelectorAll('.grid-line-vertical, .grid-line-horizontal');
        existingLines.forEach(line => line.remove());

        // Dikey çizgiler
        for (let x = 0; x < Math.ceil(CANVAS_WIDTH / gridLineSpacing); x++) {
            const line = document.createElement('div');
            line.className = 'grid-line-vertical';
            line.style.left = `${x * gridLineSpacing}px`;
            container.appendChild(line);
        }

        // Yatay çizgiler
        for (let y = 0; y < Math.ceil(CANVAS_HEIGHT / gridLineSpacing); y++) {
            const line = document.createElement('div');
            line.className = 'grid-line-horizontal';
            line.style.top = `${y * gridLineSpacing}px`;
            container.appendChild(line);
        }
    }

    // Grid çizgilerini oluştur
    createGridLines();

    // Grid noktası sayısını hesapla ve göster
    const columns = Math.ceil(CANVAS_WIDTH / spacing);
    const rows = Math.ceil(CANVAS_HEIGHT / spacing);
    console.log(`Grid noktası sayısı: ${columns} × ${rows} = ${columns * rows}`);

    // Mouse konum göstergesi oluştur
    const mouseIndicator = document.createElement('div');
    mouseIndicator.id = 'mousePositionIndicator';
    document.body.appendChild(mouseIndicator);

    // X ve Y göstergeleri için ayrı span'ler oluştur
    const xSpan = document.createElement('span');
    const ySpan = document.createElement('span');
    mouseIndicator.appendChild(xSpan);
    mouseIndicator.appendChild(ySpan);

    // Noktaları oluştur
    for (let y = 0; y < Math.ceil(CANVAS_HEIGHT / spacing); y++) {
        for (let x = 0; x < Math.ceil(CANVAS_WIDTH / spacing); x++) {
            const posX = x * spacing;
            const posY = y * spacing;
            const dot = document.createElement('div');
            dot.className = 'grid-dot';
            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;
            container.appendChild(dot);
            dots.push({
                element: dot,
                x: posX,
                y: posY,
                intensity: 0
            });
        }
    }

    // Mouse hareketi takibi
    let lastUpdate = 0;
    const updateInterval = 16; // ~60 FPS
    let lastMouseX = 0;
    let lastMouseY = 0;
    let fadeTimeout = null;

    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastUpdate < updateInterval) return;
        lastUpdate = now;

        // Mouse konumunu container'a göre hesapla
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Grid koordinatlarını hesapla
        const gridX = Math.round(mouseX / spacing) * spacing;
        const gridY = Math.round(mouseY / spacing) * spacing;
        
        xSpan.textContent = `[ x:${gridX} ]`;
        ySpan.textContent = `[ y:${gridY} ]`;

        // Önceki fade timeout'u temizle
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
        }

        // Mouse pozisyonunu kaydet
        trailDots.unshift({ x: mouseX, y: mouseY });
        if (trailDots.length > maxTrailLength) {
            trailDots.pop();
        }

        // Grid çizgileri üzerindeki noktaları kontrol et
        const nearbyDots = dots.filter(dot => {
            const dx = Math.abs(mouseX - dot.x);
            const dy = Math.abs(mouseY - dot.y);
            const isOnGridLine = (dot.x % gridLineSpacing === 0) || (dot.y % gridLineSpacing === 0);
            
            return dx < checkRadius && dy < checkRadius && isOnGridLine;
        });

        // Önce tüm noktaları sıfırla
        dots.forEach(dot => {
            if (dot.intensity > 0) {
                dot.intensity = 0;
                dot.element.classList.remove('active');
            }
        });

        // Yakındaki noktaları aktifleştir
        nearbyDots.forEach(dot => {
            const dx = mouseX - dot.x;
            const dy = mouseY - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const centerIntensity = 1 - (distance / maxDistance);
                const intensity = Math.pow(centerIntensity, 3);
                dot.intensity = intensity;
                dot.element.classList.add('active');
                dot.element.style.setProperty('--glow-intensity', intensity);
            }
        });

        // Fade timeout'u ayarla
        fadeTimeout = setTimeout(() => {
            dots.forEach(dot => {
                if (dot.intensity > 0) {
                    dot.intensity = 0;
                    dot.element.classList.remove('active');
                }
            });
        }, fadeDelay);
    });

    // Pencere boyutu değiştiğinde grid'i yeniden oluştur
    window.addEventListener('resize', () => {
        // Yeni boyutları al
        const dimensions = updateGridDimensions();
        CANVAS_WIDTH = dimensions.CANVAS_WIDTH;
        CANVAS_HEIGHT = dimensions.CANVAS_HEIGHT;

        container.innerHTML = '';
        dots.length = 0;
        trailDots.length = 0;

        // Grid çizgilerini yeniden oluştur
        createGridLines();

        // Noktaları yeniden oluştur
        for (let y = 0; y < Math.ceil(CANVAS_HEIGHT / spacing); y++) {
            for (let x = 0; x < Math.ceil(CANVAS_WIDTH / spacing); x++) {
                const posX = x * spacing;
                const posY = y * spacing;
                const dot = document.createElement('div');
                dot.className = 'grid-dot';
                dot.style.left = `${posX}px`;
                dot.style.top = `${posY}px`;
                container.appendChild(dot);
                dots.push({
                    element: dot,
                    x: posX,
                    y: posY,
                    intensity: 0
                });
            }
        }
    });
}); 