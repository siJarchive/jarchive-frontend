import { Image, Video, FileText, HardDrive, Package, File } from "lucide-react";

export default function FileCardExample(fileType) {
    console.log(fileType)
    const getCategoryIcon = () => {
        switch(fileType.fileType) {
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
        switch(fileType.fileType) {
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
                return 'bg-primary/10';
        }
    };

    const getDescription =  () => {
        switch(fileType.fileType) {
            case 'Foto':
                return 'Mendukung berbagai format gambar seperti JPG, PNG, dan lainnya untuk dokumentasi maupun aset visual.';
            case 'Video':
                return 'Menyimpan dan membagikan file video pembelajaran, tutorial, maupun dokumentasi kegiatan.';
            case 'Docs':
                return 'File dokumen seperti PDF, Word, Excel, dan PowerPoint untuk kebutuhan administrasi dan materi.';
            case 'ISO':
                return 'File image sistem operasi atau installer yang dapat digunakan untuk instalasi dan deployment.';
            case 'Apps':
                return 'File aplikasi atau installer software pendukung pembelajaran dan praktikum.';
            default:
                return 'Berbagai jenis file tambahan seperti arsip (ZIP/RAR) dan format khusus lainnya.';
        }
    }
    return (
        <div className="card bg-base-100 w-64 h-80 shadow-sm hover:shadow-lg transition-shadow">
            <figure className={`h-32 ${getCategoryBgColor()} flex items-center justify-center relative`}>
                {getCategoryIcon()}
            </figure>
            <div className="card-body">
                <h2 className="card-title text-xl font-semibold truncate" title={fileType.fileType}>
                    {fileType.fileType}
                </h2>
                <div className="text-sm space-y-1">
                    <p>{getDescription()}</p>
                </div>
            </div>
        </div>
    )
}