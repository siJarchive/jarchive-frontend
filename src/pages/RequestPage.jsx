import { useEffect, useState } from "react";
import { fetchRequests, approveRequest, rejectRequest } from "@/controller/file.controller";
import { CheckCircle, XCircle, FileText, Upload, AlertCircle, Eye } from "lucide-react";

export default function RequestPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await fetchRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            alert('Gagal memuat data permintaan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleApprove = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menyetujui permintaan ini?')) return;

        try {
            await approveRequest(id);
            alert('Permintaan berhasil disetujui!');
            loadRequests();
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Gagal menyetujui permintaan');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menolak permintaan ini?')) return;

        try {
            await rejectRequest(id);
            alert('Permintaan berhasil ditolak!');
            loadRequests();
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Gagal menolak permintaan');
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
            minute: '2-digit'
        });
    };

    return (
        <div className="py-4 px-2 md:px-0">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">Kelola Permintaan</h1>
                <button 
                    className="btn btn-primary btn-sm w-full md:w-auto"
                    onClick={loadRequests}
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    {/* Mobile: Card View */}
                    <div className="md:hidden space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Tidak ada permintaan
                            </div>
                        ) : (
                            requests.map((request) => (
                                <div key={request._id} className="card bg-base-100 shadow-sm">
                                    <div className="card-body p-4">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(request.type)}
                                                <span className="font-semibold capitalize">{request.type}</span>
                                            </div>
                                            <span className={`badge badge-sm ${getStatusBadge(request.status)}`}>
                                                {request.status}
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
                                            
                                            {request.studentMessage && (
                                                <p className="text-gray-600 text-xs line-clamp-2">
                                                    {request.studentMessage}
                                                </p>
                                            )}

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
                                    <th>Tipe</th>
                                    <th>Nama File</th>
                                    <th>Kategori</th>
                                    <th>Pesan</th>
                                    <th>Tanggal</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            Tidak ada permintaan
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request._id}>
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
                                            <td>
                                                <div className="max-w-xs truncate" title={request.studentMessage}>
                                                    {request.studentMessage || '-'}
                                                </div>
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
                                <p>{selectedRequest.studentMessage || '-'}</p>
                            </div>
                            {selectedRequest.tempSize && (
                                <div>
                                    <label className="font-semibold text-sm">Ukuran File:</label>
                                    <p>{selectedRequest.tempSize}</p>
                                </div>
                            )}
                            <div>
                                <label className="font-semibold text-sm">Tanggal:</label>
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