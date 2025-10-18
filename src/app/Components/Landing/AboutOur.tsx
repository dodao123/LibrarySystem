"use client";

export default function AboutOur() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-4 font-montserrat">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-2/5 text-center md:text-left pr-8 ml-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-gray-800 tracking-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
          >
            Digital Library Management
          </h2>
        </div>
        <div className="md:w-3/5 pl-7 mt-6 md:mt-0 border-l-2 border-emerald-100">
          <p className="text-gray-700 text-xl font-normal leading-relaxed"style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            The Future of Library Management – Simple, Efficient, Community-Connected  
Growing with You, Accompanying the Digital Library  
Books, Data, Knowledge All at Your Fingertips
          </p>
        </div>
      </div>
      <div className="mt-12">
        <div className="relative flex overflow-hidden shadow-xl">
          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1100&q=80"
               alt="Library Banner"
               className="w-2/3 h-52 object-cover brightness-95" />
          <div className="w-1/3 flex items-center justify-center bg-gradient-to-tr from-emerald-400 via-emerald-500 to-green-400 text-white font-bold text-2xl"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}>
                <div className="ml-5">Kho tri thức số – Tiết kiệm tối đa, phục vụ tối đa
                </div></div>
        </div>
      </div>
    </section>
  );
}
