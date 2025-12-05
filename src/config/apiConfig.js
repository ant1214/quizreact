export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return token ? { 
        headers: { 
            'token': token,
            'Content-Type': 'application/json'
        }
    } : { headers: { 'Content-Type': 'application/json' } };
};