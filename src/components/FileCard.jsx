import { useEffect, useMemo, useState } from 'react';
import { File, FileText, Image, Video, HardDrive, Package, Edit, Trash2 } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { deleteAsset } from "@/controller/file.controller";

export default function FileCard({ asset, sendToParent, onDetailClick, onEdit, onDelete }) {
    const [canDownload, setCanDownload] = useState(false);
    const [userRole, setUserRole] = useState(null);

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

    const handleDownload = () => {
        if (canDownload) {
            // Query parameter untuk track siapa yang download
            const downloadUrl = `${import.meta.env.VITE_API_URL}/download/${asset.filename}?role=${userRole}`;
            window.location.href = downloadUrl;
        }
    };

    const handleDetail = () => {
        if (onDetailClick) {
            onDetailClick(asset);
        }
        document.getElementById('file_details').showModal();
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(asset);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus file "${asset.name}"?\n\nAksi ini tidak dapat dibatalkan!`)) {
            return;
        }

        try {
            await deleteAsset(asset._id);
            alert('File berhasil dihapus!');
            if (onDelete) {
                onDelete(asset._id);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Gagal menghapus file: ' + (error.response?.data?.error || error.message));
        }
    };

    // Function untuk memunculkan icon berdasarkan kategori file
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

    // Fungsi untuk mengubah warna bg berdasarkan kategori
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

    const isGuru = userRole === 'guru';

    return (
        <div className="card bg-base-100 w-64 shadow-sm hover:shadow-lg transition-shadow">
            <figure className={`h-32 ${getCategoryBgColor()} flex items-center justify-center relative`}>
                {getCategoryIcon()}
                
                {/* Aksi Admin - Hapus dan Edit */}
                {isGuru && (
                    <div className="absolute top-2 right-2 flex gap-1">
                        <button
                            className="btn btn-circle btn-sm btn-warning"
                            onClick={handleEdit}
                            title="Edit File"
                        >
                            <Edit size={14} />
                        </button>
                        <button
                            className="btn btn-circle btn-sm btn-error"
                            onClick={handleDelete}
                            title="Hapus File"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title text-base truncate" title={asset.name}>
                    {asset.name}
                </h2>
                <div className="text-sm space-y-1">
                    <p className={`badge badge-sm ${
                        asset.category === 'Foto' ? 'badge-success' :
                        asset.category === 'Video' ? 'badge-error' :
                        asset.category === 'Docs' ? 'badge-info' :
                        asset.category === 'ISO' ? 'badge-warning' :
                        asset.category === 'Apps' ? 'badge-secondary' :
                        'badge-primary'
                    }`}>
                        {asset.category}
                    </p>
                    <p className="text-xs text-gray-500">Ukuran: {asset.size}</p>
                    <p className="text-xs text-gray-500 line-clamp-2" title={asset.description}>
                        {asset.description || 'Tidak ada deskripsi'}
                    </p>
                </div>
                <div className="card-actions justify-end mt-2">
                    <button 
                        className='btn btn-outline btn-primary btn-sm' 
                        onClick={handleDetail}
                    >
                        Detail
                    </button>
                    <button 
                        className={`btn btn-sm ${btnStyle[canDownload]}`} 
                        data-tip="Anda harus login terlebih dahulu"
                        onClick={handleDownload}
                        disabled={!canDownload}
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    )
}