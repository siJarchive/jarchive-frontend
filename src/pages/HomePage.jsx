import { FileCardExample } from '@/components/index';

import bgIllustration from '@/assets/images/bg-illustration.jpg';
import desktopView from '@/assets/images/website-view/desktop.png';
import preview from '@/assets/images/website-view/preview.png';
import logPage from '@/assets/images/website-view/log.png';
import { Laptop, Smartphone } from 'lucide-react';

export default function HomePage() {
    return (
        <>
            <div className="hero bg-base-200 min-h-screen" style={{ backgroundImage: `url(${bgIllustration})` }}>
                <div className='hero-overlay'></div>
                <div className="hero-content text-center text-white">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">SIJA ARCHIVE</h1>
                        <p className="py-6">
                            Website platform local repository dan manajemen aset digital khusus untuk jurusan SIJA. Jarchive berfungsi sebagai pusat distribusi file ISO, aplikasi (seperti Cisco Packet Tracer, Postman, dll), serta dokumentasi teknis yang dapat diakses secara cepat melalui jaringan lokal (LAN). Tujuannya adalah untuk menghemat bandwidth internet sekolah dan memudahkan siswa dalam mendapatkan sumber daya praktik yang valid dan aman.
                        </p>
                        <a href="/dashboard" className="btn btn-primary">
                            Buka Dashboard
                        </a>
                    </div>
                </div>
            </div>
            <div className='px-6 py-16'>
                <h2 className='text-4xl text:left lg:text-center font-bold mb-8'>MENDUKUNG BERBAGAI JENIS FILE</h2>
                <div className='carousel carousel-center bg-base-300 rounded-box max-w-full space-x-4 p-4'>
                    <div className="carousel-item">
                        <FileCardExample fileType="Foto"/>
                    </div>
                    <div className="carousel-item">
                        <FileCardExample fileType="Video"/>
                    </div>
                    <div className="carousel-item">
                        <FileCardExample fileType="Docs"/>
                    </div>
                    <div className="carousel-item">
                        <FileCardExample fileType="ISO"/>
                    </div>
                    <div className="carousel-item">
                        <FileCardExample fileType="Apps"/>
                    </div>
                    <div className="carousel-item">
                        <FileCardExample fileType="Lainnya"/>
                    </div>
                </div>
            </div>
            <div className='px-6 pb-16'>
                <h2 className='text-4xl text-left lg:text-center font-bold mb-8'>
                    DUKUNGAN CROSS-PLATFORM
                    <span>
                        <h4 className='text-xl font-medium'>
                            Akses dimana saja dan kapan saja!
                        </h4>
                    </span>
                </h2>
                <div class="hero bg-base-200 px-12 rounded-2xl">
                    <div class="hero-content flex-col lg:flex-row gap-16">
                        <div className='bg-primary/10 w-fit h-fit flex items-center justify-center text-primary rounded-xl'>
                            <Laptop size={128} />
                        </div>
                        <div>
                            <h1 class="text-5xl font-bold">Desktop</h1>
                            <p class="py-6">
                                Akses penuh melalui browser desktop dengan tampilan yang lebih luas dan nyaman. Cocok untuk mengelola file berukuran besar, mengunggah ISO atau aplikasi, serta melakukan administrasi dan manajemen arsip secara efisien.
                            </p>
                        </div>
                        <div className='bg-primary/10 w-fit h-fit flex items-center justify-center text-primary rounded-xl'>
                            <Smartphone size={128} />
                        </div>
                        <div>
                            <h1 class="text-5xl font-bold">Mobile</h1>
                            <p class="py-6">
                                Tetap terhubung melalui perangkat mobile dengan tampilan responsif dan ringan. Memungkinkan pengguna untuk mencari, melihat, dan mengunduh file dengan cepat kapan pun dan di mana pun melalui jaringan lokal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-base-200 px-6 py-16'>
                <h2 className='text-4xl text-left lg:text-center font-bold mb-8'>
                    MENGAPA JARCHIVE?
                </h2>
                <div className="hero flex-col">
                    <div className="hero-content flex-col lg:flex-row-reverse lg:px-24">
                        <img
                            src={desktopView}
                            className="max-w-80px lg:max-w-md rounded-lg shadow-2xl"
                        />
                            <div>
                            <h1 className="text-5xl font-bold">Minimalist & Clean UI</h1>
                            <p className="py-6">
                                <strong>Jarchive</strong> dibangun dengan teknologi modern seperti <span className='badge badge-soft badge-info text-info'>TailwindCSS</span> & 
                                <span className='badge badge-soft badge-warning text-warning'>daisyUI</span> 
                                untuk menghadirkan tampilan yang bersih, konsisten, dan mudah digunakan.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="hero flex-col">
                    <div className="hero-content flex-col lg:flex-row lg:px-24">
                        <img
                            src={preview}
                            className="max-w-80px lg:max-w-md rounded-lg shadow-2xl"
                        />
                            <div>
                            <h1 className="text-5xl font-bold">Preview & Stream</h1>
                            <p className="py-6">
                                <strong>Kehabisan storage? tak masalah!</strong> Jarchive memiliki fitur preview dan stream yang memungkinkan pengguna melihat foto dan video tanpa harus mengunduh file.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="hero flex-col">
                    <div className="hero-content flex-col lg:flex-row-reverse lg:px-24">
                        <img
                            src={logPage}
                            className="max-w-80px lg:max-w-md rounded-lg shadow-2xl"
                        />
                            <div>
                            <h1 className="text-5xl font-bold">Monitoring & Logging</h1>
                            <p className="py-6">
                                Sistem request file memberikan kontrol penuh kepada admin dalam mengelola konten arsip. Ditambah dengan fitur logging yang komprehensif, setiap aktivitas unduhan dapat dilacak secara rinci untuk memastikan keamanan, transparansi, dan efisiensi distribusi file.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}