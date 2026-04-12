import { useEffect, useState } from "react";
import { approveRequest, rejectRequest, clearRequests } from "@/controller/file.controller";
import { CheckCircle, XCircle, FileText, Upload, AlertCircle, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function RequestPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRequestsCount, setTotalRequestsCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [requestStats, setRequestStats] = useState({});

    const loadRequests = async (page = 1, currentStatus = 'all') => {
        try {
            setLoading(true);
            
            // 1. Fetch data paginasi
            const res = await axios.get(`${API_URL}/api/requests`, {
                params: { page: page, limit: 20, status: currentStatus }
            });
            
            setRequests(res.data.requests);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
            setTotalRequestsCount(res.data.totalRequests);

            // 2. Fetch data statistik
            const statsRes = await axios.get(`${API_URL}/api/requests/stats`);
            setRequestStats(statsRes.data);

        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Gagal memuat data permintaan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests(currentPage, filter);
    }, [currentPage, filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleApprove = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menyetujui permintaan ini?')) return;

        try {
            await approveRequest(id);
            toast.success('Permintaan berhasil disetujui!');
            loadRequests();
            // Trigger sidebar refresh by dispatching custom event
            window.dispatchEvent(new Event('refreshSidebarBadges'));
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Gagal menyetujui permintaan');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menolak permintaan ini?')) return;

        try {
            await rejectRequest(id);
            toast.success('Permintaan berhasil ditolak!');
            loadRequests();
            // Trigger sidebar refresh by dispatching custom event
            window.dispatchEvent(new Event('refreshSidebarBadges'));
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Gagal menolak permintaan');
        }
    };

    const handleClearRequests = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus semua permintaan? Aksi ini tidak dapat dibatalkan!')) return;

        try {
            await clearRequests();
            toast.success('Semua permintaan berhasil dihapus!');
            loadRequests();
            // Trigger sidebar refresh
            window.dispatchEvent(new Event('refreshSidebarBadges'));
        } catch (error) {
            console.error('Error clearing requests:', error);
            toast.error('Gagal menghapus semua permintaan');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-error'
        };
        return badges[status] || 'badge-ghost';
    };

    const getTypeIcon = (type) => {
        if (type === 'upload') return <Upload size={20} className="text-primary" />;
        if (type === 'update') return <AlertCircle size={20} className="text-warning" />;
        return <FileText size={20} />;
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
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Kelola Permintaan</h1>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4">
                    <div className="stats shadow bg-base-100"><div className="stat p-3 md:p-4"><div className="stat-title text-xs">Total</div><div className="stat-value text-xl text-primary">{totalRequestsCount}</div></div></div>
                    <div className="stats shadow bg-base-100"><div className="stat p-3 md:p-4"><div className="stat-title text-xs">Pending</div><div className="stat-value text-xl text-warning">{requestStats.pending || 0}</div></div></div>
                    <div className="stats shadow bg-base-100"><div className="stat p-3 md:p-4"><div className="stat-title text-xs">Approved</div><div className="stat-value text-xl text-success">{requestStats.approved || 0}</div></div></div>
                    <div className="stats shadow bg-base-100"><div className="stat p-3 md:p-4"><div className="stat-title text-xs">Rejected</div><div className="stat-value text-xl text-error">{requestStats.rejected || 0}</div></div></div>
                </div>

                {/* Filter & Actions */}
                <div className="flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center mb-4">
                    
                    {/* Filter Buttons */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleFilterChange('all')}>Semua</button>
                        <button className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : 'btn-ghost'}`} onClick={() => handleFilterChange('pending')}>Pending</button>
                        <button className={`btn btn-sm ${filter === 'approved' ? 'btn-success' : 'btn-ghost'}`} onClick={() => handleFilterChange('approved')}>Approved</button>
                        <button className={`btn btn-sm ${filter === 'rejected' ? 'btn-error' : 'btn-ghost'}`} onClick={() => handleFilterChange('rejected')}>Rejected</button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-primary btn-sm flex-1 md:flex-none"
                            onClick={() => loadRequests(currentPage, filter)}
                        >
                            Refresh
                        </button>
                        <button 
                            className="btn btn-error btn-sm flex-1 md:flex-none gap-1"
                            onClick={handleClearRequests}
                            disabled={requests.length === 0 || loading}
                        >
                            <Trash2 size={16} className="hidden md:inline" />
                            <span className="md:inline">Hapus Semua</span>
                        </button>
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
                    <div className="md:hidden space-y-3">
                        {requests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-base-100 rounded-box shadow-sm">
                                <FileText size={48} className="mb-2 opacity-50" />
                                <h3 className="text-lg font-bold text-base-content">Data permintaan Kosong</h3>
                                <p className="text-xs">Belum ada data permintaan untuk ditampilkan.</p>
                            </div>
                        ) : (
                            requests.map((request, index) => (
                                <div key={request._id} className="card bg-base-100 shadow-sm">
                                    <div className="card-body p-4">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(request.type)}
                                                <span className="font-semibold capitalize">{request.type}</span>
                                                <span className={`badge badge-sm ${getStatusBadge(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 font-mono">
                                                #{totalRequestsCount - ((currentPage - 1) * 20) - index}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <p className="font-semibold text-base">
                                                    {request.tempName || request.targetAssetId?.name || '-'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {request.tempCategory || request.targetAssetId?.category || '-'}
                                                    {request.tempSize && ` • ${request.tempSize}`}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(request.date)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="card-actions justify-end mt-3">
                                            <button
                                                className="btn btn-info btn-sm gap-1"
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    document.getElementById('request_detail_modal').showModal();
                                                }}
                                            >
                                                <Eye size={14} />
                                                Detail
                                            </button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="btn btn-success btn-sm gap-1"
                                                        onClick={() => handleApprove(request._id)}
                                                    >
                                                        <CheckCircle size={14} />
                                                        Setujui
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-sm gap-1"
                                                        onClick={() => handleReject(request._id)}
                                                    >
                                                        <XCircle size={14} />
                                                        Tolak
                                                    </button>
                                                </>
                                            )}
                                        </div>
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
                                    <th>Tipe</th>
                                    <th>Nama File</th>
                                    <th>Kategori</th>
                                    <th>Waktu</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText size={48} className="mb-2 opacity-50" />
                                                <h3 className="text-lg font-bold text-base-content">Data permintaan Kosong</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request, index) => (
                                        <tr key={request._id}>
                                            <td className="font-mono text-sm text-gray-500">
                                                {totalRequestsCount - ((currentPage - 1) * 20) - index}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(request.type)}
                                                    <span className="capitalize">{request.type}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium">
                                                    {request.tempName || request.targetAssetId?.name || '-'}
                                                </div>
                                                {request.tempSize && (
                                                    <div className="text-xs text-gray-500">
                                                        {request.tempSize}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge badge-sm badge-outline">
                                                    {request.tempCategory || request.targetAssetId?.category || '-'}
                                                </span>
                                            </td>
                                            <td className="text-sm">
                                                {formatDate(request.date)}
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>
                                                {request.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleApprove(request._id)}
                                                            title="Setujui"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            className="btn btn-error btn-sm"
                                                            onClick={() => handleReject(request._id)}
                                                            title="Tolak"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                document.getElementById('request_detail_modal').showModal();
                                                            }}
                                                            title="Detail"
                                                        >
                                                            Detail
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            document.getElementById('request_detail_modal').showModal();
                                                        }}
                                                    >
                                                        Lihat Detail
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {requests.length > 0 && (
                <div className="flex flex-col items-center mt-6 mb-4">
                    <div className="join">
                        <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>«
                        </button>
                        <select 
                            className="join-item btn btn-sm appearance-none bg-base-200 text-center cursor-pointer font-semibold" 
                            value={currentPage} 
                            onChange={(e) => setCurrentPage(Number(e.target.value))}
                            title="Pilih Halaman"
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <option key={page} value={page}>
                                    Page {page} of {totalPages}
                                </option>
                            ))}
                        </select>

                        <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>»</button>
                    </div>
                </div>
            )}

            {/* Modal Detail Request */}
            <dialog id="request_detail_modal" className="modal">
                <div className="modal-box max-w-lg">
                    <h3 className="font-bold text-lg mb-4">Detail Permintaan</h3>
                    {selectedRequest && (
                        <div className="space-y-3">
                            <div>
                                <label className="font-semibold text-sm">Tipe:</label>
                                <p className="capitalize">{selectedRequest.type}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-sm">Status:</label>
                                <p>
                                    <span className={`badge ${getStatusBadge(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="font-semibold text-sm">Nama File:</label>
                                <p>{selectedRequest.tempName || selectedRequest.targetAssetId?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-sm">Kategori:</label>
                                <p>{selectedRequest.tempCategory || selectedRequest.targetAssetId?.category || '-'}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-sm">Deskripsi:</label>
                                <p>{selectedRequest.tempDescription || '-'}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-sm">Pesan Siswa:</label>
                                <p className="whitespace-pre-wrap break-all text-sm">{selectedRequest.studentMessage || '-'}</p>
                            </div>
                            {selectedRequest.tempSize && (
                                <div>
                                    <label className="font-semibold text-sm">Ukuran File:</label>
                                    <p>{selectedRequest.tempSize}</p>
                                </div>
                            )}
                            <div>
                                <label className="font-semibold text-sm">Waktu:</label>
                                <p>{formatDate(selectedRequest.date)}</p>
                            </div>
                        </div>
                    )}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Tutup</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>
    );
}