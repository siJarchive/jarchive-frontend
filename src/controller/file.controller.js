import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

const fetchAssets = async (pageNum = 1, search, category, sort) => {
    try {
        const res = await axios.get(`${API_URL}/api/assets`, {
            params: { category, sort, search, page: pageNum }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const uploadAsset = async (formData, onProgress, signal) => {
    try {
        const res = await axios.post(`${API_URL}/api/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            signal: signal,
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

// Update: Mendukung FormData dan Progress untuk Update File
const updateAsset = async (id, data, onProgress, signal) => {
    try {
        // Cek apakah data adalah FormData (ada file) atau JSON biasa
        const isFormData = data instanceof FormData;
        
        const res = await axios.put(`${API_URL}/api/assets/${id}`, data, {
            headers: {
                // Jika FormData, biarkan axios set boundary, jika tidak pakai application/json
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            },
            signal: signal,
            onUploadProgress: (progressEvent) => {
                if (onProgress && isFormData) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        });
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

const requestFile = async (formData, onProgress, signal) => {
    try {
        const res = await axios.post(`${API_URL}/api/requests`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            signal: signal,
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
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
            headers: { Authorization: `Bearer ${token}` },
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

const downloadFileBlob = async (filename, role, onProgress, signal) => {
    try {
        const res = await axios.get(`${API_URL}/download/${filename}`, {
            params: { role },
            responseType: 'blob',
            signal: signal,
            onDownloadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const deleteVersion = async (assetId, versionId) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/assets/${assetId}/versions/${versionId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const clearRequests = async () => {
    try {
        const res = await axios.delete(`${API_URL}/api/requests`, {
            headers: { Authorization: `Bearer ${token}` }
        });
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
    rejectRequest, 
    downloadFileBlob,
    deleteVersion,
    clearRequests
}