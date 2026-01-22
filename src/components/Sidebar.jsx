import { House, Bell, Activity, ArrowUpDown, LogOut, PanelLeft, TriangleAlert } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
    const dashboardList = [
        {label: "Home", path: "/", icon: <House />},
        {label: "Notifikasi", path: "/notification", icon: <Bell />},
        {label: "Laporkan File", path: "/report", icon: <TriangleAlert />},
    ]

    const adminList = [
        {label: "Catatan", path: "/admin/logs", icon: <Activity />},
        {label: "Permintaan", path: "/admin/requests", icon: <ArrowUpDown />},
    ]

    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <div className="flex flex-col justify-between menu min-h-full px-4 is-drawer-close:px-1 is-drawer-close:w-21 is-drawer-open:w-80 pt-0 pb-1 bg-base-100 border-r border-base-300">
                <div>
                    <div className="navbar justify-between">
                        <a className="text-2xl is-drawer-close:hidden">Menu</a>
                        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button justify-end is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:flex" data-tip="Buka menu">
                            <PanelLeft size={24} />
                        </label>
                    </div>
                    <ul className="px-2 space-y-2">
                        <li className="menu-title is-drawer-close:hidden">Dashboard Section</li>
                        {dashboardList.map(item => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `justify-start btn is-drawer-close:tooltip is-drawer-close:flex is-drawer-close:tooltip-right ${isActive ? "btn-primary" : "btn-ghost"}`}
                                    data-tip={item.label}
                                >
                                    {item.icon}<span className="is-drawer-close:hidden">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                        <li className="menu-title is-drawer-close:hidden">Teacher Section</li>
                        {adminList.map(item => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `justify-start btn is-drawer-close:flex is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "btn-primary" : "btn-ghost"}`}
                                    data-tip={item.label}
                                >
                                    {item.icon}<span className="is-drawer-close:hidden">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                {localStorage.length > 0 && (
                    <div className="border-t border-base-content/15 py-2 flex justify-center">
                        <button className="btn btn-block btn-soft btn-error justify-start is-drawer-close:justify-start is-drawer-close:flex is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:w-fit" data-tip="Logout" onClick={() => {
                            localStorage.removeItem('token');
                            window.location.reload();
                        }}>
                            <LogOut size={24} />
                            <span className="is-drawer-close:hidden">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}