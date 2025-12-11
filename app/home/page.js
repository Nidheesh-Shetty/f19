"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const storedPoints = localStorage.getItem('points');
        if (storedPoints) setPoints(parseInt(storedPoints));
    }, []);


    const [points, setPoints] = useState(0);

    // Add points
    const addPoints = (value) => {
        setPoints(prev => {
            const newPoints = prev + value;
            localStorage.setItem('points', newPoints);
            return newPoints;
        })
    };
    const resetPoints = () => {
        setPoints(0); // Reset React state
        localStorage.removeItem('points'); // Clear from localStorage
    };

    const growthStages = [
        'seed.png',
        'sapling.png',
        'small-tree.png'
    ];

    const getTreeStage = (points) => {
        if (points < 50) return growthStages[0];
        if (points < 150) return growthStages[1];
        return growthStages[2];
    };

    const actions = [
        { name: 'Recycle Bottle', points: 5 },
        { name: 'Walk Instead of Drive', points: 10 },
        { name: 'Use Reusable Bag', points: 3 }
    ];

    return (
        <div className="bg-white text-black">
            <header>
                <div className="container p-3  flex items-center justify-between">
                    <img src="/images/logo.png" className="w-32 h-21"></img>
                    <nav>
                        <ul className="flex items-center gap-4 text-black">
                            <li className="font-bold">
                                <a href="#"> Home</a>
                            </li>
                            <li className="hover:font-bold hover:underline">
                                <Link href="/tracker" className="hover:font-bold hover:underline">Tracker</Link>
                            </li>
                            <li className="hover:font-bold hover:underline">
                                <Link href="/eco" className="hover:font-bold hover:underline">Eco-Insights</Link>
                            </li>
                            <li className="hover:font-bold hover:underline">
                                <Link href="/profile" className="hover:font-bold hover:underline">Profile</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

            </header>
            <div className="flex items-center justify-center gap-6">
                {/* Stats box */}
                <div className="border-none bg-amber-200 drop-shadow-lg rounded-lg px-4 py-6 flex flex-col items-start w-64">
                    <div>Username: JoeRedd</div>
                    <div>Experience: 0 XP</div>
                    <div>Points: {points}</div>
                </div>

                {/* Tree image */}
                <Image
                    src={`/images/${getTreeStage(points)}`}
                    width={150}
                    height={150}
                    alt="Virtual Tree"
                />
            </div>


            <div className="mt-4">
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={resetPoints}
                >
                    Reset Points
                </button>
            </div>


            <div className="actions flex flex-col gap-2 mt-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => addPoints(action.points)}
                    >
                        {action.name} (+{action.points})
                    </button>
                ))}
            </div>

            <main>
                <section
                    id="hero"
                    className=" relative bg-cover h-screen flex justify-center items-center text-center">
                </section>
            </main>
        </div>
    );
}

