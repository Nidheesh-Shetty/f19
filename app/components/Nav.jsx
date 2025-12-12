"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  // read pathname hook value but only apply it after mount to avoid
  // hydration differences / client-only exceptions.
  const rawPath = usePathname();
  const router = useRouter();
  const [pathname, setPathname] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setPathname(rawPath ?? "");
    } catch (e) {
      setPathname("");
    }
    // read login state and avatar from localStorage
    try {
      const a = localStorage.getItem("avatar");
      setAvatar(a);
      const li = localStorage.getItem("isLoggedIn");
      setLoggedIn(li === "true");
    } catch (e) {
      // ignore
    }
  }, [rawPath]);

  const items = [
    { href: "/home", label: "Home" },
    { href: "/tracker", label: "Tracker" },
    { href: "/eco", label: "Eco-Insights" },
    { href: "/profile", label: "Profile" },
  ];

  function handleSignOut() {
    try {
      localStorage.setItem("isLoggedIn", "false");
    } catch (e) {}
    setLoggedIn(false);
    // navigate to home after sign out
    router.push("/");
  }

  function goToProfile() {
    router.push("/profile");
  }

  return (
    <nav className="bg-emerald-500 rounded-2xl p-2">
      <ul className="flex items-center gap-4 text-gray-900">
        {items.map((it) => {
          const active = pathname && (pathname === it.href || (it.href === "/home" && pathname === "/"));
          return (
            <li key={it.href} className={`${active ? "font-bold" : "hover:font-bold hover:underline"}`}>
              <Link href={it.href} className={active ? "underline" : undefined}>
                {it.label}
              </Link>
            </li>
          );
        })}

        {/* Right side: login/signout + avatar */}
        {!loggedIn ? (
          <li className="hover:font-bold hover:underline">
            <Link href="/login">Login</Link>
          </li>
        ) : (
          <li className="flex items-center gap-3">
            <button onClick={handleSignOut} className="bg-red-400 text-white px-3 py-1 rounded">Sign out</button>
            <button onClick={goToProfile} aria-label="Profile" className="rounded-full overflow-hidden w-8 h-8">
              <img src={avatar ?? "/images/logo.png"} alt="Profile" className="w-8 h-8 object-cover rounded-full" />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
