import Header from "../Components/Landing/Header";
import Hero from "../Components/Landing/Hero";
import Features from "../Components/Landing/Features";
import Highlights from "../Components/Landing/Highlights";
import AboutOur from "../Components/Landing/AboutOur";
import Hope from "../Components/Landing/Hope";
export default function LandingPage() {
  return (
    <main
  className="min-h-screen font-sans text-slate-800 w-full overflow-x-hidden"
  style={{
    background: "linear-gradient(135deg, #D8EFF7 0%, #9CBBFC 50%, #F9CD6A 100%)"
  }}
>
  <Header />
  <Hero />
  <Highlights />
  <AboutOur />
  <Hope />
  <Features />
</main>

  );
}
