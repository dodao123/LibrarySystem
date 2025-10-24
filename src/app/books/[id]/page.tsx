"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Calendar, User, Tag, ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Book {
  id: number;
  title: string;
  isbn: string;
  category_name: string;
  author_name: string;
  publisher: string;
  publish_year: number;
  quantity: number;
  description: string;
  image_url: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setBook(data.book);
        } else {
          console.error('Error fetching book:', data.error);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  const handleBorrowClick = async () => {
    if (!user) {
      router.push('/Auth');
      return;
    }

    if (!book) return;

    try {
      const response = await fetch('/api/borrow-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Yêu cầu mượn sách đã được gửi thành công!');
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Borrow error:', error);
      alert('Lỗi kết nối, vui lòng thử lại');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sách</h1>
          <button
            onClick={() => router.back()}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-sky-100">
      <div className="max-w-6xl mx-auto p-30">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full max-w-sm h-auto rounded-xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/300x450?text=No+Image";
                  }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Star className="text-yellow-500" size={20} />
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <User size={18} />
                  <span className="font-medium">{book.author_name}</span>
                </div>
              </div>

              {/* Book Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag className="text-sky-500" size={18} />
                  <span className="text-gray-700">
                    <strong>Thể loại:</strong> {book.category_name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-orange-500" size={18} />
                  <span className="text-gray-700">
                    <strong>Năm xuất bản:</strong> {book.publish_year}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="text-green-500" size={18} />
                  <span className="text-gray-700">
                    <strong>Nhà xuất bản:</strong> {book.publisher}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-700">
                    <strong>ISBN:</strong> {book.isbn}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-700">
                    <strong>Số lượng có sẵn:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                      book.quantity > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.quantity} cuốn
                    </span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">{book.description}</p>
              </div>

              {/* Borrow Button */}
              <div className="pt-6">
                <button
                  onClick={handleBorrowClick}
                  disabled={book.quantity === 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    book.quantity > 0
                      ? 'bg-gradient-to-r from-sky-500 to-orange-500 text-white hover:from-sky-600 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <BookOpen size={24} />
                  {book.quantity > 0 ? 'Mượn sách' : 'Hết sách'}
                </button>
                
                {!user && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Vui lòng đăng nhập để mượn sách
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
