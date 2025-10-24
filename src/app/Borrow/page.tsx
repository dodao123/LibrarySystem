'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import ProtectedRoute from '../Components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

interface BorrowRequest {
  request_id: number;
  book_id: number;
  book_title: string;
  book_image: string;
  author_name: string;
  category_name: string;
  request_date: string;
  status: string;
  approver_name?: string;
  approve_date?: string;
}

export default function BorrowPage() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/borrow-requests?userId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
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
        return 'Đang mượn';
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
    if (filter === 'all') return true;
    return request.status === filter;
  });

  return (
    <ProtectedRoute>
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
                Lịch Sử Mượn Sách
              </h1>
              <p className="text-gray-600">Theo dõi các yêu cầu mượn sách của bạn</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'pending', label: 'Chờ duyệt' },
                { key: 'approved', label: 'Đã duyệt' },
                { key: 'borrowed', label: 'Đang mượn' },
                { key: 'returned', label: 'Đã trả' },
                { key: 'rejected', label: 'Từ chối' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
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
                    <p className="text-gray-600">Chưa có yêu cầu mượn sách nào</p>
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
                          <p className="text-sm text-gray-600 mb-3">
                            Thể loại: {request.category_name}
                          </p>

                          {/* Status */}
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(request.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
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
                          </div>

                          {request.approver_name && (
                            <p className="text-sm text-gray-500 mt-1">
                              Được duyệt bởi: {request.approver_name}
                            </p>
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
      </main>
    </ProtectedRoute>
  );
}
