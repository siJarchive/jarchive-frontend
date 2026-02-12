import { Github, TextAlignStart } from 'lucide-react';
import logoSIJA from '@/assets/images/logo-sija.jpg';
import { Outlet } from 'react-router-dom';

export default function HomeLayout() {
    return (
        <>
            <header className='navbar bg-base-100 shadow-sm sticky top-0 z-50'>
                <div className='navbar-start'>
                    <div className='dropdown'>
                        <label tabIndex={0} role='button' className='btn btn-ghost btn-circle lg:hidden'>
                            <TextAlignStart size={24} />
                        </label>
                        <ul tabIndex={0} className='menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow'>
                            <li><a href='/'>Home</a></li>
                            <li><a href='/dashboard'>Dashboard</a></li>
                            <li>
                                <details>
                                    <summary>Github</summary>
                                    <ul className='bg-base-100 rounded-t-none p-2'>
                                        <li><a href='https://github.com/siJarchive'>Organization</a></li>
                                        <li><a className='https://github.com/siJarchive/jarchive-frontend'>Frontend</a></li>
                                        <li><a href='https://github.com/siJarchive/jarchive-backend'>Backend</a></li>
                                    </ul>
                                    <p class="badge badge-soft badge-info text-xs lg:hidden">Versi website: 2025.2.12</p>
                                </details>
                            </li>   
                        </ul>
                    </div>
                    <div className='flex flex-row items-center'>
                        <a className="btn btn-ghost text-xl" onClick={() => navigate('/')}>
                        Jarchive
                            <span className="hidden lg:block">| SIJA Archive</span>
                        </a>
                        <span className='text-rotate'>
                            <span className='justify-items-start'>
                                <div className="badge badge-soft badge-info hidden lg:block">by Kelompok 2</div>
                                <div className="badge badge-soft badge-primary hidden lg:block">V2025.2.12</div>
                            </span> 
                        </span>
                    </div>
                </div>
                <div className='navbar-center hidden lg:flex'>
                    <ul className='menu menu-horizontal px-1'>
                        <li><a href='/'>Home</a></li>
                        <li><a  href='/dashboard'>Dashboard</a></li>
                        <li>
                            <details>
                                <summary>Github</summary>
                                <ul className='bg-base-100 rounded-t-none p-2'>
                                    <li><a href='https://github.com/siJarchive'>Organization</a></li>
                                    <li><a className='https://github.com/siJarchive/jarchive-frontend'>Frontend</a></li>
                                    <li><a href='https://github.com/siJarchive/jarchive-backend'>Backend</a></li>
                                </ul>
                            </details>
                        </li>   
                    </ul>
                </div>
                <div className='navbar-end'>
                    <a href='/login' className='btn btn-primary'>LOGIN</a>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className='footer sm:footer-horizontal bg-neutral text-neutral-content p-10'>
                <aside>
                    <div className='avatar'>
                        <div className='w-18 rounded-full bg-white p-2'>
                            <img src={logoSIJA} />
                        </div>
                    </div>
                    <p>
                        Developed by Kelompok 2
                        <br />
                        Sistem Informasi Jaringan dan Aplikasi
                    </p>
                </aside>
                <nav>
                    <h6 className='footer-title'>Developer</h6>
                    <a className='link link-hover'>Hilmy Adhyandra Hamzah</a>
                    <a className='link link-hover'>Muhamad Rifqi Kurniawan</a>
                    <a className='link link-hover'>Risma Rahayu</a>
                </nav>
                <nav>
                    <h6 className='footer-title'>Github</h6>
                    <a className='link link-hover' href='https://github.com/siJarchive'>Organization</a>
                    <a className='link link-hover' href='https://github.com/siJarchive/jarchive-frontend'>Frontend</a>
                    <a className='link link-hover' href='https://github.com/siJarchive/jarchive-backend'>Backend</a>
                </nav>
            </footer>
        </>
    )
}