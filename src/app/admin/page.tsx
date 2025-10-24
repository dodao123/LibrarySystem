'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, XCircle, Calendar, Search, Filter } from 'lucide-react';
import ProtectedRoute from '../Components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

interface BorrowRequest {
  request_id: number;
  user_id: number;
  book_id: number;
  book_title: string;
  book_image: string;
  author_name: string;
  category_name: string;
  user_name: string;
  user_email: string;
  request_date: string;
  status: string;
  approver_name?: string;
  approve_date?: string;
  record_id?: number;
  borrow_date?: string;
  due_date?: string;
  return_date?: string;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Fetch both requests and records
      const [requestsResponse, recordsResponse] = await Promise.all([
        fetch('/api/borrow-requests'),
        fetch('/api/borrow-records')
      ]);
      
      const [requestsData, recordsData] = await Promise.all([
        requestsResponse.json(),
        recordsResponse.json()
      ]);
      
      if (requestsData.success && recordsData.success) {
        // Merge requests with their corresponding records
        const mergedRequests = requestsData.requests.map((request: any) => {
          const record = recordsData.records.find((r: any) => r.request_id === request.request_id);
          return {
            ...request,
            record_id: record?.record_id,
            borrow_date: record?.borrow_date,
            due_date: record?.due_date,
            return_date: record?.return_date
          };
        });
        
        setRequests(mergedRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number, status: string) => {
    try {
      const response = await fetch(`/api/borrow-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          approvedBy: user?.id,
          dueDate: status === 'approved' ? dueDate : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        setSelectedRequest(null);
        fetchRequests(); // Refresh the list
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleReturn = async (recordId: number) => {
    if (!confirm('Xác nhận trả sách này?')) return;

    try {
      const response = await fetch(`/api/borrow-records/${recordId}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Xác nhận trả sách thành công!');
        fetchRequests(); // Refresh the list
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      case 'borrowed':
        return <BookOpen className="text-blue-500" size={20} />;
      case 'returned':
        return <CheckCircle className="text-gray-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'borrowed':
        return 'Đã mượn';
      case 'returned':
        return 'Đã trả';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = searchTerm === '' || 
      request.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <main className="min-h-screen w-full overflow-x-hidden">
        {/* Gradient Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-blue-200 to-purple-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
        </div>

        <div className="relative pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Quản Lý Mượn Sách
              </h1>
              <p className="text-gray-600">Duyệt và quản lý các yêu cầu mượn sách</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sách, người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Filter by status"
                  aria-label="Filter by status"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="borrowed">Đang mượn</option>
                  <option value="returned">Đã trả</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-gray-600">Đang tải...</div>
              </div>
            )}

            {/* Requests List */}
            {!loading && (
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Không có yêu cầu mượn sách nào</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request.request_id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Book Image */}
                        <div className="w-20 h-28 bg-gray-200 rounded flex-shrink-0">
                          {request.book_image ? (
                            <img
                              src={request.book_image}
                              alt={request.book_title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="text-gray-400" size={32} />
                            </div>
                          )}
                        </div>

                        {/* Book Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {request.book_title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            Tác giả: {request.author_name}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Thể loại: {request.category_name}
                          </p>

                          {/* User Info */}
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm font-medium text-gray-900">
                              Người mượn: {request.user_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Email: {request.user_email}
                            </p>
                          </div>

                          {/* Status */}
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(request.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="flex flex-col gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>Yêu cầu: {new Date(request.request_date).toLocaleDateString('vi-VN')}</span>
                            </div>
                            {request.approve_date && (
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Duyệt: {new Date(request.approve_date).toLocaleDateString('vi-VN')}</span>
                              </div>
                            )}
                            {request.borrow_date && (
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Mượn: {new Date(request.borrow_date).toLocaleDateString('vi-VN')}</span>
                              </div>
                            )}
                            {request.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Hạn trả: {new Date(request.due_date).toLocaleDateString('vi-VN')}</span>
                              </div>
                            )}
                            {request.return_date && (
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Trả: {new Date(request.return_date).toLocaleDateString('vi-VN')}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {request.status === 'pending' && (
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowModal(true);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleApprove(request.request_id, 'rejected')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Từ chối
                              </button>
                            </div>
                          )}

                          {request.status === 'borrowed' && request.record_id && (
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleReturn(request.record_id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Xác nhận đã trả
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Approval Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">Duyệt yêu cầu mượn sách</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Sách: {selectedRequest.book_title}</p>
                <p className="text-sm text-gray-600 mb-4">Người mượn: {selectedRequest.user_name}</p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn trả sách
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Due date for book return"
                  aria-label="Due date for book return"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.request_id, 'approved')}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Duyệt
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
