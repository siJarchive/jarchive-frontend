import { useEffect, useMemo, useState, useRef } from 'react';
import { File, FileText, Image, Video, HardDrive, Package, Edit, Trash2, X, FilePenLine } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { deleteAsset, downloadFileBlob } from "@/controller/file.controller";

export default function FileCard({ asset, sendToParent, onDetailClick, onEdit, onDelete, onUpdateRequest }) {
    const [canDownload, setCanDownload] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadAbortController = useRef(null);

    const btnStyle = { 
        true: "btn-primary", 
        false: "btn-disabled tooltip" 
    };

    const token = localStorage.getItem('token');
    
    const decode = useMemo(() => {
        if (!token) return null;
        try { 
            return jwtDecode(token); 
        } catch { 
            return null; 
        }
    }, [token]);

    useEffect(() => {
        if (decode?.role == undefined) { 
            setCanDownload(false); 
            setUserRole(null); 
            sendToParent(false); 
        } else { 
            setCanDownload(true); 
            setUserRole(decode.role); 
            sendToParent(true); 
        }
    }, [decode, sendToParent]);

    const handleCancelDownload = () => { 
        if (downloadAbortController.current) {
            downloadAbortController.current.abort(); 
        }
    };

    const handleDownload = async () => {
        if (!canDownload || isDownloading) return;
        
        try {
            setIsDownloading(true); 
            setDownloadProgress(0);
            downloadAbortController.current = new AbortController();
            
            const blob = await downloadFileBlob(
                asset.filename, 
                userRole, 
                (percent) => setDownloadProgress(percent), 
                downloadAbortController.current.signal
            );
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a'); 
            link.href = url; 
            link.setAttribute('download', asset.originalName || asset.filename);
            
            document.body.appendChild(link); 
            link.click(); 
            link.remove(); 
            window.URL.revokeObjectURL(url);
        } catch (error) {
            if (!axios.isCancel(error)) { 
                console.error('Download error:', error); 
                toast.error('Gagal mendownload file'); 
            }
        } finally { 
            setIsDownloading(false); 
            setDownloadProgress(0); 
            downloadAbortController.current = null; 
        }
    };

    const isGuru = userRole === 'guru';
    const isSiswa = userRole === 'siswa';

    const handleDetail = () => { 
        if (onDetailClick) onDetailClick(asset); 
        document.getElementById('file_details').showModal(); 
    };

    const handleEdit = () => { 
        if (onEdit) onEdit(asset); 
    };

    const handleUpdateRequest = () => { 
        if (onUpdateRequest) onUpdateRequest(asset); 
    }; 

    const handleDelete = async () => { 
        if (!confirm(`Hapus "${asset.name}"?`)) return; 
        
        try { 
            await deleteAsset(asset._id); 
            toast.success('Terhapus!'); 
            if (onDelete) onDelete(asset._id); 
        } catch (error) { 
            toast.error('Gagal hapus'); 
        } 
    };

    // Helper functions
    const getCategoryIcon = () => {
        switch(asset.category) {
            case 'Foto': 
                return <Image size={48} className="text-success" />;
            case 'Video': 
                return <Video size={48} className="text-error" />;
            case 'Docs': 
                return <FileText size={48} className="text-info" />;
            case 'ISO': 
                return <HardDrive size={48} className="text-warning" />;
            case 'Apps': 
                return <Package size={48} className="text-secondary" />;
            default: 
                return <File size={48} className="text-primary" />;
        }
    };

    const getCategoryBgColor = () => {
        switch(asset.category) {
            case 'Foto': 
                return 'bg-success/10'; 
            case 'Video': 
                return 'bg-error/10'; 
            case 'Docs': 
                return 'bg-info/10'; 
            case 'ISO': 
                return 'bg-warning/10'; 
            case 'Apps': 
                return 'bg-secondary/10'; 
            default: 
                return 'bg-base-200';
        }
    };

    const getCategoryBadgeClass = () => {
        switch(asset.category) {
            case 'Foto': return 'badge-success';
            case 'Video': return 'badge-error';
            case 'Docs': return 'badge-info';
            case 'ISO': return 'badge-warning';
            case 'Apps': return 'badge-secondary';
            default: return 'badge-primary';
        }
    };

    return (
        <div className="card bg-base-100 w-64 shadow-sm hover:shadow-lg transition-shadow">
            <figure className={`h-32 ${getCategoryBgColor()} flex items-center justify-center relative`}>
                {getCategoryIcon()}
                
                {/* Tombol Aksi Guru */}
                {isGuru && (
                    <div className="absolute top-2 right-2 flex gap-1">
                        <button className="btn btn-circle btn-sm btn-warning" onClick={handleEdit} title="Edit File">
                            <Edit size={14} />
                        </button>
                        <button className="btn btn-circle btn-sm btn-error" onClick={handleDelete} title="Hapus File">
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
                
                {/* Tombol Request Update untuk Siswa */}
                {isSiswa && (
                    <div className="absolute top-2 right-2">
                        <button className="btn btn-circle btn-sm btn-info text-white" onClick={handleUpdateRequest} title="Ajukan Update">
                            <FilePenLine size={14} />
                        </button>
                    </div>
                )}
            </figure>
            
            <div className="card-body">
                <h2 className="card-title text-base truncate" title={asset.name}>
                    {asset.name}
                </h2>
                
                <div className="text-sm space-y-1">
                    <p className={`badge badge-sm ${getCategoryBadgeClass()}`}>
                        {asset.category}
                    </p>
                    <p className="text-xs text-gray-500">Ukuran: {asset.size}</p>
                    <p className="text-xs text-gray-500 line-clamp-2" title={asset.description}>
                        {asset.description || 'Tidak ada deskripsi'}
                    </p>
                </div>
                
                <div className="card-actions justify-end mt-2">
                    <button className='btn btn-outline btn-primary btn-sm' onClick={handleDetail}>
                        Detail
                    </button>
                    
                    {isDownloading ? (
                        <div className="relative group cursor-pointer" onClick={handleCancelDownload} title="Batalkan Download">
                            <div 
                                className="radial-progress text-primary text-xs group-hover:opacity-20 transition-opacity" 
                                style={{ "--value": downloadProgress, "--size": "2rem" }} 
                                role="progressbar"
                            >
                                {downloadProgress}%
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={16} className="text-error" />
                            </div>
                        </div>
                    ) : (
                        <button 
                            className={`btn btn-sm ${btnStyle[canDownload]}`} 
                            data-tip="Login dulu" 
                            onClick={handleDownload} 
                            disabled={!canDownload}
                        >
                            Download
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}