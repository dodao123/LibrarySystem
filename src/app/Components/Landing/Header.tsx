"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBook, FaFileAlt, FaBlog, FaInfoCircle, FaEnvelope, FaGlobe, FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";

const menuItems = [
  { label: "Home", icon: FaHome, href: "/" },
  { label: "Library", icon: FaBook, href: "/Library" },
  { label: "Pages", icon: FaFileAlt, href: "#" },
  { label: "Blogs", icon: FaBlog, href: "#" },
  { label: "About", icon: FaInfoCircle, href: "#" },
  { label: "Contact", icon: FaEnvelope, href: "#" },
];

export default function Header() {
  const pathname = usePathname();

  // 🟢 Ẩn Header ở trang /Auth
  if (pathname === "/Auth") return null;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
  className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
    scrolled
      ? "bg-gradient-to-r from-sky-600/5 via-orange-400/5 to-sky-400/5 backdrop-blur-md shadow-2xl"
      : "bg-transparent"
  }`}
>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.png"
            alt="logo"
            width={52}
            height={52}
            className="rounded-full shadow-lg shadow-blue-400 border border-white
              brightness-125 hover:brightness-200 hover:scale-110 hover:drop-shadow-md 
              transition-all duration-300"
          />
          <span
            className={`text-xl font-bold tracking-wide ${scrolled ? "text-white drop-shadow-lg" : "text-white"}`}
            style={{ fontFamily: "'Playfair Display', sans-serif" }}
          >
            MeensLIB
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-2">
          {menuItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className={`group flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all duration-200
                ${scrolled ? "text-white hover:bg-white/20" : "text-white hover:bg-sky-100"} 
              `}
            >
              <Icon size={18} className={`transition-all ${scrolled ? "text-orange-200" : "text-sky-500"}`} />
              <span
                className="relative after:block after:absolute after:left-0 after:w-0 after:h-[2px] 
                            after:bg-gradient-to-r after:from-orange-400 after:to-sky-500 
                            after:transition-all group-hover:after:w-full after:bottom-0"
                style={{ fontFamily: "'Playfair Display', sans-serif" }}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Social */}
          <div className="hidden lg:flex items-center gap-1 ml-2">
  <a href="#" title="Facebook" className="p-1">
    <FaFacebookF className="text-yellow-400" />
  </a>
  <a href="#" title="LinkedIn" className="p-1">
    <FaLinkedinIn className="text-yellow-500" />
  </a>
  <a href="#" title="GitHub" className="p-1">
    <FaGithub className="text-yellow-600" />
  </a>
</div>

          {/* CTA */}
          <Link href="/Auth" className="bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 text-gray-800 px-6 py-2 rounded-full font-semibold shadow hover:scale-105 hover:from-orange-400 hover:to-sky-400 transition-all">
            Đăng Nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
