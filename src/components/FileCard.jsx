import { useEffect, useMemo, useState } from 'react';
import { File, FileText, Image, Video, HardDrive, Package } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

export default function FileCard({ asset, sendToParent, onDetailClick }) {
    const [canDownload, setCanDownload] = useState(false);

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
            sendToParent(false);
        } else {
            setCanDownload(true);
            sendToParent(true);
        }
    }, [decode, sendToParent]);

    const handleDownload = () => {
        if (canDownload) {
            window.location.href = `${import.meta.env.VITE_API_URL}/download/${asset.filename}`;
        }
    };

    const handleDetail = () => {
        if (onDetailClick) {
            onDetailClick(asset);
        }
        document.getElementById('file_details').showModal();
    };

    // Function to get icon based on category
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

    // Function to get background color based on category
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

    return (
        <div className="card bg-base-100 w-64 shadow-sm hover:shadow-lg transition-shadow">
            <figure className={`h-32 ${getCategoryBgColor()} flex items-center justify-center`}>
                {getCategoryIcon()}
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