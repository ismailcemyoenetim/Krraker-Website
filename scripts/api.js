const API_URL = 'http://localhost:5000/api';

class API {
    static async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    }

    static async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    }

    static async createOrder(orderData) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });
        return response.json();
    }
} 