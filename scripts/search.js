function initSearch() {
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', debounce(async (e) => {
        const products = await API.searchProducts(e.target.value);
        updateProductGrid(products);
    }, 300));
} 