"use client";

export default function Highlights() {
  const highlights = [
    {
      icon: (
        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 16h6M9 8h6M16 8h2M16 12h2M16 16h2M4 20h16a2 2 0 002-2v-8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "EBOOKS",
      description: "An electronic version of a printed book that can be read on a computer.",
    },
    {
      icon: (
        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6h6v13M12 10v4" />
        </svg>
      ),
      title: "AUDIOBOOKS",
      description: "An audio version of a book, typically a novel, that you can listen to.",
    },
    {
      icon: (
        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h8M8 12h8M8 16h4" />
        </svg>
      ),
      title: "MAGAZINE",
      description: "A periodical publication containing articles and illustrations.",
    },
    {
      icon: (
        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4h10v12M5 20h14" />
        </svg>
      ),
      title: "TEENS & KIDS",
      description: "Books and stories suitable for teens and kids to learn and enjoy.",
    },
  ];

  return (
    <section
      className="relative py-24 px-6 text-center text-black overflow-hidden"
      
    >
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,140,0,0.15),transparent_70%)]"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2
          className="text-5xl md:text-6xl mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            textShadow: "0 4px 15px rgba(0,0,0,0.8)",
          }}
        >
          Welcome To The{" "}
          <span
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              color: "black",
              letterSpacing: "2px",
              fontWeight: 600,
            }}
          >
            MEENS LIBRARY
          </span>
        </h2>

        <p
          className="text-black mb-16 text-lg"
          style={{
            fontFamily: "'Playfair Display', sans-serif",
          }}
        >
          Welcome to the Most Popular Library Today
        </p>

        {/* Các box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {highlights.map(({ icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-orange-400/20"
            >
              <div className="mb-4 flex justify-center">{icon}</div>
              <h3
                className="uppercase mb-2"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "white",
                  letterSpacing: "1px",
                }}
              >
                {title}
              </h3>
              <p
                className="text-black text-sm mb-4"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {description}
              </p>
              <a
                href="#"
                className="text-xs font-semibold text-orange-400 hover:underline"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
