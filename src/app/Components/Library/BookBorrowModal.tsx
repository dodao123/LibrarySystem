'use client';

import React, { useState } from 'react';
import { X, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BookBorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: number;
    title: string;
    author: string;
    quantity: number;
    imageURL?: string;
  };
}

export default function BookBorrowModal({ isOpen, onClose, book }: BookBorrowModalProps) {
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleBorrow = async () => {
    if (!user) {
      setMessage('Vui lòng đăng nhập để mượn sách');
      return;
    }

    if (!borrowDate || !returnDate) {
      setMessage('Vui lòng chọn ngày mượn và ngày trả');
      return;
    }

    if (new Date(returnDate) <= new Date(borrowDate)) {
      setMessage('Ngày trả phải sau ngày mượn');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          userId: user.id,
          borrowDate,
          returnDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Mượn sách thành công!');
        setTimeout(() => {
          onClose();
          setMessage('');
        }, 2000);
      } else {
        setMessage(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Borrow error:', error);
      setMessage('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Mượn Sách</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Book Info */}
        <div className="flex gap-4 mb-6">
          <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center">
            {book.imageURL ? (
              <img 
                src={book.imageURL} 
                alt={book.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <BookOpen className="text-gray-400" size={32} />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{book.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            <p className="text-sm text-green-600">Có sẵn: {book.quantity} bản</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày mượn
            </label>
            <div className="relative">
              <input
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày trả dự kiến
            </label>
            <div className="relative">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={borrowDate || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-3 rounded text-sm ${
            message.includes('thành công') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleBorrow}
            disabled={isLoading || book.quantity <= 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Đang xử lý...' : 'Mượn sách'}
          </button>
        </div>
      </div>
    </div>
  );
}
