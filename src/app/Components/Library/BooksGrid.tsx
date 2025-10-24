"use client";

import React, { useState, useRef } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import BookBorrowModal from "./BookBorrowModal";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";

type Book = {
  id: string | number;
  title: string;
  author?: string;
  imageURL: string;
  rating?: number;
  reviews?: number;
  status?: string;
  category?: string;
  updatedAt?: string;
};

export default function BooksGrid({
  books,
  title,
  showViewAll,
}: {
  books: Book[];
  title: string;
  showViewAll: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const booksPerPage = 6;
  const totalPages = Math.ceil(books.length / booksPerPage);

  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth / totalPages;
      container.scrollTo({
        left: scrollWidth * pageIndex,
        behavior: 'smooth'
      });
      setCurrentIndex(pageIndex);
    }
  };

  const scrollNext = () => {
    const nextIndex = (currentIndex + 1) % totalPages;
    scrollToPage(nextIndex);
  };

  const scrollPrev = () => {
    const prevIndex = currentIndex === 0 ? totalPages - 1 : currentIndex - 1;
    scrollToPage(prevIndex);
  };

  const handleBorrowClick = async (book: Book) => {
    if (!user) {
      alert('Vui lòng đăng nhập để mượn sách');
      return;
    }

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

  const renderStars = (rating = 0) => {
    const fullStars = Math.round(rating / 2);
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < fullStars ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          {/* Navigation buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={totalPages <= 1}
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {totalPages}
              </span>
              <button
                onClick={scrollNext}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={totalPages <= 1}
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
          {showViewAll && (
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-shadow">
              Xem tất cả
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-hidden scrollbar-hide"
        >
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="flex gap-6 min-w-full"
            >
                {books
                  .slice(pageIndex * booksPerPage, (pageIndex + 1) * booksPerPage)
                  .map((book) => (
                    <div
                      key={book.id}
                      className="group transform transition-all duration-300 hover:scale-105 flex-shrink-0 w-48"
                    >
                    <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-shadow bg-white">
              <Link href={`/books/${book.id}`}>
                <img
                  src={book.imageURL}
                  alt={book.title}
                  className="w-full h-64 object-cover group-hover:brightness-75 transition-all cursor-pointer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
              </Link>

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            book.status === "ongoing"
                              ? "bg-green-500 text-white"
                              : book.status === "completed"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {book.status === "ongoing"
                            ? "Đang cập nhật"
                            : book.status === "completed"
                            ? "Hoàn thành"
                            : book.status || "Không rõ"}
                        </span>
                      </div>

                      {/* Category Badge */}
                      {book.category && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                            {book.category}
                          </span>
                        </div>
                      )}

                      {/* Overlay with borrow button */}
                      <div className="absolute inset-0 flex items-end justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>
                        <button 
                          onClick={() => handleBorrowClick(book)}
                          className="relative mb-3 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition flex items-center gap-2"
                        >
                          <BookOpen size={16} />
                          Mượn sách
                        </button>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="mt-3">
                      <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 group-hover:text-blue-600 transition">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {book.author}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          {renderStars(book.rating)}
                          <span className="text-xs font-medium text-gray-700">
                            {book.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {book.reviews} đánh giá
                        </span>
                      </div>

                      {/* Ngày cập nhật */}
                      {book.updatedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Cập nhật:{" "}
                          {new Date(book.updatedAt).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Page indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => scrollToPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                title={`Go to page ${index + 1}`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Borrow Modal */}
      {selectedBook && (
        <BookBorrowModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBook(null);
          }}
          book={{
            id: typeof selectedBook.id === 'string' ? parseInt(selectedBook.id) : selectedBook.id,
            title: selectedBook.title,
            author: selectedBook.author || 'Unknown Author',
            quantity: 1, // Default quantity, should be fetched from API
            imageURL: selectedBook.imageURL
          }}
        />
      )}
    </div>
  );
}
