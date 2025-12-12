"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";


export default function TrackerPage() {
    const [dailyGoals, setDailyGoals] = useState([]);
    const [yearlyGoals, setYearlyGoals] = useState([]);
    const [dailyInput, setDailyInput] = useState("");
    const [yearlyInput, setYearlyInput] = useState("");
    const [points, setPoints] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Single load on mount
    useEffect(() => {
        try {
            const storedDaily = localStorage.getItem("dailyGoals");
            const storedYearly = localStorage.getItem("yearlyGoals");
            const storedPoints = localStorage.getItem("points");

            if (storedDaily) setDailyGoals(JSON.parse(storedDaily));
            if (storedYearly) setYearlyGoals(JSON.parse(storedYearly));
            if (storedPoints) setPoints(JSON.parse(storedPoints));

            setLoaded(true); // <-- IMPORTANT
        } catch (err) {
            console.error("LocalStorage load failed:", err);
        }
    }, []);


    // Persist changes
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("dailyGoals", JSON.stringify(dailyGoals));
    }, [dailyGoals, loaded]);

    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("yearlyGoals", JSON.stringify(yearlyGoals));
    }, [yearlyGoals, loaded]);
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("points", JSON.stringify(points));
    }, [points, loaded]);

    const addPoint = () => {
        setPoints(prev => prev + 1);
    };

    const resetPoints = () => {
        setPoints(0);
        try {
            localStorage.removeItem("points");
            console.log("Points reset and removed from localStorage");
        } catch (err) {
            console.error("Error removing points from localStorage:", err);
        }
    };

    const handleAddDailyGoal = () => {
        const val = dailyInput.trim();
        if (!val) return;
        setDailyGoals(prev => [...prev, val]);
        setDailyInput("");
        addPoint(); // +1 point per added daily goal
    };

    const handleRemoveDailyGoal = (index) => {
        setDailyGoals(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddYearlyGoal = () => {
        const val = yearlyInput.trim();
        if (!val) return;
        setYearlyGoals(prev => [...prev, val]);
        setYearlyInput("");
    };

    const handleRemoveYearlyGoal = (index) => {
        setYearlyGoals(prev => prev.filter((_, i) => i !== index));
    };

    const growthStages = ["seed.png", "sprout.png", "sapling.png"];
    const getTreeStage = (pts) => {
        if (pts < 50) return growthStages[0];
        if (pts < 150) return growthStages[1];
        return growthStages[2];
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
        <div className="min-h-screen bg-white text-black p-6">
            {/* Navigation */}
            <header className="mb-6 bg-white rounded-2xl ">
                <div className="flex items-center justify-between max-w-4xl mx-auto">

                    {/* Logo */}
                    <img src="/images/logo.png" alt="logo" className="w-32 h-45" />

                    {/* shared Nav */}
                    <Nav />
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="flex items-center gap-56 mb-6">
                    {/* card */}
                    <div className="bg-amber-100 drop-shadow-lg rounded-lg px-4 py-6 w-64">
                        <div className="mb-2">Username: <strong>JoeRedd</strong></div>
                        <div className="mb-2">Experience: <strong>0 XP</strong></div>
                        <div className="mb-2">Points: <strong>{points}</strong></div>
                        <button
                            onClick={resetPoints}
                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Reset Points
                        </button>
                    </div>

                    {/* display tree */}
                    <div>
                        <Image
                            src={`/images/${getTreeStage(points)}`}
                            width={150}
                            height={150}
                            alt="Virtual Tree"
                        />
                    </div>
                </div>

                {/* Tracker UI */}
                <section className="bg-gray-50 p-5 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-3">Daily Green Goals (+1 pt each)</h2>
                    <div className="flex gap-2 mb-3">
                        <input
                            value={dailyInput}
                            onChange={(e) => setDailyInput(e.target.value)}
                            placeholder="Add a daily goal (e.g. 'Recycle 1 bottle')"
                            className="flex-1 border px-3 py-2 rounded"
                        />
                        <button onClick={handleAddDailyGoal} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
                    </div>

                    <ul className="list-disc pl-5">
                        {dailyGoals.length === 0 && <li className="text-sm text-gray-500">No daily goals yet</li>}
                        {dailyGoals.map((g, i) => (
                            <li key={i} className="flex items-center justify-between gap-4 mb-1">
                                <span>{g}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRemoveDailyGoal(i)} className="text-sm text-red-600">Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="bg-gray-50 p-5 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-3">Yearly Green Goals</h2>
                    <div className="flex gap-2 mb-3">
                        <input
                            value={yearlyInput}
                            onChange={(e) => setYearlyInput(e.target.value)}
                            placeholder="Add a yearly goal (e.g. 'Reduce plastic by 50%')"
                            className="flex-1 border px-3 py-2 rounded"
                        />
                        <button onClick={handleAddYearlyGoal} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                    </div>

                    <ul className="list-disc pl-5">
                        {yearlyGoals.length === 0 && <li className="text-sm text-gray-500">No yearly goals yet</li>}
                        {yearlyGoals.map((g, i) => (
                            <li key={i} className="flex items-center justify-between gap-4 mb-1">
                                <span>{g}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRemoveYearlyGoal(i)} className="text-sm text-red-600">Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="mt-6 text-lg font-semibold">Total Points: {points}</div>
            </main >
        </div >
    );
}
