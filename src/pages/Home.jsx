import { useEffect, useState } from "react";
import { FileCard } from "@/components";
import { Search, Plus, Upload, Siren, GraduationCap, User, CheckCircle, Clock, AlertTriangle, Info, Download, FileText } from "lucide-react";
import { fetchAssets, requestFile, uploadAsset } from "@/controller/file.controller";
import { jwtDecode } from "jwt-decode";
import placeholder from '@/assets/images/placeholder.jpg';

export default function Home() {
    const [assets, setAssets] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    
    // Form states untuk Upload
    const [uploadForm, setUploadForm] = useState({
        name: '',
        category: 'Docs',
        description: '',
        file: null
    });

    // Form states untuk Report
    const [reportForm, setReportForm] = useState({
        title: '',
        assetId: '',
        description: ''
    });

    // Search & Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleFromChild = (data) => {
        setIsLoggedIn(data);
    };

    // Check login status
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

    // Fetch assets
    const loadAssets = async () => {
        try {
            const res = await fetchAssets(currentPage, searchQuery);
            console.log('Response from API:', res); // Debug log
            setAssets(res.assets || []);
            console.log('Assets set:', res.assets); // Debug log
        } catch (error) {
            console.error('Error fetching assets:', error);
            alert('Gagal memuat data file');
        }
    };

    useEffect(() => {
        loadAssets();
    }, [currentPage, searchQuery]);

    // Handle Upload Form
    const handleUploadChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setUploadForm({ ...uploadForm, file: files[0] });
        } else {
            setUploadForm({ ...uploadForm, [name]: value });
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            alert('Anda harus login terlebih dahulu!');
            return;
        }

        if (!uploadForm.name || !uploadForm.file) {
            alert('Nama file dan file harus diisi!');
            return;
        }
        
        if (userRole === 'guru') {
            // Guru langsung upload ke /api/upload (tanpa verifikasi)
            const formData = new FormData();
            formData.append('name', uploadForm.name);
            formData.append('category', uploadForm.category);
            formData.append('description', uploadForm.description);
            formData.append('file', uploadForm.file);

            try {
                const res = await uploadAsset(formData);
                console.log('Upload response:', res);
                alert('File berhasil diupload langsung!');
                document.getElementById('file_upload').close();
                setUploadForm({ name: '', category: 'Docs', description: '', file: null });
                loadAssets(); // Reload data
            } catch (error) {
                console.error('Upload error:', error);
                alert('Gagal mengupload file: ' + (error.response?.data?.error || error.message));
            }
        } else if (userRole === 'siswa') {
            // Siswa harus melalui verifikasi - kirim request ke /api/requests
            const requestData = new FormData();
            requestData.append('type', 'upload');
            requestData.append('name', uploadForm.name);
            requestData.append('category', uploadForm.category);
            requestData.append('description', uploadForm.description);
            requestData.append('message', `Siswa meminta persetujuan untuk upload file: ${uploadForm.name}`);
            requestData.append('file', uploadForm.file);

            try {
                await requestFile(requestData);
                alert('Permintaan upload berhasil dikirim!\n\nFile Anda sedang menunggu persetujuan dari admin.\nAnda akan diberitahu setelah file disetujui.');
                document.getElementById('file_upload').close();
                setUploadForm({ name: '', category: 'Docs', description: '', file: null });
            } catch (error) {
                console.error('Request error:', error);
                alert('Gagal mengirim permintaan: ' + (error.response?.data?.error || error.message));
            }
        } else {
            alert('Anda harus login sebagai Guru atau Siswa untuk mengupload file!');
        }
    };

    // Handle Report Form
    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportForm({ ...reportForm, [name]: value });
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            alert('Anda harus login terlebih dahulu!');
            return;
        }

        if (!reportForm.title || !reportForm.assetId || !reportForm.description) {
            alert('Semua field harus diisi!');
            return;
        }

        const formData = new FormData();
        formData.append('type', 'update');
        formData.append('targetAssetId', reportForm.assetId);
        formData.append('message', `[${reportForm.title}] ${reportForm.description}`);

        try {
            await requestFile(formData);
            if (userRole === 'siswa') {
                alert('Laporan berhasil dikirim!\n\nLaporan Anda sedang menunggu peninjauan dari admin.');
            } else {
                alert('Laporan berhasil dikirim untuk ditinjau!');
            }
            document.getElementById('file_report').close();
            setReportForm({ title: '', assetId: '', description: '' });
        } catch (error) {
            console.error('Report error:', error);
            alert('Gagal mengirim laporan: ' + (error.response?.data?.error || error.message));
        }
    };

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        loadAssets();
    };

    return (
        <div className="py-4">
            <form className="w-full flex justify-end" onSubmit={handleSearch}>
                <div className="join">
                    <div className="input">
                        <span className="label">
                            <Search size={16} />
                        </span>
                        <input 
                            type="text" 
                            className="join-item" 
                            placeholder="Cari file"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary join-item">Cari</button>
                </div> 
            </form>
            <hr className="my-2" />
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-x-8 justify-items-center">
                {assets.length > 0 ? (
                    assets.map((asset) => (
                        <FileCard 
                            key={asset._id} 
                            asset={asset}
                            sendToParent={handleFromChild}
                            onDetailClick={() => setSelectedAsset(asset)}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">Tidak ada file tersedia</p>
                )}
            </div>

            {/* FAB Menu */}
            <div className="fab">
                <div tabIndex={0} role="button" className="btn btn-xl btn-circle btn-primary">
                    <Plus size={24} />
                </div>
                <div className="fab-close">
                    <span className="btn btn-circle btn-xl btn-error">M</span>
                </div>
                <div>
                    Unggah
                    <button className="btn btn-xl btn-circle" onClick={() => document.getElementById('file_upload').showModal()}>
                        <Upload size={24} />
                    </button>
                </div>
                <div>
                    Lapor
                    <button className="btn btn-xl btn-circle btn-alert" onClick={() => document.getElementById('file_report').showModal()}>
                        <Siren size={24} />
                    </button>
                </div>
            </div>

            {/* Modal File Details */}
            <dialog id="file_details" className="modal">
                <div className="modal-box bg-transparent shadow-none p-0 w-fit max-w-4xl">
                    <div className="card bg-base-100 shadow-sm">
                        {selectedAsset && (
                            <>
                                {/* Debug: Log asset data */}
                                {console.log('Selected Asset:', selectedAsset)}
                                {console.log('Category:', selectedAsset.category)}
                                {console.log('Filename:', selectedAsset.filename)}
                                
                                {/* Preview Area */}
                                <figure className="bg-base-200 max-h-96 overflow-hidden">
                                    {/* Video Preview */}
                                    {selectedAsset.category === 'Video' && (
                                        <video 
                                            controls 
                                            className="w-full max-h-96"
                                            src={`${import.meta.env.VITE_API_URL}/stream/${selectedAsset.filename}`}
                                        >
                                            Browser Anda tidak mendukung video tag.
                                        </video>
                                    )}
                                    
                                    {/* Image Preview - Check by file extension or category */}
                                    {(selectedAsset.category === 'Foto' || 
                                      selectedAsset.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) && 
                                      selectedAsset.category !== 'Video' && (
                                        <img 
                                            src={`${import.meta.env.VITE_API_URL}/uploads/${selectedAsset.filename}`}
                                            alt={selectedAsset.name}
                                            className="w-full max-h-96 object-contain"
                                            onError={(e) => {
                                                console.error('Image load error:', e);
                                                e.target.src = placeholder;
                                            }}
                                        />
                                    )}
                                    
                                    {/* Document Preview - Show icon and file info */}
                                    {(selectedAsset.category === 'Docs' || 
                                      selectedAsset.category === 'ISO' || 
                                      selectedAsset.category === 'Apps') && 
                                      !selectedAsset.filename?.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i) && (
                                        <div className="flex flex-col items-center justify-center p-12 min-h-64">
                                            <FileText size={80} className="text-primary mb-4" />
                                            <p className="text-lg font-semibold">{selectedAsset.originalName || selectedAsset.filename}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                File {selectedAsset.category}
                                            </p>
                                        </div>
                                    )}
                                </figure>
                                
                                {/* Card Body */}
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h2 className="card-title">{selectedAsset.name}</h2>
                                        <span className={`badge badge-lg ${
                                            selectedAsset.category === 'Video' ? 'badge-error' :
                                            selectedAsset.category === 'Foto' ? 'badge-success' :
                                            selectedAsset.category === 'Docs' ? 'badge-info' :
                                            selectedAsset.category === 'ISO' ? 'badge-warning' :
                                            'badge-primary'
                                        }`}>
                                            {selectedAsset.category}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 my-2">
                                        <div>
                                            <p className="text-sm opacity-70">Ukuran File</p>
                                            <p className="font-semibold">{selectedAsset.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm opacity-70">Tanggal Upload</p>
                                            <p className="font-semibold">
                                                {selectedAsset.uploadDate 
                                                    ? new Date(selectedAsset.uploadDate).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })
                                                    : '-'
                                                }
                                            </p>
                                        </div>
                                        {selectedAsset.originalName && (
                                            <div className="col-span-2">
                                                <p className="text-sm opacity-70">Nama File Asli</p>
                                                <p className="font-semibold text-sm break-all">{selectedAsset.originalName}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {selectedAsset.description && (
                                        <div className="mt-2">
                                            <p className="text-sm opacity-70">Deskripsi</p>
                                            <p className="mt-1">{selectedAsset.description}</p>
                                        </div>
                                    )}
                                    
                                    {/* Version Info if exists */}
                                    {selectedAsset.versions && selectedAsset.versions.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm opacity-70 mb-2">Versi File (Total: {selectedAsset.versions.length})</p>
                                            <div className="max-h-32 overflow-y-auto">
                                                {selectedAsset.versions.map((version, index) => (
                                                    <div key={index} className="badge badge-ghost badge-sm mr-2 mb-2">
                                                        v{version.versionNumber} - {version.size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="card-actions justify-end mt-4">
                                        <form method="dialog">
                                            <button className="btn btn-ghost">Tutup</button>
                                        </form>
                                        <button 
                                            className={`btn ${isLoggedIn ? "btn-primary" : "btn-disabled"} gap-2`}
                                            onClick={() => {
                                                if (isLoggedIn && selectedAsset) {
                                                    window.location.href = `${import.meta.env.VITE_API_URL}/download/${selectedAsset.filename}`;
                                                }
                                            }}
                                            disabled={!isLoggedIn}
                                        >
                                            <Download size={18} />
                                            Download
                                        </button>
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

            {/* Modal Upload */}
            <dialog id="file_upload" className="modal">
                <div className="modal-box">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Upload File</h2>
                        {isLoggedIn && (
                            <div className="badge badge-lg gap-2">
                                {userRole === 'guru' ? (
                                    <>
                                        <GraduationCap size={16} />
                                        Guru
                                    </>
                                ) : (
                                    <>
                                        <User size={16} />
                                        Siswa
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <form onSubmit={handleUploadSubmit}>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <legend className="fieldset-legend">Deskripsi & Upload File</legend>

                            <label className="label">Nama File</label>
                            <input 
                                type="text" 
                                name="name"
                                className="input w-full" 
                                placeholder="Masukkan Nama File Disini"
                                value={uploadForm.name}
                                onChange={handleUploadChange}
                                required
                            />

                            <label className="label">Jenis File</label>
                            <select 
                                name="category"
                                className="select w-full"
                                value={uploadForm.category}
                                onChange={handleUploadChange}
                            >
                                <option value="Docs">Docs</option>
                                <option value="ISO">ISO</option>
                                <option value="Apps">Apps</option>
                                <option value="Foto">Foto</option>
                                <option value="Video">Video</option>
                            </select> 

                            <label className="label">Deskripsi</label>
                            <textarea 
                                name="description"
                                className="textarea h-24 w-full" 
                                placeholder="Deskripsi file disini"
                                value={uploadForm.description}
                                onChange={handleUploadChange}
                            />

                            <label className="label">Pilih File</label>
                            <input 
                                type="file" 
                                name="file"
                                className="file-input file-input-primary w-full"
                                onChange={handleUploadChange}
                                required
                            />

                            <button 
                                type="submit" 
                                className={`btn ${isLoggedIn ? "btn-primary" : "btn-disabled"} btn-block mt-4 gap-2`}
                                disabled={!isLoggedIn}
                            >
                                {!isLoggedIn ? (
                                    'Login Terlebih Dahulu'
                                ) : userRole === 'guru' ? (
                                    <>
                                        <CheckCircle size={18} />
                                        Upload Langsung
                                    </>
                                ) : (
                                    <>
                                        <Clock size={18} />
                                        Kirim Request (Perlu Verifikasi)
                                    </>
                                )}
                            </button>
                            
                            {userRole === 'siswa' && isLoggedIn && (
                                <div className="alert alert-warning mt-2">
                                    <AlertTriangle size={20} className="shrink-0" />
                                    <span className="text-sm">File Anda akan ditinjau oleh admin sebelum dipublikasikan.</span>
                                </div>
                            )}
                        </fieldset>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Modal Report */}
            <dialog id="file_report" className="modal">
                <div className="modal-box">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Lapor File</h2>
                        {isLoggedIn && (
                            <div className="badge badge-lg gap-2">
                                {userRole === 'guru' ? (
                                    <>
                                        <GraduationCap size={16} />
                                        Guru
                                    </>
                                ) : (
                                    <>
                                        <User size={16} />
                                        Siswa
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <form onSubmit={handleReportSubmit}>
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
                            <legend className="fieldset-legend">Pilih File</legend>

                            <label className="label">Judul Laporan</label>
                            <input 
                                type="text" 
                                name="title"
                                className="input w-full" 
                                placeholder="Masukkan Judul Laporan"
                                value={reportForm.title}
                                onChange={handleReportChange}
                                required
                            />

                            <label className="label">Pilih File</label>
                            <select 
                                name="assetId"
                                className="select w-full"
                                value={reportForm.assetId}
                                onChange={handleReportChange}
                                required
                            >
                                <option value="">-- Pilih File --</option>
                                {assets.map((asset) => (
                                    <option key={asset._id} value={asset._id}>
                                        {asset.name} ({asset.category})
                                    </option>
                                ))}
                            </select> 

                            <label className="label">Deskripsi Masalah</label>
                            <textarea 
                                name="description"
                                className="textarea h-24 w-full" 
                                placeholder="Jelaskan masalah dengan file ini"
                                value={reportForm.description}
                                onChange={handleReportChange}
                                required
                            />

                            <button 
                                type="submit" 
                                className={`btn ${isLoggedIn ? "btn-error" : "btn-disabled"} btn-block mt-4 gap-2`}
                                disabled={!isLoggedIn}
                            >
                                {!isLoggedIn ? (
                                    'Login Terlebih Dahulu'
                                ) : (
                                    <>
                                        <Siren size={18} />
                                        Kirim Laporan
                                    </>
                                )}
                            </button>
                            
                            {isLoggedIn && (
                                <div className="alert alert-info mt-2">
                                    <Info size={20} className="shrink-0" />
                                    <span className="text-sm">Laporan akan dikirim ke admin untuk ditindaklanjuti.</span>
                                </div>
                            )}
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