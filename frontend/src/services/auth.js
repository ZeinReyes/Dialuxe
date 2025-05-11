import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export const login = async ({ email, password }) => {
    const response = await axios.post(`${API}/login`, { email, password });
    return response;
};

export const verifyOTP = async ({ email, otp }) => {
    const response = await axios.post(`${API}/verify-otp`, { email, otp });
    return response;
};

export const register = (data) => axios.post(`${API}/register`, data);