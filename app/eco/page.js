"use client";

import Link from "next/link";
import Nav from "../components/Nav";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import InteractiveBackground from "../components/InteractiveBackground";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DriftingLeaves from "../components/DriftingLeaves";
import ClientOnly from "../components/ClientOnly.jsx";
import { motion } from "motion/react"

export default function EcoPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null); // {name, latitude, longitude}
    const [data, setData] = useState(null); // {temperature, humidity, uv, time}
    const [cursorImage, setCursorImage] = useState("/images/cursor.png");
    const [dailyGoals, setDailyGoals] = useState([]);
    const [yearlyGoals, setYearlyGoals] = useState([]);
    const [dailyInput, setDailyInput] = useState("");
    const [yearlyInput, setYearlyInput] = useState("");
    const [points, setPoints] = useState(0);
    const [experience, setExperience] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [actions, setActions] = useState([]);
    const [level, setLevel] = useState(1);
    const [levelTitle, setLevelTitle] = useState("Rookie");
    const [milestoneText, setMilestoneText] = useState("");
    const [showMilestone, setShowMilestone] = useState(false);
    const [triggeredMilestones, setTriggeredMilestones] = useState([]);
    const prevLevelRef = useRef(level);
    const textRef = useRef(null);
    const arrowRef = useRef(null);
    const confettiRef = useRef(null);
    const [open, setOpen] = useState(true);
    const cardRef = useRef(null);
    const contentRef = useRef(null);




    {/* How's the weather up there - said the short guy*/ }
    async function geocode(place) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            place
        )}&count=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Geocoding failed");
        const json = await res.json();
        if (!json.results || json.results.length === 0) throw new Error("Location not found");
        const r = json.results[0];
        return { name: r.name + (r.country ? ", " + r.country : ""), latitude: r.latitude, longitude: r.longitude };
    }
    // Fetch weather/uv/humidity from Open-Meteo
    async function fetchWeather(lat, lon) {
        // request current weather + hourly humidity and uv_index so we can pick the matching hour
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,uv_index,temperature_2m&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");
        const json = await res.json();
        const current = json.current_weather || null;
        const hourly = json.hourly || null;
        let temperature = current?.temperature ?? null;
        let time = current?.time ?? null;
        let humidity = null;
        let uv = null;
        if (hourly && time) {
            const idx = hourly.time.indexOf(time);
            if (idx !== -1) {
                humidity = hourly.relativehumidity_2m[idx];
                uv = hourly.uv_index[idx];
                // If temperature wasn't available in current_weather, try hourly
                if (temperature == null && hourly.temperature_2m) temperature = hourly.temperature_2m[idx];
            } else {
                // fallback: take the nearest hour (last entry)
                const last = hourly.time.length - 1;
                humidity = hourly.relativehumidity_2m[last];
                uv = hourly.uv_index[last];
            }
        }

        return { temperature, humidity, uv, time };
    }
    async function searchPlace(place) {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const loc = await geocode(place);
            setLocation(loc);
            const w = await fetchWeather(loc.latitude, loc.longitude);
            setData(w);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    function useMyLocation() {
        setLoading(true);
        setError(null);
        setData(null);
        if (!navigator.geolocation) {
            setError("Geolocation not supported by your browser");
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    // Optional reverse geocoding could be done; for now just show coords
                    setLocation({ name: `Lat ${lat.toFixed(3)}, Lon ${lon.toFixed(3)}`, latitude: lat, longitude: lon });
                    const w = await fetchWeather(lat, lon);
                    setData(w);
                } catch (err) {
                    setError(err.message || String(err));
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(err.message || "Unable to get location");
                setLoading(false);
            }
        );
    }
    // Optionally, load a default location on mount (example: New York)
    useEffect(() => {
        // no-op by default. Uncomment to auto-load a default city.
        // searchPlace('New York');
    }, []);



    {/* local storage - persistence */ }
    useEffect(() => {
        try {
            const storedDaily = localStorage.getItem("dailyGoals");
            const storedYearly = localStorage.getItem("yearlyGoals");
            const storedPoints = localStorage.getItem("points");
            const storedExperience = localStorage.getItem("experience")
            const savedOpen = localStorage.getItem("cardOpen");
            const savedLevel = localStorage.getItem("level");
            const savedTitle = localStorage.getItem("levelTitle");

            if (storedDaily) setDailyGoals(JSON.parse(storedDaily));
            if (storedYearly) setYearlyGoals(JSON.parse(storedYearly));
            if (storedPoints) setPoints(JSON.parse(storedPoints));
            if (storedExperience) setExperience(JSON.parse(storedExperience));
            if (savedOpen !== null) setOpen(savedOpen === "true");
            if (savedLevel) {
                setLevel(parseInt(savedLevel)); prevLevelRef.current = parseInt(savedLevel);
                if (savedTitle) setLevelTitle(savedTitle);
            }
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
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("experience", JSON.stringify(experience));
    }, [experience, loaded]);
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("cardOpen", open);
    }, [open, loaded]);
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("level", level);
    }, [level, loaded]);
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("levelTitle", levelTitle);
    }, [levelTitle, loaded]);




    {/* Point System */ }
    const resetPoints = () => {
        setPoints(0);
        try {
            localStorage.removeItem("points");
            console.log("Points reset and removed from localStorage");
        } catch (err) {
            console.error("Error removing points from localStorage:", err);
        }
    };
    const addPoints = (amount) => {
        setPoints(prev => prev + amount);

        toast(`✨ You earned ${amount} ECOins!`, {
            position: "top-left",
            autoClose: 1500,
            style: {
                background: "#dbf9b8",
                color: "#4a7856",
                border: "1px solid #4a7856",
                fontWeight: "bold",
            }
        })
    };



    {/* Level System */ }
    const levelMilestones = [
        { level: 1, exp: 0, title: "Rookie" },
        { level: 2, exp: 30, title: "Not a Rookie" },
        { level: 3, exp: 50, title: "Eco Explorer" },
        { level: 4, exp: 80, title: "Green Advocate" },
        { level: 5, exp: 120, title: "  " },
        { level: 6, exp: 170, title: "Eco Enthusiast" },
        { level: 7, exp: 230, title: "Planet Protector" },
        { level: 8, exp: 300, title: "Green Guardian" },
        { level: 9, exp: 380, title: "Sustainability Sage" },
        { level: 10, exp: 470, title: "Eco-Apprentice" }
    ];
    useEffect(() => {
        const savedMilestones = localStorage.getItem("triggeredMilestones");
        if (savedMilestones) {
            setTriggeredMilestones(JSON.parse(savedMilestones));
        }
    }, []);
    const grandMilestones = [2, 5, 10]; // Levels that trigger grand animation
    // Single useEffect to handle level updates and milestone animations
    useEffect(() => {
        const current = levelMilestones
            .filter(lvl => experience >= lvl.exp)
            .sort((a, b) => b.level - a.level)[0];
        if (current) {
            // Update level and title
            if (current.level !== level) {
                setLevel(current.level);
                setLevelTitle(current.title);
                // Trigger grand milestone if not already triggered
                if (grandMilestones.includes(current.level) && !triggeredMilestones.includes(current.level)) {
                    setMilestoneText(`🎉 Level ${current.level}: ${current.title}! 🎉`);
                    setShowMilestone(true);
                    setTriggeredMilestones(prev => [...prev, current.level]);
                    // Hide after 2.5 seconds
                    setTimeout(() => setShowMilestone(false), 2500);
                }
            }
        }
        if (grandMilestones.includes(current.level) && !triggeredMilestones.includes(current.level)) {
            setMilestoneText(`🎉 Level ${current.level}: ${current.title}!`);
            setShowMilestone(true);
            const newTriggered = [...triggeredMilestones, current.level];
            setTriggeredMilestones(newTriggered);
            // Save to localStorage
            localStorage.setItem("triggeredMilestones", JSON.stringify(newTriggered));
            setTimeout(() => setShowMilestone(false), 2500);
        }
    }, [experience]);
    // Level progress bar
    const nextLevel = levelMilestones.find(lvl => lvl.level === level + 1);
    const expForNext = nextLevel ? nextLevel.exp : experience;
    const progressPercent = nextLevel
        ? ((experience - levelMilestones[level - 1].exp) / (nextLevel.exp - levelMilestones[level - 1].exp)) * 100
        : 100;
    // Reset function
    const resetLevel = () => {
        setExperience(0);
        setLevel(levelMilestones[0].level);
        setLevelTitle(levelMilestones[0].title);
        setTriggeredMilestones([]);
        setMilestoneText("");
        setShowMilestone(false);
    };
    useEffect(() => {
        const newLevel = levelMilestones
            .slice()
            .reverse()
            .find(milestone => experience >= milestone.exp)?.level || 1;

        if (newLevel > prevLevelRef.current) {
            const milestone = levelMilestones.find(m => m.level === newLevel);
            toast(`🎉 Level Up! You reached Level ${newLevel} - "${milestone.title}"!`, {
                position: "top-left",
                autoClose: 2500,
                style: {
                    background: "#dbf9b8",
                    color: "#4a7856",
                    border: "1px solid #4a7856",
                    fontWeight: "bold",
                },
            });

            prevLevelRef.current = newLevel;
            setLevel(newLevel);
        }
    }, [experience]);




    {/* tree */ }
    const growthStages = [
        'seed.png',
        'sprout.png',
        'sapling.png'
    ];
    const getTreeStage = (points) => {
        if (experience < 50) return growthStages[0];
        if (experience < 150) return growthStages[1];
        return growthStages[2];
    };
    const treeStage = (growthStages) => {
        if (growthStages === 'seed.png') return "Seedling";
        if (growthStages === 'sprout.png') return "Sprout";
        if (growthStages === 'sapling.png') return "Sapling";

    };




    {/* Card */ }
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



    {/* loading and error animation */ }
    useEffect(() => {
        if (loading) {
            const text = document.querySelector("#loadingText");
            if (text) {
                text.innerHTML = text.textContent
                    .split("")
                    .map((char) => `<span class="inline-block">${char}</span>`)
                    .join("");

                anime.timeline({ loop: true })
                    .add({
                        targets: "#loadingText span",
                        translateY: [-10, 0],
                        opacity: [0, 1],
                        easing: "easeOutElastic(1, .8)",
                        delay: anime.stagger(50),
                    })
                    .add({
                        targets: "#loadingText span",
                        opacity: 0,
                        duration: 500,
                        delay: anime.stagger(50),
                    });
            }
        }
    }, [loading]);
    useEffect(() => {
        if (error) {
            anime({
                targets: "#errorText",
                translateX: [-10, 0],
                opacity: [0, 1],
                duration: 800,
                easing: "easeOutExpo",
            });
        }
    }, [error]);







    ////////////////////////////////////////////////////////////// {/* HTML */ }///////////////////////////////////////////////////////////////////




    return (
        <div className="min-h-screen border-black bg-fixed bg-linear-to-bl from-[#4a7856] via-[#94ecbe] to-[#4a7856] text-gray-900 bg-[url('/images/backdrop.jpeg')] bg-cover bg-center">
            <InteractiveBackground />
            <ClientOnly>
                <DriftingLeaves />
            </ClientOnly>

            <main className="relative z-10">


                {/* Navigation */}

                <div className="flex items-center justify-between mx-auto ">


                    {/* Logo */}
          <Link href="/home" className="hover:font-bold hover:underline"><img src="/images/logo.png" alt="logo" className="w-32 h-auto ml-20" /></Link>

                    {/* Welcome, plant status and level */}
                    <div
                        className="
    bg-linear-to-b from-[#dff1dd]/80 to-[#7ba66a]/30
    rounded-4xl p-4
    shadow-[8px_8px_16px_rgba(0,0,0,0.15),_-8px_-8px_20px_rgba(255,255,255,0.5)]
    hover:shadow-[10px_10px_20px_rgba(0,0,0,0.15),_-10px_-10px_20px_rgba(255,255,255,0.6)]
    transition-all duration-300
    w-[500px]
    flex items-center justify-between">
                        {/* Left section */}
                        <div className="flex flex-col ">
                            <h1 className="font-bold text-2xl">Welcome:</h1>
                            <span className="text-xl">{levelTitle}!!</span>
                        </div>

                        {/* Center section */}
                        <div className="flex flex-col text-right">
                            <span className="text-lg font-semibold text-amber-700">
                                Plant progress:
                            </span>
                            <span className="text-amber-950 text-lg">
                                {treeStage(getTreeStage(points))}
                            </span>
                        </div>
                        {/* Right section */}
                        <div className="text-xl font-semibold pr-2">
                            Level: {level}
                        </div>
                    </div>

                    {/* pages */}
                    <div className=" mr-25">
                        <nav className="bg-linear-to-bl from-[#95bf74]/70 from-5% via-[#95bf74]/60 via-50% to-[#4a7856] rounded-4xl p-3 flex items-center justify-center gap-45  shadow-[8px_8px_16px_rgba(0,0,0,0.15),_-8px_-8px_16px_rgba(255,255,255,0.2)]">
                            <div className="lex items-center gap-f4 px-4">
                                <ul className="flex items-center gap-4 text-[#2E5339] text-shadow-black ">
                                    <li className="hover:font-bold hover:underline">
                                        <a href="/home"> Home</a>
                                    </li>
                                    <li className="hover:font-bold hover:underline">
                                        <Link href="/tracker" className="hover:font-bold hover:underline">Tracker</Link>
                                    </li>
                                    <li className="font-bold">
                                        <Link href="#" className="hover:font-bold">Eco-Insights</Link>
                                    </li>
                                    <li className="hover:font-bold hover:underline">
                                        <Link href="/explore" className="hover:font-bold hover:underline">Explore</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Display stats card */}
                <main className="mx-auto mt-6 ml-6">
                    <div className="flex items-start mb-6">
                <div className="relative flex items-start justify-between pb-10">

                    <div
                        ref={cardRef}
                        className="absolute left-0 top-0 bg-amber-100 drop-shadow-lg rounded-lg px-4 py-6 overflow-hidden transition-all duration-300"
                        style={{ width: open ? "80px" : "80px" }} // animate width 
                    >
                        {/* MINI-BAR */}
                        {!open && (
                            <button
                                onClick={() => setOpen(true)}
                                className="flex flex-col items-center justify-center bg-amber-100 text-black space-y-7">
                                <span>👤</span>
                                <br />
                                <span className="text-xs">✨</span>
                                <br />

                                <span className="text-xs">💰</span>
                            </button>
                        )}
                        {/* CONTENT */}
                        <div ref={contentRef} className="opacity-100">
                            {open && (
                                <div className="flex items-start justify-between w-full">
                                    <div>
                                        <div className="mb-2">👤Username: <strong>JoeRedd</strong></div>
                                        <div className="mb-2">Experience: {experience}<strong><div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                        </div></strong></div>
                                        <div className="mb-2">ECOins: <strong>{points}</strong></div>
                                        <button
                                            onClick={resetPoints}
                                            className="mt-3 bg-red-400 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Reset ECoins
                                        </button>
                                        <button
                                            onClick={resetLevel}
                                            className="mt-3 bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            Reset Level & EXP
                                        </button>
                                    </div>
                                    {/* CLOSE BUTTON */}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="text-xl font-bold px-2 py-1 rounded hover:bg-red-200 transition"
                                    >
                                        ||<br />||<br />||<br />||<br />||
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                </div>




                {/* Whether or not, it deepends on whether the weather is weathering - jored :)*/}
                <section className="mx-auto max-w-4xl">
                    <div className="bg-linear-to-bl from-[#95bf74]/70 from-5% via-[#95bf74]/60 via-50% to-[#4a7856] p-5 rounded-2xl shadow-xl">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 border rounded px-3 py-2"
                                placeholder="Enter city or place (e.g. London)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") searchPlace(query);
                                }}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 rounded"
                                onClick={() => searchPlace(query)}
                                disabled={!query || loading}
                            >
                                Search
                            </button>
                            <button className="bg-green-600 text-white px-4 rounded" onClick={useMyLocation} disabled={loading}>
                                Use my location
                            </button>
                        </div>

                    </div>

                    <div className="mb-6">
                        {loading && (
                            <div className="text-base font-bold bg-clip-text bg-gradient-to-bl from-[#95bf74]/70 via-[#95bf74]/60 to-[#4a7856]" id="loadingText">
                                Loading…
                            </div>
                        )}
                        {error && (
                            <div className="text-sm text-red-600 font-bold text-shadow-2xs" id="errorText">
                                Error: {error}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                        <div className="bg-linear-to-bl from-amber-400/40 to-emerald-500/80 rounded-4xl max-w-sm shadow-xl p-4">
                            <div className="text-sm text-[#2E5339] text-shadow-xl font-bold ">Location</div>
                            <div className="text-lg font-medium">{location ? location.name : "—"}</div>
                            {location && <div className="text-xs text-[#2E5339] text-shadow-xl font-bold ">    : {location.latitude.toFixed(3)}, Lon: {location.longitude.toFixed(3)}</div>}
                        </div>

                        <div className="bg-linear-to-bl from-amber-400/40 to-emerald-500/80 rounded-4xl max-w-sm shadow-xl p-4">
                            <div className="text-sm text-[#2E5339] text-shadow-xl font-bold ">Temperature</div>
                            <div className="text-2xl font-semibold">{data?.temperature != null ? `${data.temperature} °C` : "—"}</div>
                        </div>

                        <div className="bg-linear-to-bl from-amber-400/40 to-emerald-500/80 rounded-4xl max-w-sm shadow-xl p-4">
                            <div className="text-sm text-[#2E5339] text-shadow-xl font-bold ">Humidity</div>
                            <div className="text-2xl font-semibold">{data?.humidity != null ? `${data.humidity} %` : "—"}</div>
                        </div>

                        <div className="bg-linear-to-bl from-amber-400/40 to-emerald-500/80 rounded-4xl max-w-sm shadow-xl p-4 md:col-span-2">
                            <div className="text-sm text-[#2E5339] text-shadow-xl font-bold ">UV Index</div>
                            <div className="text-3xl font-bold text-amber-600 text-shadow-2xl">{data?.uv != null ? data.uv : "—"}</div>
                            <div className="text-xs text-[#2E5339] text-shadow-xl font-bold mt-2">Time: {data?.time ?? "—"}</div>
                            <div className="text-sm text-[#2E5339] text-shadow-xl font-bold mt-2">
                                UV index guidance: 0–2 Low, 3–5 Moderate, 6–7 High, 8–10 Very High, 11+ Extreme.
                            </div>
                        </div>

                    </div>
                </section>
                </main>
            </main>
        </div>
    );
}
