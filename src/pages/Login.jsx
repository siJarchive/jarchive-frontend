import { userLogin } from "@/controller/user.controller";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    
    // State untuk mengontrol status error dan sukses
    const [status, setStatus] = useState({
        username: { type: "", message: "" }, // type bisa "error" atau "success"
        password: { type: "", message: "" }
    });

    async function handleLogin(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const res = await userLogin({ username, password });
            
            // Jika berhasil, ubah border dan teks jadi hijau
            setStatus({
                username: { type: "success", message: "Username benar" },
                password: { type: "success", message: "Password benar" }
            });

            localStorage.setItem("token", res.data.token);
            
            // Tunggu sebentar agar user bisa melihat warna hijau sebelum pindah
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);

            } catch (error) {
            console.log(error);
            
            // 1. Ambil pesan error dari backend (jika ada)
            const backendErrorMsg = error.response?.data?.error || "Terjadi kesalahan pada server";

            // 2. Cek apakah error karena Rate Limiter (Status 429)
            if (error.response?.status === 429) {
                setStatus({
                    // Tampilkan pesan limit di bawah input
                    username: { type: "error", message: backendErrorMsg },
                    password: { type: "error", message: "Coba lagi setelah 5 menit" }
                });
            } else {
                // 3. Error login biasa (Status 401 atau 400)
                setStatus({
                    username: { type: "error", message: "Username salah atau tidak cocok" },
                    password: { type: "error", message: "Password salah atau tidak cocok" }
                });
            }
        }
    }

    // Helper function untuk menentukan class border
    const getBorderClass = (field) => {
        if (status[field].type === "error") return "border-error focus:border-error border-2";
        if (status[field].type === "success") return "border-success focus:border-success border-2";
        return "";
    };

    // Helper function untuk menentukan class teks
    const getTextClass = (field) => {
        return status[field].type === "error" ? "text-error" : "text-success";
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login ke Jarchive</h1>
                    <p className="py-6">
                        Dengan login, anda bisa mengunduh dan mengupload file tanpa batas!
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form className="fieldset" onSubmit={ handleLogin }>
                            <label className="label">Username</label>
                            <input 
                                name="username" 
                                type="text" 
                                className={`input ${getBorderClass('username')}`} 
                                placeholder="Username" 
                                required 
                            />
                            {/* Pesan Peringatan */}
                            {status.username.message && (
                                <span className={`text-xs mt-1 ml-1 font-medium ${getTextClass('username')}`}>
                                    {status.username.message}
                                </span>
                            )}

                            <label className="label mt-2">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                className={`input ${getBorderClass('password')}`} 
                                placeholder="Password" 
                                required 
                            />
                            {/* Pesan Peringatan */}
                            {status.password.message && (
                                <span className={`text-xs mt-1 ml-1 font-medium ${getTextClass('password')}`}>
                                    {status.password.message}
                                </span>
                            )}

                            <button className="btn btn-primary mt-4" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}