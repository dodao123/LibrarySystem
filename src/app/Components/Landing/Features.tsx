'use client';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  price?: string;
  color?: string;
  imageURL?: string;
  category?: string;
  quantity?: number;
}

export default function Features() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/books');
        const data = await response.json();
        
        if (data.success) {
          // Transform database books to match the expected format
          const transformedBooks = data.books.map((book: {
            id: number;
            title: string;
            author: string;
            rating: number;
            reviews: number;
            quantity: number;
            imageURL: string;
            category: string;
          }) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            rating: book.rating,
            reviews: book.reviews,
            price: `Có sẵn: ${book.quantity} bản`,
            color: getRandomColor(),
            imageURL: book.imageURL,
            category: book.category,
            quantity: book.quantity
          }));
          setBooks(transformedBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        // Fallback to static data if API fails
        setBooks([
          {
            id: 1,
            title: 'A Doctor in the House',
            author: 'Candy Carson',
            rating: 5,
            reviews: 128,
            price: '$6.50 - $16.99',
            color: 'bg-red-900',
          },
          {
            id: 2,
            title: 'Wildflower',
            author: 'Drew Barrymore',
            rating: 5,
            reviews: 256,
            price: '$10.99 - $20.00',
            color: 'bg-gray-300',
          },
          {
            id: 3,
            title: 'New Galaxy',
            author: 'Richard Mann',
            rating: 5,
            reviews: 189,
            price: '$7.90 - $16.90',
            color: 'bg-blue-900',
          },
          {
            id: 4,
            title: 'The Long Road to the Deep Silence',
            author: 'Richard Mann',
            rating: 3,
            reviews: 95,
            price: '$12.00 - $22.00',
            color: 'bg-slate-400',
          },
          {
            id: 5,
            title: 'Life in the Garden',
            author: 'Candy Carson',
            rating: 4,
            reviews: 142,
            price: '$11.99 - $25.00',
            color: 'bg-gray-900',
          },
          {
            id: 6,
            title: "It's a Really Strange Story",
            author: 'Burt Geller',
            rating: 5,
            reviews: 203,
            price: '$8.00 - $18.00',
            color: 'bg-green-700',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getRandomColor = () => {
    const colors = [
      'bg-red-900', 'bg-gray-300', 'bg-blue-900', 'bg-slate-400', 
      'bg-gray-900', 'bg-green-700', 'bg-purple-600', 'bg-yellow-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-serif text-center text-gray-900 mb-16">
          Discover Your Next Book
        </h1>

        {/* Navigation Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {totalPages}
            </span>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Books Grid */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center">
              <div className="text-gray-600">Đang tải sách...</div>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-hidden scrollbar-hide"
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex gap-8 min-w-full"
                >
                  {books
                    .slice(pageIndex * booksPerPage, (pageIndex + 1) * booksPerPage)
                    .map((book) => (
                      <Link key={book.id} href={`/books/${book.id}`} className="group cursor-pointer flex-shrink-0 w-48">
                        {/* Book Cover */}
                        <div className={`${book.color || 'bg-gray-300'} h-64 mb-4 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden relative`}>
                          {book.imageURL ? (
                            <img 
                              src={book.imageURL} 
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to color background if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full bg-gradient-to-br opacity-80 flex items-center justify-center text-white font-bold text-center p-4 ${book.imageURL ? 'hidden' : ''}`}>
                            <span className="text-sm">{book.title}</span>
                          </div>
                        </div>

                        {/* Book Info */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div>{renderStars(book.rating)}</div>
                            <span className="text-xs text-gray-500">({book.reviews})</span>
                          </div>

                          {/* Price */}
                          <p className="text-sm font-semibold text-red-600">{book.price}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          )}

          {/* Page indicators */}
          {!loading && totalPages > 1 && (
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

        {/* Discover More Button */}
        <div className="flex justify-center">
          <button className="bg-black text-white px-12 py-4 mt-10 font-semibold uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors">
            Discover More Books
          </button>
        </div>
      </div>
    </section>
  );
}