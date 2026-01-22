import { userLogin } from "@/controller/user.controller";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    
    async function handleLogin(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        try {
            const res = await userLogin({ username, password });
            localStorage.setItem("token", res.data.token);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login to Jarchive</h1>
                    <p className="py-6">
                        Dengan login, anda bisa mengunduh dan mengupload file tanpa batas!
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form className="fieldset" onSubmit={ handleLogin }>
                            <label className="label">Username</label>
                            <input name="username" type="text" className="input validator" placeholder="Username" required />
                            <span className="validator-hint hidden m-0">Username wajib diisi!</span>
                            <label className="label">Password</label>
                            <input name="password" type="password" className="input validator" placeholder="Password" required />
                            <span className="validator-hint hidden m-0">Password tidak boleh kosong!</span>
                            <div><a className="link link-hover">Lupa Password?</a></div>
                            <button className="btn btn-primary mt-4" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}