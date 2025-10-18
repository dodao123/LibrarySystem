"use client";

import Image from "next/image";
import React from "react";

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
        {showViewAll && (
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-shadow">
            Xem tất cả
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-shadow bg-white">
              <Image
                src={book.imageURL}
                alt={book.title}
                width={300}
                height={400}
                className="w-full h-64 object-cover group-hover:brightness-75 transition-all"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/300x400?text=No+Image";
                }}
              />

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

              {/* Overlay đọc ngay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-end justify-center opacity-0 group-hover:opacity-100">
                <button className="mb-3 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition">
                  Đọc ngay
                </button>
              </div>
            </div>

            {/* Thông tin */}
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
    </div>
  );
}
