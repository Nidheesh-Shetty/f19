"use client";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import InteractiveBackground from "../components/InteractiveBackground";
    

export default function Home() {
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


    const growthStages = [
        'seed.png',
        'sprout.png',
        'sapling.png'
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

    const addPoints = (amount) => {
        setPoints(prev => prev + amount);
    };

    const [open, setOpen] = useState(true);


    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current || !contentRef.current) return;

        if (open) {
            // OPEN — expand to full size
            anime({
                targets: cardRef.current,
                width: "256px",
                duration: 350,
                easing: "easeOutExpo"
            });

            anime({
                targets: contentRef.current,
                translateX: 0,
                opacity: 1,
                duration: 300,
                easing: "easeOutExpo",
                delay: 50
            });
        } else {
            // CLOSE — squish to the left
            anime({
                targets: cardRef.current,
                width: "50px",
                duration: 350,
                easing: "easeInOutQuad"
            });

            anime({
                targets: contentRef.current,
                translateX: -40,   // moves slightly left for squish feel
                opacity: 0,
                duration: 250,
                easing: "easeInQuad"
            });
        }
    }, [open]);




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="min-h-screen bg-gradient-to-bl from-indigo-50 to-emerald-100 text-gray-900 p-6">
            <InteractiveBackground />
            <main className="relative z-10">

                {/* Navigation */}

                <div className="flex items-center justify-between max-w-4xl mx-auto">

                    {/* Logo */}
                    <img src="/images/logo.png" alt="logo" className="w-32 h-45" />

                        {/* pages */}
                        <Nav />
                </div>


                <main className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">

                        {/* Display stats card */}
                        <div className="flex items-start">


                            {/* CARD SHELL — WIDTH IS ANIMATED */}
                            <div
                                ref={cardRef}
                                className="bg-amber-100 drop-shadow-lg rounded-lg px-4 py-6 ml-3 overflow-hidden"
                                style={{ width: "256px" }} // starting width

                            >
                                {/* MINI-BAR (Shown when losed) */}
                                {!open && (
                                    <button
                                        onClick={() => setOpen(true)}
                                        className="flex flex-col items-center justify-center bg-amber-100 text-black space-y-2"
                                    >
                                        <span>👤</span>
                                        <span className="text-xs">✨</span>
                                        <span className="text-xs">💰</span>
                                    </button>
                                )}

                                {/* CONTENT — fades/moves but doesn't scale */}
                                <div ref={contentRef} className="opacity-100">
                                    {open && (
                                        <div className={` flex items-start justify-between w-full ${open ? "opacity-100 scale-100" : "opacity-0 scale-0"} `}>
                                            <div>
                                                <div className="mb-2">👤Username: <strong>JoeRedd</strong></div>
                                                <div className="mb-2">Experience: <strong>0 XP</strong></div>
                                                <div className="mb-2">ECOins: <strong>{points}</strong></div>

                                                <button
                                                    onClick={resetPoints}
                                                    className="mt-3 bg-red-400 text-white px-3 py-1 rounded hover:bg-red-700"
                                                >
                                                    Reset Points
                                                </button>
                                            </div>

                                            {/* CLOSE BUTTON */}
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="text-xl font-bold px-2 py-1 rounded hover:bg-red-200 transition"
                                            >
                                                ||
                                                <br />||<br />||<br />||<br />||
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* display tree */}
                        <div className="ml-auto mr-30">
                            <Image
                                src={`/images/${getTreeStage(points)}`}
                                width={150}
                                height={150}
                                alt="Virtual Tree"
                            />
                        </div>
                    </div>

                    {/* Display Daily Goals */}
                    <div className="bg-slate-200 p-5 rounded-2xl">
                        <h1 className="font-bold">daily Goals:</h1>
                        <ul className="list-disc pl-5 bg-gray-300 p-2 rounded-2xl">
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
                    </div>

                    {/* Display Daily quest */}
                    <div className="actions flex flex-col gap-2 mt-4 items-center ">
                        <h1 className="font-bold">Daily quest</h1>
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


                </main>
            </main>
        </div>
    );
}

