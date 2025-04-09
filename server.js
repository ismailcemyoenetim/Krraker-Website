const express = require('express');
const admin = require('firebase-admin');
const path = require('path'); // Dosya yollarını yönetmek için

// Firebase Admin SDK başlatma
// --- ÖNEMLİ: Buradaki dosya adını kendi indirdiğin anahtar dosyasının adıyla değiştir ---
const serviceAccount = require('./krraker-db-firebase-adminsdk-fbsvc-023ca78949.json'); 

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK başarıyla başlatıldı.');
} catch (error) {
  console.error('Firebase Admin SDK başlatılamadı:', error);
  process.exit(1); // Hata durumunda sunucuyu durdur
}

// Firestore veritabanına erişim
const db = admin.firestore();

// Express uygulamasını oluştur
const app = express();
const port = 3000; // Sunucunun çalışacağı port

// Gelen JSON verilerini parse etmek için middleware
app.use(express.json());

// Statik dosyaları (HTML, CSS, JS, Resimler) sunmak için middleware
// Projenin ana dizinindeki dosyaları sunacak şekilde ayarlıyoruz.
app.use(express.static(path.join(__dirname))); 

// Ana sayfa (index.html) için route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Canvas sayfası (canvas.html) için route
app.get('/canvas', (req, res) => {
    res.sendFile(path.join(__dirname, 'canvas.html'));
});

// --- API Endpoint'leri Buraya Eklenecek ---

// Örneğin, canvas verisini kaydetmek için bir POST endpoint'i
app.post('/api/saveCanvas', async (req, res) => {
  try {
    const drawingData = req.body; // İstekten gelen çizim verisi

    if (!drawingData) {
      return res.status(400).send({ message: 'Çizim verisi gerekli.' });
    }

    // 'canvasDrawings' koleksiyonuna yeni belge ekle
    const docRef = await db.collection('canvasDrawings').add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      data: drawingData 
    });

    console.log('Canvas verisi kaydedildi, Belge ID:', docRef.id);
    res.status(201).send({ id: docRef.id, message: 'Canvas verisi başarıyla kaydedildi.' });

  } catch (error) {
    console.error('Canvas verisi kaydedilirken hata:', error);
    res.status(500).send({ message: 'Sunucu hatası: Veri kaydedilemedi.' });
  }
});

// Örneğin, son kaydedilen canvas verisini getirmek için bir GET endpoint'i
app.get('/api/getLatestCanvas', async (req, res) => {
    try {
        // 'canvasDrawings' koleksiyonunu oluşturulma zamanına göre tersten sırala ve ilkini al
        const snapshot = await db.collection('canvasDrawings')
                                .orderBy('createdAt', 'desc')
                                .limit(1)
                                .get();

        if (snapshot.empty) {
            console.log('Kaydedilmiş canvas verisi bulunamadı.');
            return res.status(404).send({ message: 'Kaydedilmiş veri bulunamadı.' });
        }

        // İlk bulunan belgenin verisini gönder
        const latestData = snapshot.docs[0].data();
        console.log('En son canvas verisi getirildi.');
        res.status(200).send(latestData);

    } catch (error) {
        console.error('Canvas verisi getirilirken hata:', error);
        res.status(500).send({ message: 'Sunucu hatası: Veri getirilemedi.' });
    }
});


// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
}); 