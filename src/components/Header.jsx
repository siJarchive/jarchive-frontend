import { PanelLeft, LogIn } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Header() {
    const token = localStorage.getItem('token');
    const decode = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);
    const role = decode?.role;
    
    const roleTheme = {
        siswa: 'badge-accent',
        guru: 'badge-primary'
    } 

    const navigate = useNavigate();
    return (
        <header className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <label htmlFor="my-drawer" className="btn btn-ghost drawer-button lg:hidden">
                    <PanelLeft size={24} />
                </label>
                <a className="btn btn-ghost text-xl" onClick={() => navigate('/')}>
                    Jarchive
                    <span className="hidden lg:block">| SIJA Archive</span>
                </a>
            </div>
            <div className="navbar-center">
                <p className="badge badge-outline badge-primary hidden sm:block">by Kelompok 2 | XII SIJA A</p>
            </div>
            <div className="navbar-end">
                {localStorage.length > 0 ? (
                    <p className={`badge badge-soft ${roleTheme[role]} text-lg font-semibold`}>
                        {role.toUpperCase()}
                    </p>
                ) : (
                    <a className="btn btn-primary" onClick={() => navigate('/login')}>
                        <LogIn size={18} />
                        LOGIN
                    </a>
                )}
                
            </div>
        </header>
    )
}