import { useEffect, useState } from "react";
import { Download, Upload, Trash2, CheckCircle, RotateCcw, Activity, Filter, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function LogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogsCount, setTotalLogsCount] = useState(0);
    const [actionCounts, setActionCounts] = useState({});

    const token = localStorage.getItem('token');

const loadLogs = async (page = 1, currentFilter = 'all') => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/logs`, {
                params: { page: page, limit: 50, action: currentFilter }
            });
            setLogs(res.data.logs);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
            setTotalLogsCount(res.data.totalLogs);

            const statsRes = await axios.get(`${API_URL}/api/logs/stats`);
            setActionCounts(statsRes.data);

        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Gagal memuat data log');
        } finally {
            setLoading(false);
        }
    };

    const handleClearLogs = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus semua log? Aksi ini tidak dapat dibatalkan!')) return;

        try {
            await axios.delete(`${API_URL}/api/logs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            toast.success('Semua log berhasil dihapus!');
            loadLogs();
        } catch (error) {
            console.error('Error clearing logs:', error);
            toast.error('Gagal menghapus log');
        }
    };

    useEffect(() => {
        loadLogs(currentPage, filter);
    }, [currentPage, filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'upload':
                return <Upload size={18} className="text-success" />;
            case 'download':
                return <Download size={18} className="text-info" />;
            case 'delete':
                return <Trash2 size={18} className="text-error" />;
            case 'approve':
                return <CheckCircle size={18} className="text-success" />;
            case 'reset':
                return <RotateCcw size={18} className="text-warning" />;
            case 'update':
                return <AlertCircle size={18} className="text-warning" />;
            default:
                return <Activity size={18} className="text-base-content" />;
        }
    };

    const getActionBadge = (action) => {
        const badges = {
            upload: 'badge-success',
            download: 'badge-info',
            delete: 'badge-error',
            approve: 'badge-success',
            reset: 'badge-warning',
            update: 'badge-warning'
        };
        return badges[action] || 'badge-ghost';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="py-4 px-2 md:px-0">
            <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">Log Aktivitas</h1>
                
                {/* Statistics Cards - Mobile Responsive */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-4">
                    <div className="stats shadow bg-base-100">
                        <div className="stat p-3 md:p-4">
                            <div className="stat-title text-xs md:text-sm">Total</div>
                            <div className="stat-value text-xl md:text-2xl text-primary">{totalLogsCount}</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat p-3 md:p-4">
                            <div className="stat-title text-xs md:text-sm">Upload</div>
                            <div className="stat-value text-xl md:text-2xl text-success">{actionCounts.upload || 0}</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat p-3 md:p-4">
                            <div className="stat-title text-xs md:text-sm">Download</div>
                            <div className="stat-value text-xl md:text-2xl text-info">{actionCounts.download || 0}</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat p-3 md:p-4">
                            <div className="stat-title text-xs md:text-sm">Delete</div>
                            <div className="stat-value text-xl md:text-2xl text-error">{actionCounts.delete || 0}</div>
                        </div>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat p-3 md:p-4">
                            <div className="stat-title text-xs md:text-sm">Approve</div>
                            <div className="stat-value text-xl md:text-2xl text-success">{actionCounts.approve || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Filter & Actions - Mobile Responsive */}
                <div className="flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center mb-4">
                    {/* Mobile: Dropdown Filter */}
                    <div className="md:hidden">
                        <select 
                            className="select select-bordered w-full"
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <option value="all">Semua</option>
                            <option value="upload">Upload</option>
                            <option value="download">Download</option>
                            <option value="delete">Delete</option>
                            <option value="approve">Approve</option>
                        </select>
                    </div>

                    {/* Desktop: Button Filter */}
                    <div className="hidden md:flex gap-2 flex-wrap">
                        <button 
                            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            Semua
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'upload' ? 'btn-success' : 'btn-ghost'}`}
                            onClick={() => handleFilterChange('upload')}
                        >
                            Upload
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'download' ? 'btn-info' : 'btn-ghost'}`}
                            onClick={() => handleFilterChange('download')}
                        >
                            Download
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'delete' ? 'btn-error' : 'btn-ghost'}`}
                            onClick={() => handleFilterChange('delete')}
                        >
                            Delete
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'approve' ? 'btn-success' : 'btn-ghost'}`}
                            onClick={() => handleFilterChange('approve')}
                        >
                            Approve
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'update' ? 'btn-warning' : 'btn-ghost'}`}
                            onClick={() => handleFilterChange('update')}
                        >
                            Update
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-primary btn-sm flex-1 md:flex-none"
                            onClick={loadLogs}
                        >
                            Refresh
                        </button>
                        <button 
                            className="btn btn-error btn-sm flex-1 md:flex-none gap-1"
                            onClick={handleClearLogs}
                        >
                            <Trash2 size={16} className="hidden md:inline" />
                            <span className="md:inline">Hapus Semua</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4 w-full mt-4">
                    <div className="skeleton h-24 w-full"></div>
                    <div className="skeleton h-24 w-full"></div>
                    <div className="skeleton h-24 w-full"></div>
                </div>
            ) : (
                <>
                    {/* Mobile: Card View */}
                    <div className="md:hidden space-y-2">
                        {logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-base-100 rounded-box shadow-sm">
                                <Activity size={48} className="mb-2 opacity-50" />
                                <h3 className="text-lg font-bold text-base-content">Log aktivitas Kosong</h3>
                                <p className="text-xs">Belum ada log aktivitas untuk ditampilkan.</p>
                            </div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={log._id} className="card bg-base-100 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {getActionIcon(log.action)}
                                                <span className={`badge ${getActionBadge(log.action)} badge-sm`}>
                                                    {log.action}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                #{totalLogsCount - ((currentPage - 1) * 50) - index}
                                            </span>
                                        </div>
                                        <p className="text-sm">{log.detail}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatDate(log.date)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop: Table View */}
                    <div className="hidden md:block overflow-x-auto bg-base-100 rounded-box shadow-md">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th className="w-12">#</th>
                                    <th>Aksi</th>
                                    <th>Detail</th>
                                    <th>Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <Activity size={48} className="mb-2 opacity-50" />
                                                <h3 className="text-lg font-bold text-base-content">Log aktivitas Kosong</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, index) => (
                                        <tr key={log._id}>
                                            <td className="font-mono text-sm text-gray-500">
                                                {totalLogsCount - ((currentPage - 1) * 50) - index}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {getActionIcon(log.action)}
                                                    <span className={`badge ${getActionBadge(log.action)} badge-sm`}>
                                                        {log.action}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="max-w-md">
                                                    {log.detail}
                                                </div>
                                            </td>
                                            <td className="text-sm font-mono">
                                                {formatDate(log.date)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Pagination Controls */}
            {logs.length > 0 && (
                <div className="flex flex-col items-center mt-6 mb-4">
                    <div className="join">
                        <button 
                            className="join-item btn btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            «
                        </button>
                        <button className="join-item btn btn-sm pointer-events-none">
                            Page {currentPage} of {totalPages}
                        </button>
                        <button 
                            className="join-item btn btn-sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            »
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        Total Records: {totalLogsCount}
                    </div>
                </div>
            )}
        </div>
    );
}