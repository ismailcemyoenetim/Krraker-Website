// Ürün verilerini tanımlayalım
const products = [
    {
        id: 1,
        title: "Ürün 1",
        price: "₺299.99",
        image: "images/posters-thumbnail.png"
    },
    {
        id: 2,
        title: "Ürün 2",
        price: "₺199.99",
        image: "images/letterings-thumbnail.png"
    },
    {
        id: 3,
        title: "Ürün 3",
        price: "₺399.99",
        image: "images/posters-thumbnail.png"
    },
    {
        id: 4,
        title: "Ürün 4",
        price: "₺249.99",
        image: "images/letterings-thumbnail.png"
    },
    {
        id: 5,
        title: "Ürün 5",
        price: "₺349.99",
        image: "images/posters-thumbnail.png"
    },
    {
        id: 6,
        title: "Ürün 6",
        price: "₺299.99",
        image: "images/letterings-thumbnail.png"
    }
];

let isLoading = false;

// Ürünleri DOM'a ekleyen fonksiyon
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Scroll event listener
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        if (!isLoading) {
            isLoading = true;
            // Mevcut ürünleri tekrar ekle
            displayProducts();
            setTimeout(() => {
                isLoading = false;
            }, 500);
        }
    }
});

// Sayfa yüklendiğinde ürünleri göster
document.addEventListener('DOMContentLoaded', displayProducts); 