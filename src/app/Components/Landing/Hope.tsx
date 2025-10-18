"use client";

export default function Hope() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* LEFT TEXT BLOCK */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight font-serif">
            WHO WE ARE
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that a library is more than just a place to store books — 
            it’s a space that connects knowledge, ideas, and people. 
            Every reader who walks in contributes to a growing culture of 
            curiosity and lifelong learning.
          </p>

          {/* Divider with green accent */}
          <div className="flex items-center justify-start gap-3">
            <div className="h-[1px] bg-emerald-500 w-12"></div>
            <div className="w-2 h-2 ed-full bg-emerald-500"></div>
            <div className="h-[1px] bg-emerald-500 w-12"></div>
          </div>

          <p className="text-gray-500 leading-relaxed">
            Our mission is to inspire, educate, and empower the community through 
            the joy of reading and the exploration of ideas. We believe knowledge 
            shared is knowledge multiplied.
          </p>

          {/* Two feature blocks */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col items-start gap-2">
              <div className="w-10 h-10 flex items-center justify-center ed-full border border-emerald-500 text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M12 12v8m0 0l3.5-3.5M12 20l-3.5-3.5"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg uppercase">
                Full Service
              </h3>
              <p className="text-gray-500 text-sm">
                From eBooks to community events, we provide full access to 
                learning resources for all ages.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2">
              <div className="w-10 h-10 flex items-center justify-center ed-full border border-emerald-500 text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg uppercase">
                Reputation
              </h3>
              <p className="text-gray-500 text-sm">
                Known for trust and excellence, we build relationships 
                through knowledge and innovation.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE BLOCK */}
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1667312939934-60fc3bfa4ec0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
            alt="Modern Library Interior"
            className="w-full md:h-[500px] ed-lg shadow-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
