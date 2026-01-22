import { Header, Sidebar } from "@/components/index.js";
import { Outlet } from "react-router-dom";

export default function MainLayouts() {
    return (
    <>
        <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center bg-base-content/5">
                <Header />
                <main className="">
                    <Outlet />
                </main>
            </div>
            <Sidebar />
        </div>
    </>
    )
}