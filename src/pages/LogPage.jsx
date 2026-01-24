import { useEffect, useState } from "react";
import { Download, Upload, Trash2, CheckCircle, RotateCcw, Activity, Filter } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function LogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const token = localStorage.getItem('token');

    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/logs`);
            setLogs(res.data);
            console.log(res);
        } catch (error) {
            console.error('Error fetching logs:', error);
            alert('Gagal memuat data log');
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
            
            alert('Semua log berhasil dihapus!');
            loadLogs();
        } catch (error) {
            console.error('Error clearing logs:', error);
            alert('Gagal menghapus log');
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

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
            reset: 'badge-warning'
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

    const filteredLogs = filter === 'all' 
        ? logs 
        : logs.filter(log => log.action === filter);

    const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="py-4 px-2 md:px-0">
            <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">Log Aktivitas</h1>
                
                {/* Statistics Cards - Mobile Responsive */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-4">
                    <div className="stats shadow bg-base-100">
                        <div className="stat p-3 md:p-4">
                            <div className="stat-title text-xs md:text-sm">Total</div>
                            <div className="stat-value text-xl md:text-2xl text-primary">{logs.length}</div>
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
                            onChange={(e) => setFilter(e.target.value)}
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
                            onClick={() => setFilter('all')}
                        >
                            Semua
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'upload' ? 'btn-success' : 'btn-ghost'}`}
                            onClick={() => setFilter('upload')}
                        >
                            Upload
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'download' ? 'btn-info' : 'btn-ghost'}`}
                            onClick={() => setFilter('download')}
                        >
                            Download
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'delete' ? 'btn-error' : 'btn-ghost'}`}
                            onClick={() => setFilter('delete')}
                        >
                            Delete
                        </button>
                        <button 
                            className={`btn btn-sm ${filter === 'approve' ? 'btn-success' : 'btn-ghost'}`}
                            onClick={() => setFilter('approve')}
                        >
                            Approve
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
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    {/* Mobile: Card View */}
                    <div className="md:hidden space-y-2">
                        {filteredLogs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {filter === 'all' 
                                    ? 'Tidak ada log aktivitas'
                                    : `Tidak ada log untuk aksi "${filter}"`
                                }
                            </div>
                        ) : (
                            filteredLogs.map((log, index) => (
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
                                                #{filteredLogs.length - index}
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
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            {filter === 'all' 
                                                ? 'Tidak ada log aktivitas'
                                                : `Tidak ada log untuk aksi "${filter}"`
                                            }
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log, index) => (
                                        <tr key={log._id}>
                                            <td className="font-mono text-sm text-gray-500">
                                                {filteredLogs.length - index}
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

            {/* Pagination Info */}
            {filteredLogs.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    Menampilkan {filteredLogs.length} dari {logs.length} log
                </div>
            )}
        </div>
    );
}