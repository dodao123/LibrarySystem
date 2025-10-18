"use client";

import React, { useEffect, useState } from "react";
import { Star, Loader } from "lucide-react";
import BooksGrid from "../Components/Library/BooksGrid";
import Image from "next/image";

interface Book {
  id: string | number;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  imageURL: string;
  status?: string;
  category?: string;
  updatedAt?: string;
}

interface ApiComicItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  category: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  updatedAt: string;
  chaptersLatest: unknown;
}

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [customBooks] = useState<Book[]>([
    {
      id: "c1",
      title: "Kỷ Nguyên Bóng Đêm",
      author: "Tác giả: Việt Độ",
      rating: 9.5,
      reviews: 128,
      imageURL: "https://i.imgur.com/4YzZ6YZ.jpeg",
      status: "ongoing",
      category: "Fantasy",
    },
    {
      id: "c2",
      title: "Hành Trình Vô Tận",
      author: "Tác giả: An Nhiên",
      rating: 9.2,
      reviews: 95,
      imageURL: "https://i.imgur.com/ybN6EHz.jpeg",
      status: "ongoing",
      category: "Adventure",
    },
    {
      id: "c3",
      title: "Truyền Thuyết Long Thần",
      author: "Tác giả: Thanh Vũ",
      rating: 9.8,
      reviews: 210,
      imageURL: "https://i.imgur.com/6AbNDUh.jpeg",
      status: "completed",
      category: "Fantasy",
    },
  ]);

  const renderStars = (rating: number) => {
    const fullRating = Math.round(rating / 2);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < fullRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Gọi endpoint /home để lấy danh sách truyện
        const res = await fetch("https://otruyenapi.com/v1/api/home");
        
        if (!res.ok) throw new Error("API not responding");
        
        const data = await res.json();

        if (data && data.status === "success" && data.data?.items) {
          // Xử lý dữ liệu từ API response
          const allBooks = data.data.items;
          const cdnImageUrl = data.data.APP_DOMAIN_CDN_IMAGE || "https://img.otruyenapi.com";

          const list = allBooks.slice(0, 24).map((item: ApiComicItem, index: number) => ({
            id: item._id || index,
            title: item.name || "Không rõ tên",
            author: item.origin_name?.join(", ") || "Đang cập nhật",
            rating: 8.5, // Default rating since not provided in API
            reviews: Math.floor(Math.random() * 200) + 50, // Random reviews since not provided
            imageURL: item.thumb_url ? `${cdnImageUrl}/uploads/comics/${item.thumb_url}` : "",
            status: item.status || "ongoing",
            category: item.category?.[0]?.name || "Action",
            updatedAt: item.updatedAt,
          }));
          
          setBooks(list);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        // Fallback data nếu API lỗi
        setBooks([
          {
            id: 1,
            title: "Thần Dạ Chi Công",
            author: "Lý Hy Đạ",
            rating: 9.1,
            reviews: 150,
            imageURL: "https://img.otruyencc.com/thumb/300x400/2024/12/thien-dia-chi-cong-ly-hy-da-193506.jpg",
            status: "ongoing",
            category: "Action",
          },
          {
            id: 2,
            title: "Thiên Đạo Hữu Khuyết",
            author: "Trương Huyền",
            rating: 9.5,
            reviews: 200,
            imageURL: "https://img.otruyencc.com/thumb/300x400/2024/12/thien-dao-huu-khuyet-truong-huyen-193505.jpg",
            status: "ongoing",
            category: "Action",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  

  return (
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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold  mb-2">
              Thư Viện Truyện
            </h1>
            <p className="text-gray-600">Khám phá hàng nghìn tác phẩm hay nhất</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-3">
                <Loader className="animate-spin text-blue-500" size={40} />
                <p className="text-gray-600">Đang tải truyện...</p>
              </div>
            </div>
          )}

          {/* Books Grid */}
          {!loading && (
            <>
              <BooksGrid books={books} title="Truyện Đề Cử" showViewAll={true} />
              <BooksGrid books={customBooks} title="Truyện Của Bạn" showViewAll={false} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}