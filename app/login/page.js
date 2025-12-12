"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function userLogin(e) {
        e.preventDefault();

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            // example: you can store something in localStorage if needed
            localStorage.setItem("isLoggedIn", "true");
            router.push("/home");
        } else {
            alert(data.message);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 to-red-200">
            <header className="mb-6 bg-white">
                <div className="flex items-center justify-between max-w-4xl mx-auto p-3">
                    <img src="/images/logo.png" className="w-32 h-45" />
                    <Nav />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center">
                <div className="border-none bg-white drop-shadow-lg rounded-lg px-4 py-6 m-2 flex flex-col items-center w-3/4 max-w-lg">
                    <h1 className="text-green-900 text-4xl font-bold mb-3">Login</h1>

                    <form onSubmit={userLogin} className="flex flex-col w-1/2">
                        <label className="text-black">name</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded p-1 text-sm w-full mb-4 text-black"
                            placeholder="Name"
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label className="text-black">password</label>
                        <input
                            type="password"
                            className="border border-gray-300 rounded p-1 text-sm w-full mb-4 text-black"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-lg hover:bg-green-600 w-full px-2 py-1 mt-5 focus:outline-none"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
