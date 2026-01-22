import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

async function userLogin(data) {
    try {
        const res = await axios.post(`${API_URL}/api/login`, data);
        return res;
    } catch (error) {
        throw error;
    }
}

export {
    userLogin
}