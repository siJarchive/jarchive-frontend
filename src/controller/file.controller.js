import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');

const fetchAssets = async (pageNum = 1, search, category, sort) => {
    try {
        const res = await axios.get(`${API_URL}/api/assets`, {
            params: {
                category,
                sort,
                search,
                page: pageNum
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const uploadAsset = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/api/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const updateAsset = async (id, data) => {
    try {
        const res = await axios.put(`${API_URL}/api/assets/${id}`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const deleteAsset = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/api/assets/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const requestFile = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/api/requests`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchRequests = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/requests`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const approveRequest = async (id) => {
    try {
        const res = await axios.post(`${API_URL}/api/requests/${id}/approve`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const rejectRequest = async (id) => {
    try {
        const res = await axios.post(`${API_URL}/api/requests/${id}/reject`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export {
    fetchAssets,
    uploadAsset,
    updateAsset,
    deleteAsset,
    requestFile,
    fetchRequests,
    approveRequest,
    rejectRequest
}