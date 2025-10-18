import { Star } from 'lucide-react';

export default function Features() {
  const books = [
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
  ];

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

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {books.map((book) => (
            <div key={book.id} className="group cursor-pointer">
              {/* Book Cover */}
              <div className={`${book.color} h-64 mb-4 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden`}>
                <div className="w-full h-full bg-gradient-to-br opacity-80 flex items-center justify-center text-white font-bold text-center p-4">
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
            </div>
          ))}
        </div>

        {/* Discover More Button */}
        <div className="flex justify-center">
          <button className="bg-black text-white px-12 py-4 font-semibold uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors">
            Discover More Books
          </button>
        </div>
      </div>
    </section>
  );
}