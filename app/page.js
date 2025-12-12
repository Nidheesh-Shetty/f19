"use client";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative bg-fixed bg-cover bg-center text-gray-900"
         style={{ backgroundImage: "url('/images/backdrop.jpeg')" }}>
      
      {/* Decorative drifting leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute w-8 h-8 bg-[url('/images/leaf.png')] bg-contain bg-no-repeat opacity-80 animate-[float_10s_linear_infinite]" style={{ left: "10%", top: "-5%" }}></div>
        <div className="absolute w-8 h-8 bg-[url('/images/leaf.png')] bg-contain bg-no-repeat opacity-80 animate-[float_12s_linear_infinite]" style={{ left: "70%", top: "-10%" }}></div>
      </div>

      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo */}
        <Image src="/images/logo.png" alt="Logo" width={150} height={150} />

        {/* Hero Title */}
        <h1 className="mt-6 text-5xl font-extrabold text-white drop-shadow-lg">
          Welcome to Eco Tracker 🌱
        </h1>
        <p className="mt-4 text-lg text-white/80 max-w-xl drop-shadow-md">
          Track your eco-friendly actions, earn rewards, and grow your virtual plant.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-white text-green-800 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Register
          </a>
        </div>

        
      </main>

      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
