class Auth {
    static async login(email, password) {
        try {
            const response = await API.login({ email, password });
            if (response.token) {
                localStorage.setItem('token', response.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }
} 