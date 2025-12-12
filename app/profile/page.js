"use client";

import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";

export default function Home() {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    try {
      const a = localStorage.getItem("avatar");
      if (a) setAvatar(a);
    } catch (e) {}
  }, []);

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const data = ev.target.result;
      setPreview(data);
    };
    reader.readAsDataURL(f);
  }

  function saveAvatar() {
    if (!preview) return;
    try {
      localStorage.setItem("avatar", preview);
      setAvatar(preview);
      alert("Profile picture saved.");
    } catch (e) {
      alert("Failed to save profile picture.");
    }
  }

  return (
    <div className="bg-white">
      <header>
        <div className="container p-3  flex items-center justify-between">
          <img src="/images/logo.png" className="w-32 h-21" alt="logo" />
          <Nav />
        </div>
      </header>

      <main>
        <section id="hero" className=" relative bg-cover min-h-[384px] text-white flex justify-center items-center text-center">
          <div className="absolute inset-0 z-0 bg-gray-800/45"></div>

          <div className="container relative z-10 py-8">
            <h1 className="text-4xl font-black uppercase mb-4">Profile</h1>

            <div className="bg-slate-100 p-6 rounded-lg inline-block text-left">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden">
                  <img src={preview ?? avatar ?? "/images/logo.png"} alt="avatar" className="w-28 h-28 object-cover" />
                </div>
                <div>
                  <div className="font-semibold">Username</div>
                  <div className="text-sm text-gray-600">Change your profile picture below</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={onFileChange} />
                <button onClick={saveAvatar} className="bg-blue-600 text-white px-3 py-1 rounded" disabled={!preview}>
                  Save Picture
                </button>
                {preview && (
                  <button onClick={() => setPreview(null)} className="text-sm text-gray-600 underline">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
