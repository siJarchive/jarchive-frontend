import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FileCard } from "@/components";
import { Search, Plus, Upload, Siren, GraduationCap, User, CheckCircle, Clock, AlertTriangle, Info, Download, FileText, Save, CloudUpload, X, FilePenLine, History, Trash2 } from "lucide-react";
import { fetchAssets, requestFile, uploadAsset, updateAsset, deleteVersion } from "@/controller/file.controller";
import { jwtDecode } from "jwt-decode";
import placeholder from '@/assets/images/placeholder.jpg';

export default function Dashboard() {
    const [assets, setAssets] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    
    // State Progress & UX
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const abortController = useRef(null);

    // Refs
    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);
    const reqUpdateFileInputRef = useRef(null);

    // Form: Upload Baru
    const [uploadForm, setUploadForm] = useState({ 
        name: '', 
        category: 'Docs', 
        description: '', 
        file: null 
    });

    // Form: Edit (Guru)
    const [editForm, setEditForm] = useState({ 
        id: '', 
        name: '', 
        category: 'Docs', 
        description: '', 
        file: null 
    });

    // Form: Request Update (Siswa) - BARU
    const [reqUpdateForm, setReqUpdateForm] = useState({ 
        assetId: '', 
        name: '', 
        category: 'Docs', 
        description: '', 
        file: null, 
        message: '' 
    });

    // Form: Lapor (Simple)
    const [reportForm, setReportForm] = useState({ 
        title: '', 
        assetId: '', 
        description: '' 
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    const handleFromChild = (data) => setIsLoggedIn(data);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
                setIsLoggedIn(true);
            } catch { 
                setIsLoggedIn(false); 
            }
        }
    }, []);

    const loadAssets = async () => {
        try {
            const res = await fetchAssets(currentPage, searchQuery, filterCategory, sortOption);
            setAssets(res.assets || []);
        } catch (error) { 
            console.error('Error:', error); 
            alert('Gagal memuat data'); 
        }
    };

    useEffect(() => { 
        loadAssets(); 
    }, [currentPage, searchQuery, filterCategory, sortOption]);

    // --- GENERIC FILE HANDLERS (Drag & Drop) ---
    const handleDragOver = (e) => { 
        e.preventDefault(); 
        setIsDragging(true); 
    };
    
    const handleDragLeave = (e) => { 
        e.preventDefault(); 
        setIsDragging(false); 
    };
    
    const handleGenericDrop = (e, setFormState) => {
        e.preventDefault(); 
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files?.length > 0) {
            setFormState(prev => ({ 
                ...prev, 
                file: files[0], 
                name: prev.name || files[0].name 
            }));
        }
    };

    const handleFileChange = (e, setFormState) => {
        const file = e.target.files[0];
        if (file) {
            setFormState(prev => ({ 
                ...prev, 
                file: file, 
                name: prev.name || file.name 
            }));
        }
    };

    // --- UPLOAD HANDLER ---
    const handleCancelUpload = () => { 
        if (abortController.current) {
            abortController.current.abort(); 
        }
    };
    
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert('Login dulu!');
        if (!uploadForm.name || !uploadForm.file) return alert('Data tidak lengkap!');

        setUploadProgress(0); 
        setIsUploading(true);
        abortController.current = new AbortController();

        try {
            const formData = new FormData();
            formData.append('name', uploadForm.name);
            formData.append('category', uploadForm.category);
            formData.append('description', uploadForm.description);
            formData.append('file', uploadForm.file);

            if (userRole === 'guru') {
                await uploadAsset(
                    formData, 
                    (p) => setUploadProgress(p), 
                    abortController.current.signal
                );
                alert('Berhasil upload!');
                document.getElementById('file_upload').close();
                setUploadForm({ name: '', category: 'Docs', description: '', file: null });
                loadAssets();
            } else {
                formData.append('type', 'upload');
                formData.append('message', `Request upload baru: ${uploadForm.name}`);
                await requestFile(
                    formData, 
                    (p) => setUploadProgress(p), 
                    abortController.current.signal
                );
                alert('Request upload terkirim!');
                document.getElementById('file_upload').close();
                setUploadForm({ name: '', category: 'Docs', description: '', file: null });
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                alert('Gagal upload: ' + (error.response?.data?.error || error.message));
            }
        } finally { 
            setIsUploading(false); 
            setUploadProgress(0); 
        }
    };

    // --- GURU: EDIT HANDLER ---
    const handleEditClick = (asset) => {
        setEditForm({ 
            id: asset._id, 
            name: asset.name, 
            category: asset.category, 
            description: asset.description || '', 
            file: null 
        });
        document.getElementById('file_edit').showModal();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editForm.name) return alert('Nama file harus diisi!');
        
        setUploadProgress(0); 
        setIsUploading(true);
        abortController.current = new AbortController();

        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('category', editForm.category);
            formData.append('description', editForm.description);
            
            if (editForm.file) {
                formData.append('file', editForm.file);
            }

            await updateAsset(
                editForm.id, 
                formData, 
                (p) => setUploadProgress(p), 
                abortController.current.signal
            );
            
            alert('File berhasil diupdate!');
            document.getElementById('file_edit').close();
            loadAssets();
        } catch (error) {
             if (!axios.isCancel(error)) {
                 alert('Gagal update: ' + error.message);
             }
        } finally { 
            setIsUploading(false); 
            setUploadProgress(0); 
        }
    };

    // --- SISWA: REQUEST UPDATE HANDLER ---
    const handleUpdateRequestClick = (asset) => {
        setReqUpdateForm({ 
            assetId: asset._id, 
            name: asset.name, 
            category: asset.category, 
            description: asset.description || '', 
            file: null, 
            message: '' 
        });
        document.getElementById('file_update_request').showModal();
    };

    const handleReqUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!reqUpdateForm.message) return alert('Wajib isi pesan laporan update!');
        
        setUploadProgress(0); 
        setIsUploading(true);
        abortController.current = new AbortController();

        try {
            const formData = new FormData();
            formData.append('type', 'update');
            formData.append('targetAssetId', reqUpdateForm.assetId);
            formData.append('name', reqUpdateForm.name);
            formData.append('category', reqUpdateForm.category);
            formData.append('description', reqUpdateForm.description);
            formData.append('message', reqUpdateForm.message); 
            
            if (reqUpdateForm.file) {
                formData.append('file', reqUpdateForm.file);
            }

            await requestFile(
                formData, 
                (p) => setUploadProgress(p), 
                abortController.current.signal
            );
            
            alert('Permintaan update dikirim! Menunggu persetujuan.');
            document.getElementById('file_update_request').close();
        } catch (error) {
             if (!axios.isCancel(error)) {
                 alert('Gagal request update: ' + error.message);
             }
        } finally { 
            setIsUploading(false); 
            setUploadProgress(0); 
        }
    };

    // --- SISWA: SIMPLE REPORT HANDLER (Legacy) ---
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('type', 'update');
            formData.append('targetAssetId', reportForm.assetId);
            formData.append('message', `[REPORT] ${reportForm.title}: ${reportForm.description}`);
            
            await requestFile(formData);
            
            alert('Laporan terkirim!');
            document.getElementById('file_report').close();
        } catch (error) { 
            alert('Gagal lapor'); 
        }
    };

    // --- HELPER DOWNLOAD VERSION ---
    const handleDownloadVersion = async (versionFilename, originalName) => {
        if (!isLoggedIn) return alert("Silakan login untuk mendownload.");
        
        try {
            const downloadUrl = `${import.meta.env.VITE_API_URL}/download/${versionFilename}?role=${userRole}`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', originalName || versionFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download version error:", error);
            alert("Gagal mendownload versi ini.");
        }
    };

    // --- HELPER DELETE VERSION ---
    const handleDeleteVersion = async (versionId) => {
        if (!confirm('Hapus riwayat versi ini secara permanen?')) return;
        
        try {
            await deleteVersion(selectedAsset._id, versionId);
            alert('Versi berhasil dihapus');
            
            // Refresh data aset yang sedang dipilih agar tabel terupdate
            const updatedAssets = await fetchAssets(currentPage, searchQuery);
            setAssets(updatedAssets.assets || []);
            
            // Update selectedAsset agar modal detail juga berubah
            const newSelected = updatedAssets.assets.find(a => a._id === selectedAsset._id);
            setSelectedAsset(newSelected);
        } catch (error) {
            alert('Gagal hapus versi');
        }
    };

    return (
        <div className="py-4">
            {/* Bar Pencarian & Filter */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Kiri: Search Bar */}
                <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); loadAssets(); }} className="w-full md:w-auto">
                    <div className="join w-full">
                        <div className="input join-item flex items-center gap-2 w-full md:w-auto">
                            <Search size={16} />
                            <input 
                                type="text" 
                                placeholder="Cari file" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="w-full"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary join-item">Cari</button>
                    </div> 
                </form>

                {/* Kanan: Filter Kategori & Sorting */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <select 
                        className="select select-bordered" 
                        value={filterCategory} 
                        onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">Semua Kategori</option>
                        <option value="Docs">Docs</option>
                        <option value="ISO">ISO</option>
                        <option value="Apps">Apps</option>
                        <option value="Foto">Foto</option>
                        <option value="Video">Video</option>
                    </select>

                    <select 
                        className="select select-bordered" 
                        value={sortOption} 
                        onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="newest">Terbaru - Terlama</option>
                        <option value="oldest">Terlama - Terbaru</option>
                        <option value="size_desc">Ukuran (Terbesar)</option>
                        <option value="size_asc">Ukuran (Terkecil)</option>
                    </select>
                </div>

            </div>
            <hr className="my-4 border-base-300" />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-x-8 justify-items-center">
                {assets.length > 0 ? (
                    assets.map((asset) => (
                        <FileCard 
                            key={asset._id} 
                            asset={asset} 
                            sendToParent={handleFromChild} 
                            onDetailClick={() => setSelectedAsset(asset)}
                            onEdit={handleEditClick}
                            onUpdateRequest={handleUpdateRequestClick}
                            onDelete={(id) => setAssets(assets.filter(a => a._id !== id))} 
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        <p>Tidak ada file tersedia</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <div className="fab">
                <div tabIndex={0} role="button" className="btn btn-xl btn-circle btn-primary">
                    <Plus size={24} />
                </div>
                <div className="fab-close">
                    <span className="btn btn-circle btn-xl btn-error">M</span>
                </div>
                <div>
                    Unggah
                    <button 
                        type="button" 
                        className="btn btn-xl btn-circle" 
                        onClick={() => document.getElementById('file_upload').showModal()}
                    >
                        <Upload size={24} />
                    </button>
                </div>
                {userRole === 'siswa' && (
                    <div>
                        Lapor
                        <button 
                            type="button" 
                            className="btn btn-xl btn-circle btn-alert" 
                            onClick={() => document.getElementById('file_report').showModal()}
                        >
                            <Siren size={24} />
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Upload (Upload Baru) */}
            <dialog id="file_upload" className="modal">
                <div className="modal-box">
                    <h2 className="text-xl font-semibold mb-4">Upload File Baru</h2>
                    <form onSubmit={handleUploadSubmit}>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            
                            <label className="label">Nama</label>
                            <input 
                                type="text" 
                                className="input w-full" 
                                value={uploadForm.name} 
                                onChange={e => setUploadForm({...uploadForm, name: e.target.value})} 
                                required 
                                disabled={isUploading} 
                            />
                            
                            <label className="label">Kategori</label>
                            <select 
                                className="select w-full" 
                                value={uploadForm.category} 
                                onChange={e => setUploadForm({...uploadForm, category: e.target.value})} 
                                disabled={isUploading}
                            >
                                <option value="Docs">Docs</option>
                                <option value="ISO">ISO</option>
                                <option value="Apps">Apps</option>
                                <option value="Foto">Foto</option>
                                <option value="Video">Video</option>
                            </select>
                            
                            <label className="label">Deskripsi</label>
                            <textarea 
                                className="textarea w-full" 
                                value={uploadForm.description} 
                                onChange={e => setUploadForm({...uploadForm, description: e.target.value})} 
                                disabled={isUploading}
                            />
                            
                            <label className="label">File</label>
                            <div 
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${isDragging ? 'border-primary bg-primary/10' : ''}`}
                                onDragOver={handleDragOver} 
                                onDragLeave={handleDragLeave} 
                                onDrop={(e) => handleGenericDrop(e, setUploadForm)}
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(e, setUploadForm)} 
                                    disabled={isUploading}
                                />
                                {uploadForm.file ? (
                                    <span className="text-success font-bold">{uploadForm.file.name}</span>
                                ) : (
                                    <span className="text-gray-500">Klik / Drag File</span>
                                )}
                            </div>
                            
                            {isUploading && (
                                <div className="flex items-center gap-2 mt-4">
                                    <progress className="progress progress-primary flex-1" value={uploadProgress} max="100"></progress>
                                    <button 
                                        type="button" 
                                        className="btn btn-circle btn-xs btn-error" 
                                        onClick={handleCancelUpload}
                                        title="Batalkan Upload"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            
                            <button className="btn btn-primary btn-block mt-4" disabled={isUploading || !uploadForm.file}>
                                Upload
                            </button>
                        </fieldset>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button disabled={isUploading}>close</button>
                </form>
            </dialog>

            {/* Modal GURU: Edit File */}
            <dialog id="file_edit" className="modal">
                <div className="modal-box">
                    <h2 className="text-xl font-semibold mb-4">Edit File (Guru)</h2>
                    <form onSubmit={handleEditSubmit}>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            
                            <label className="label">Nama</label>
                            <input 
                                type="text" 
                                className="input w-full" 
                                value={editForm.name} 
                                onChange={e => setEditForm({...editForm, name: e.target.value})} 
                                required 
                                disabled={isUploading} 
                            />
                            
                            <label className="label">Kategori</label>
                            <select 
                                className="select w-full" 
                                value={editForm.category} 
                                onChange={e => setEditForm({...editForm, category: e.target.value})} 
                                disabled={isUploading}
                            >
                                <option value="Docs">Docs</option>
                                <option value="ISO">ISO</option>
                                <option value="Apps">Apps</option>
                                <option value="Foto">Foto</option>
                                <option value="Video">Video</option>
                            </select>
                            
                            <label className="label">Deskripsi</label>
                            <textarea 
                                className="textarea w-full" 
                                value={editForm.description} 
                                onChange={e => setEditForm({...editForm, description: e.target.value})} 
                                disabled={isUploading}
                            />
                            
                            <label className="label">Ganti File (Opsional)</label>
                            <div 
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${isDragging ? 'border-primary bg-primary/10' : 'border-base-content/20'}`}
                                onDragOver={handleDragOver} 
                                onDragLeave={handleDragLeave} 
                                onDrop={(e) => handleGenericDrop(e, setEditForm)}
                                onClick={() => !isUploading && editFileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={editFileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(e, setEditForm)} 
                                    disabled={isUploading}
                                />
                                {editForm.file ? (
                                    <span className="text-success font-bold">{editForm.file.name}</span>
                                ) : (
                                    <span className="text-gray-500 text-sm">Klik untuk mengganti file lama</span>
                                )}
                            </div>
                            
                            {isUploading && (
                                <div className="flex items-center gap-2 mt-4">
                                    <progress className="progress progress-warning flex-1" value={uploadProgress} max="100"></progress>
                                    <button 
                                        type="button" 
                                        className="btn btn-circle btn-xs btn-error" 
                                        onClick={handleCancelUpload}
                                        title="Batalkan Update"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
)}
                            
                            <button className="btn btn-warning btn-block mt-4" disabled={isUploading}>
                                Simpan Perubahan
                            </button>
                        </fieldset>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button disabled={isUploading}>close</button>
                </form>
            </dialog>

            {/* Modal SISWA: Request Update */}
            <dialog id="file_update_request" className="modal">
                <div className="modal-box">
                    <h2 className="text-xl font-semibold mb-4">Ajukan Update File</h2>
                    <form onSubmit={handleReqUpdateSubmit}>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            
                            {/* Metadata File */}
                            <label className="label">Nama Baru</label>
                            <input 
                                type="text" 
                                className="input w-full" 
                                value={reqUpdateForm.name} 
                                onChange={e => setReqUpdateForm({...reqUpdateForm, name: e.target.value})} 
                                required 
                                disabled={isUploading} 
                            />
                            
                            <label className="label">Kategori</label>
                            <select 
                                className="select w-full" 
                                value={reqUpdateForm.category} 
                                onChange={e => setReqUpdateForm({...reqUpdateForm, category: e.target.value})} 
                                disabled={isUploading}
                            >
                                <option value="Docs">Docs</option>
                                <option value="ISO">ISO</option>
                                <option value="Apps">Apps</option>
                                <option value="Foto">Foto</option>
                                <option value="Video">Video</option>
                            </select>
                            
                            <label className="label">Deskripsi File</label>
                            <textarea 
                                className="textarea w-full" 
                                value={reqUpdateForm.description} 
                                onChange={e => setReqUpdateForm({...reqUpdateForm, description: e.target.value})} 
                                disabled={isUploading}
                            />
                            
                            {/* File Baru */}
                            <label className="label">File Baru (Opsional)</label>
                            <div 
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${isDragging ? 'border-primary bg-primary/10' : 'border-base-content/20'}`}
                                onDragOver={handleDragOver} 
                                onDragLeave={handleDragLeave} 
                                onDrop={(e) => handleGenericDrop(e, setReqUpdateForm)}
                                onClick={() => !isUploading && reqUpdateFileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={reqUpdateFileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(e, setReqUpdateForm)} 
                                    disabled={isUploading}
                                />
                                {reqUpdateForm.file ? (
                                    <span className="text-success font-bold">{reqUpdateForm.file.name}</span>
                                ) : (
                                    <span className="text-gray-500 text-sm">Klik untuk upload versi baru</span>
                                )}
                            </div>

                            {/* Pesan Laporan Update */}
                            <label className="label text-primary font-semibold">Pesan Laporan Update (Wajib)</label>
                            <textarea 
                                className="textarea textarea-primary w-full" 
                                placeholder="Jelaskan kenapa file ini perlu diupdate..." 
                                value={reqUpdateForm.message} 
                                onChange={e => setReqUpdateForm({...reqUpdateForm, message: e.target.value})} 
                                required 
                                disabled={isUploading}
                            />
                            
                        {isUploading && (
                            <div className="flex items-center gap-2 mt-4">
                                <progress className="progress progress-info flex-1" value={uploadProgress} max="100"></progress>
                                <button 
                                    type="button" 
                                    className="btn btn-circle btn-xs btn-error" 
                                    onClick={handleCancelUpload}
                                    title="Batalkan Pengiriman"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                            
                            <button className="btn btn-info btn-block mt-4" disabled={isUploading}>
                                {isUploading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <><FilePenLine size={18} /> Ajukan Update</>
                                )}
                            </button>
                        </fieldset>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button disabled={isUploading}>close</button>
                </form>
            </dialog>

            {/* Modal Detail File */}
            <dialog id="file_details" className="modal">
                 <div className="modal-box bg-transparent shadow-none p-0 w-full max-w-3xl">
                    <div className="card bg-base-100 shadow-xl overflow-hidden">
                        {selectedAsset && (
                            <>
                                <figure className="bg-base-200 h-[70vh] w-full overflow-hidden relative flex items-center justify-center">
                                    
                                    {/* 1. Video Preview */}
                                    {selectedAsset.category === 'Video' && (
                                        <video controls className="w-full h-full object-contain" src={`${import.meta.env.VITE_API_URL}/stream/${selectedAsset.filename}`}>
                                            Browser Anda tidak mendukung video tag.
                                        </video>
                                    )}
                                    
                                    {/* 2. PDF Preview */}
                                    {selectedAsset.filename?.toLowerCase().endsWith('.pdf') && (
                                        <iframe 
                                            src={`${import.meta.env.VITE_API_URL}/uploads/${selectedAsset.filename}`} 
                                            className="w-full h-full"
                                            title="PDF Preview"
                                        >
                                            Browser Anda tidak mendukung iframe PDF.
                                        </iframe>
                                    )}

                                    {/* 3. Image Preview */}
                                    {(selectedAsset.category === 'Foto' || selectedAsset.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) && selectedAsset.category !== 'Video' && (
                                        <img 
                                            src={`${import.meta.env.VITE_API_URL}/uploads/${selectedAsset.filename}`} 
                                            alt={selectedAsset.name} 
                                            className="w-full h-full object-contain" 
                                            onError={(e) => { e.target.src = placeholder; }} 
                                        />
                                    )}

                                    {/* 4. Default Icon */}
                                    {(!['Video', 'Foto'].includes(selectedAsset.category) && 
                                      !selectedAsset.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|pdf)$/i)) && (
                                        <div className="flex flex-col items-center justify-center h-full w-full">
                                            <FileText size={100} className="text-primary mb-4" />
                                            <p className="text-xl font-semibold text-center px-8 warp-break-words max-w-md">
                                                {selectedAsset.originalName || selectedAsset.filename}
                                            </p>
                                            <p className="text-base text-gray-500 mt-2">
                                                Preview tidak tersedia
                                            </p>
                                        </div>
                                    )}
                                </figure>

                                <div className="card-body gap-1 p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="card-title text-xl font-bold line-clamp-1" title={selectedAsset.name}>
                                            {selectedAsset.name}
                                        </h2>
                                        <span className={`badge ${
                                            selectedAsset.category === 'Video' ? 'badge-error' :
                                            selectedAsset.category === 'Foto' ? 'badge-success' :
                                            selectedAsset.category === 'Docs' ? 'badge-info' :
                                            selectedAsset.category === 'ISO' ? 'badge-warning' :
                                            'badge-primary'
                                        }`}>
                                            {selectedAsset.category}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-base-200/50 p-3 rounded-lg">
                                        <div>
                                            <p className="text-xs opacity-60 uppercase font-bold tracking-wider">Versi</p>
                                            <p className="font-semibold">v{(selectedAsset.versions?.length || 0) + 1}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-60 uppercase font-bold tracking-wider">Ukuran</p>
                                            <p className="font-semibold">{selectedAsset.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-60 uppercase font-bold tracking-wider">Tanggal</p>
                                            <p className="font-semibold truncate">
                                                {selectedAsset.uploadDate ? new Date(selectedAsset.uploadDate).toLocaleDateString('id-ID') : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-60 uppercase font-bold tracking-wider">Original</p>
                                            <p className="font-semibold truncate" title={selectedAsset.originalName}>
                                                {selectedAsset.originalName || selectedAsset.filename}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedAsset.description && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all cursor-default">
                                                {selectedAsset.description}
                                            </p>
                                        </div>
                                    )}

                                    {selectedAsset.versions && selectedAsset.versions.length > 0 && (
                                        <div className="mt-3 collapse collapse-arrow bg-base-200 rounded-box border border-base-300">
                                            <input type="checkbox" /> 
                                            <div className="collapse-title text-sm font-medium flex items-center gap-2 min-h-0 py-2">
                                                <History size={14} />
                                                Riwayat Versi ({selectedAsset.versions.length})
                                            </div>
                                            <div className="collapse-content"> 
                                                <div className="overflow-x-auto max-h-32 overflow-y-auto mt-2">
                                                    <table className="table table-xs table-zebra w-full">
                                                        <thead className="sticky top-0 bg-base-200 z-10">
                                                            <tr>
                                                                <th>Ver</th>
                                                                <th>Tgl</th>
                                                                <th className="text-right">Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedAsset.versions?.sort((a,b) => b.versionNumber - a.versionNumber).map((v) => (
                                                                <tr key={v._id}>
                                                                    <td>v{v.versionNumber}</td>
                                                                    <td>{new Date(v.uploadDate).toLocaleDateString('id-ID')}</td>
                                                                    <td className="text-right flex justify-end gap-1">
                                                                        
                                                                        {/* 1. Tombol Detail */}
                                                                        <button 
                                                                            type="button"
                                                                            className="btn btn-ghost btn-xs text-info"
                                                                            onClick={() => {
                                                                                setSelectedVersion(v);
                                                                                document.getElementById('version_details').showModal();
                                                                            }}
                                                                            title="Detail Versi"
                                                                        >
                                                                            <Info size={14} />
                                                                        </button>

                                                                        {/* 2. Tombol Download */}
                                                                        <button 
                                                                            type="button"
                                                                            className="btn btn-ghost btn-xs text-primary"
                                                                            onClick={() => handleDownloadVersion(v.filename, selectedAsset.originalName)}
                                                                            title="Download Versi"
                                                                        >
                                                                            <Download size={14} />
                                                                        </button>
                                                                        
                                                                        {/* 3. Tombol Delete (Khusus Guru) */}
                                                                        {userRole === 'guru' && (
                                                                            <button 
                                                                                type="button"
                                                                                className="btn btn-ghost btn-xs text-error"
                                                                                onClick={() => handleDeleteVersion(v._id)}
                                                                                title="Hapus Versi"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="card-actions justify-end mt-4 pt-2 border-t border-base-200">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-ghost">Tutup</button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Modal Detail Versi Khusus */}
            <dialog id="version_details" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">
                        Detail Versi {selectedVersion?.versionNumber}
                    </h3>
                    
                    {selectedVersion && selectedAsset && (
                        <div className="space-y-4 text-sm">
                            {/* Area Preview Versi Lama */}
                            <div className="bg-base-200 p-2 rounded-lg flex justify-center items-center h-48 relative overflow-hidden border border-base-300">
                                {selectedAsset.category === 'Foto' || selectedVersion.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i) ? (
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${selectedVersion.filename}`} 
                                        className="h-full w-full object-contain"
                                        onError={(e) => { e.target.src = placeholder; }}
                                        alt={`Preview v${selectedVersion.versionNumber}`}
                                    />
                                ) : selectedAsset.category === 'Video' ? (
                                    <video controls className="w-full h-full object-contain" src={`${import.meta.env.VITE_API_URL}/stream/${selectedVersion.filename}`}>
                                        Browser Anda tidak mendukung video.
                                    </video>
                                ) : (
                                    <div className="text-center">
                                        <FileText size={48} className="text-primary mx-auto mb-2" />
                                        <p className="opacity-50">Preview tidak tersedia</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Informasi Versi */}
                            <div className="grid grid-cols-2 gap-3 bg-base-200/50 p-4 rounded-lg">
                                <div className="col-span-2">
                                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Nama Sistem (Filename)</span>
                                    <span className="font-mono text-xs break-all bg-base-300 px-2 py-1 rounded">{selectedVersion.filename}</span>
                                </div>
                                <div>
                                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Ukuran</span>
                                    <span className="font-semibold">{selectedVersion.size}</span>
                                </div>
                                <div>
                                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Tanggal Diunggah</span>
                                    <span className="font-semibold">{new Date(selectedVersion.uploadDate).toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <button 
                                className="btn btn-primary btn-sm w-full mt-2"
                                onClick={() => handleDownloadVersion(selectedVersion.filename, selectedAsset.originalName)}
                            >
                                <Download size={16} /> Download Versi Ini
                            </button>
                        </div>
                    )}
                    
                    <div className="modal-action mt-6 pt-4 border-t border-base-200">
                        <form method="dialog">
                            <button className="btn btn-sm btn-ghost">Tutup</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Modal Lapor (Simple) */}
            <dialog id="file_report" className="modal">
                <div className="modal-box">
                    <h2 className="text-xl font-semibold">Lapor File (Simple)</h2>
                    <form onSubmit={handleReportSubmit}>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            
                            <label className="label">Judul</label>
                            <input 
                                type="text" 
                                className="input w-full" 
                                value={reportForm.title} 
                                onChange={e => setReportForm({...reportForm, title: e.target.value})} 
                                required
                            />
                            
                            <label className="label">File</label>
                            <select 
                                className="select w-full" 
                                value={reportForm.assetId} 
                                onChange={e => setReportForm({...reportForm, assetId: e.target.value})} 
                                required
                            >
                                <option value="">-- Pilih File --</option>
                                {assets.map((asset) => (
                                    <option key={asset._id} value={asset._id}>{asset.name}</option>
                                ))}
                            </select>
                            
                            <label className="label">Deskripsi</label>
                            <textarea 
                                className="textarea w-full" 
                                value={reportForm.description} 
                                onChange={e => setReportForm({...reportForm, description: e.target.value})} 
                                required
                            />
                            
                            <button className="btn btn-error btn-block mt-4">Kirim</button>
                        </fieldset>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}