"use client";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import InteractiveBackground from "../components/InteractiveBackground";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DriftingLeaves from "../components/DriftingLeaves";
import ClientOnly from "../components/ClientOnly.jsx";
import { motion } from "motion/react"



export default function Home() {

    {/* your variables */ }
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
    const [completed, setCompleted] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [joinedClubs, setJoinedClubs] = useState([]);
    const [selectedClubIndex, setSelectedClubIndex] = useState(null);
    const prevLevelRef = useRef(level);
    const textRef = useRef(null);
    const arrowRef = useRef(null);
    const confettiRef = useRef(null);
    const [open, setOpen] = useState(true);
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const buttonRefs = useRef([]);
    const [ownedBadges, setOwnedBadges] = useState([]);

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
            const savedBadges = localStorage.getItem("ownedBadges");
            const saved = localStorage.getItem("joinedClubs");


            if (storedDaily) setDailyGoals(JSON.parse(storedDaily));
            if (storedYearly) setYearlyGoals(JSON.parse(storedYearly));
            if (storedPoints) setPoints(JSON.parse(storedPoints));
            if (storedExperience) setExperience(JSON.parse(storedExperience));
            if (savedOpen !== null) setOpen(savedOpen === "true");
            if (savedLevel) {
                setLevel(parseInt(savedLevel)); prevLevelRef.current = parseInt(savedLevel);
                if (savedTitle) setLevelTitle(savedTitle);
            }
            if (savedBadges) setOwnedBadges(JSON.parse(savedBadges));
            if (saved) { setJoinedClubs(JSON.parse(saved)); }
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
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("joinedClubs", JSON.stringify(joinedClubs));
    }, [joinedClubs, loaded]);

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








    {/* Daily Goals */ }
    const handleCompleteDailyGoal = (index) => {
        // Add points and experience for a single goal
        setPoints(prev => prev + 5);
        setExperience(prev => prev + 10);
        // Remove the completed goal
        setDailyGoals(prev => prev.filter((_, i) => i !== index));
    };
    const handleRemoveDailyGoal = (index) => {
        setDailyGoals(prev => prev.filter((_, i) => i !== index));
    };
    const addExperience = (amount) => {
        setExperience(prev => prev + amount);

        toast(`✨ You earned ${amount} experience!`, {
            position: "top-left",
            autoClose: 1500,
            style: {
                background: "#dbf9b8",
                color: "#4a7856",
                border: "1px solid #4a7856",
                fontWeight: "bold",
            }
        });
    };





    {/* yearly Goals */ }
    const handleAddYearlyGoal = () => {
        const val = yearlyInput.trim();
        if (!val) return;
        setYearlyGoals(prev => [...prev, val]);
        setYearlyInput("");
    };
    const handleRemoveYearlyGoal = (index) => {
        setYearlyGoals(prev => prev.filter((_, i) => i !== index));
    };




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



    {/* daily quest */ }
    // DAILY QUEST LIST (30 items)
    const allQuests = [
        { name: "Turn off lights when leaving a room", points: 3 },
        { name: "Unplug unused chargers/devices", points: 4 },
        { name: "Take a shower under 5 minutes", points: 8 },
        { name: "Use a fan instead of aircon for 1 hour", points: 10 },
        { name: "Use daylight instead of room lights", points: 4 },
        { name: "Turn off tap while brushing teeth", points: 3 },
        { name: "Collect and reuse water for plants", points: 6 },
        { name: "Take a cold or lukewarm shower", points: 5 },
        { name: "Refill one bottle instead of new ones", points: 3 },
        { name: "Wash dishes using minimal water", points: 4 },
        { name: "Perform 1 zero-waste action", points: 6 },
        { name: "Use no disposable plastic today", points: 8 },
        { name: "Pick up 3 pieces of litter", points: 5 },
        { name: "Bring your own water bottle", points: 3 },
        { name: "Eat one plant-based meal", points: 7 },
        { name: "Walk instead of taking a short ride", points: 10 },
        { name: "Take public transport instead of car/Grab", points: 7 },
        { name: "Bike or scooter instead of vehicle", points: 8 },
        { name: "Avoid idling a car engine", points: 4 },
        { name: "Reuse a bag/container", points: 3 },
        { name: "Avoid buying anything unnecessary", points: 5 },
        { name: "Repair something instead of throwing away", points: 10 },
        { name: "Set aside 1 item for donation", points: 4 },
        { name: "Recycle an item properly", points: 5 },
        { name: "Water a plant or help nature", points: 3 },
        { name: "Spend 5 minutes outdoors appreciating nature", points: 3 },
        { name: "Learn one eco fact today", points: 2 },
        { name: "Avoid printing anything today", points: 4 },
        { name: "Declutter one small area", points: 5 },
        { name: "Use reusable bag", points: 3 }
    ];
    // Pick 3 random quests from the 30
    const getRandomQuests = () => {
        const shuffled = [...allQuests].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    };
    // Load quests on page load
    useEffect(() => {
        setActions(getRandomQuests());
    }, []);
    // Button to refresh quests
    const refreshQuests = () => {
        setActions(getRandomQuests());
    };
    const handleClick = (index, points) => {
        if (!completed.includes(index)) {
            addPoints(points);
            // Animate the button
            anime({
                targets: buttonRefs.current[index],
                scale: [1, 0.95, 1],
                backgroundColor: "#9CA3AF", // gray-400
                color: "#E5E7EB", // gray-200
                duration: 400,
                easing: "easeOutQuad",
            });

            setCompleted([...completed, index]);
        }
    };

    const handleRefresh = () => {
        refreshQuests();
        setCompleted([]);

        // Reset all button styles
        buttonRefs.current.forEach((btn) => {
            if (btn) {
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.transform = "";
            }
        });
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



    const clubs = [
        {
            name: "Eco Youth Community",
            desc: "A student-driven group focused on cleaning drives and zero-waste events.",
            tags: ["Sustainability", "Youth", "Community"],
            image: "/images/Eco_Youth_Community.png",
            badge: "/images/badge1.png"
        },
        {
            name: "Green Innovators SG",
            desc: "Tech-forward organization developing environmental solutions.",
            tags: ["Technology", "Innovation", "Climate"],
            image: "/images/eco2.png",
            badge: "/images/badge2.png"
        },
        {
            name: "Urban Garden Club",
            desc: "Helping Singaporeans grow food sustainably in urban spaces.",
            tags: ["Gardening", "Food", "Nature"],
            image: "/images/eco3.png",
            badge: "/images/badge3.png"
        }
    ];


    const purchaseBadge = (clubIndex, cost = 10) => {
        // Check if already owned
        const alreadyOwned = ownedBadges.some(b => b.clubIndex === clubIndex);

        if (alreadyOwned) {
            // UNOWN - Remove the badge and refund ECOins
            const refundAmount = cost;
            setPoints(prev => prev + refundAmount);

            const newOwned = ownedBadges.filter(b => b.clubIndex !== clubIndex);
            setOwnedBadges(newOwned);
            localStorage.setItem("ownedBadges", JSON.stringify(newOwned));

            toast.info(`🔄 Badge removed! ${refundAmount} ECOins refunded.`, {
                position: "top-left",
                autoClose: 2000,
                style: {
                    background: "#e0f2fe",
                    color: "#0c4a6e",
                    border: "1px solid #0c4a6e",
                    fontWeight: "bold",
                },
            });
            return;
        }

        // OWN - Purchase the badge
        if (points < cost) {
            toast.error("❌ Not enough ECOins!", {
                position: "top-left",
                autoClose: 2000,
                style: {
                    background: "#f8d7da",
                    color: "#721c24",
                    border: "1px solid #721c24",
                    fontWeight: "bold",
                },
            });
            return;
        }

        // Deduct points
        setPoints(prev => prev - cost);

        // Add badge to owned badges with full info
        const badgeData = {
            badge: clubs[clubIndex].badge,
            clubIndex: clubIndex,
            clubName: clubs[clubIndex].name
        };
        const newOwned = [...ownedBadges, badgeData];
        setOwnedBadges(newOwned);
        localStorage.setItem("ownedBadges", JSON.stringify(newOwned));

        toast.success(`🎉 Badge purchased for ${cost} ECOins!`, {
            position: "top-left",
            autoClose: 2000,
            style: {
                background: "#dbf9b8",
                color: "#4a7856",
                border: "1px solid #4a7856",
                fontWeight: "bold",
            },
        });
    };






    const refreshBadges = () => {
        try {
            const savedBadges = localStorage.getItem("ownedBadges");
            if (savedBadges) {
                const parsed = JSON.parse(savedBadges);
                console.log("Manually refreshed badges:", parsed);
                setOwnedBadges(parsed);
                toast.success("✅ Badges refreshed!", {
                    position: "top-right",
                    autoClose: 1000,
                });
            } else {
                console.log("No badges in localStorage");
                setOwnedBadges([]);
            }
        } catch (err) {
            console.error("Failed to refresh badges:", err);
            toast.error("❌ Failed to load badges");
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Page is now visible - reload badges from localStorage
                try {
                    const savedBadges = localStorage.getItem("ownedBadges");
                    if (savedBadges) {
                        const parsed = JSON.parse(savedBadges);
                        console.log("Reloading badges:", parsed);
                        setOwnedBadges(parsed);
                    }
                } catch (err) {
                    console.error("Failed to reload badges:", err);
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        console.log("Owned Badges:", ownedBadges);
        console.log("Loaded:", loaded);
    }, [ownedBadges, loaded]);
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem("ownedBadges", JSON.stringify(ownedBadges));
    }, [ownedBadges, loaded]);





    ////////////////////////////////////////////////////////////// {/* HTML */ }///////////////////////////////////////////////////////////////////

    return (

        <div className="min-h-screen border-black bg-fixed bg-linear-to-bl from-[#4a7856] via-[#94ecbe] to-[#4a7856] text-gray-900 bg-[url('/images/backdrop.jpeg')] bg-cover bg-center">
            <InteractiveBackground />
            <ClientOnly>
                <DriftingLeaves />
            </ClientOnly>

            <main className="relative z-10">

                {showMilestone && milestoneText && (
                    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                        <h1 className="text-5xl font-extrabold text-black text-center animate-bounce">
                            {milestoneText}
                        </h1>
                    </div>
                )}



                {/* Navigation */}

                <div className="flex items-center justify-between mx-auto ">


                    {/* Logo */}
                    <img src="/images/logo.png" alt="logo" className="w-32 h-auto ml-20 " />


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
                                        <Link href="/explore" className="hover:font-bold hover:underline">Explore</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div >


                <main className="mx-auto mt-6 ml-6">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-start mb-6">



                        {/* Display stats card */}
                        <div className="relative flex items-start pb-10">

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



                            <div className="bg-linear-to-bl from-[#dff1dd]/70 to-[#7ba66a]/50 rounded-4xl p-3 mx-20 ">
                                <div>
                                    <div className="bg-linear-to-bl from-[#95bf74]/70 from-5% via-[#95bf74]/60 via-50% to-[#4a7856] rounded-4xl p-3">
                                        <h2 className="text-xl font-bold text-[#2E5339] mb-3">Joined Clubs</h2>

                                        {joinedClubs.length === 0 ? (
                                            <p className="text-[#2E5339]/70">You haven't joined any clubs yet.</p>
                                        ) : (
                                            joinedClubs.map((index) => (
                                                <div key={index} className="p-3 bg-white/20 rounded-xl mb-2">
                                                    <h3 className="text-lg font-semibold text-[#2E5339]">
                                                        {clubs[index].name}
                                                    </h3>
                                                    <p className="text-sm text-[#2E5339]/80">
                                                        {clubs[index].desc}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="bg-linear-to-bl from-[#95bf74]/70 from-5% via-[#95bf74]/60 via-50% to-[#4a7856] rounded-4xl p-3 mt-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h2 className="text-xl font-bold text-[#2E5339]">Your Badges</h2>
                                            <button
                                                onClick={refreshBadges}
                                                className="text-sm bg-[#2E5339] text-white px-3 py-1 rounded-lg hover:bg-[#24452f] transition"
                                            >
                                                🔄 Refresh
                                            </button>
                                        </div>

                                        {!loaded ? (
                                            <p className="text-[#2E5339]/70">Loading...</p>
                                        ) : ownedBadges.length === 0 ? (
                                            <p className="text-[#2E5339]/70">No badges purchased yet. Visit Explore to buy badges!</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-4">
                                                {ownedBadges.map((item, idx) => (
                                                    <div key={idx} className="text-center">
                                                        <img
                                                            src={item.badge}
                                                            alt={item.clubName || "Badge"}
                                                            className="w-20 h-20 rounded-full object-cover border-2 border-[#2E5339]"
                                                            onError={(e) => {
                                                                console.error("Failed to load badge image:", item.badge);
                                                                e.target.src = "/images/placeholder-badge.png";
                                                            }}
                                                        />
                                                        <p className="text-sm text-[#2E5339] mt-1 font-medium">
                                                            {item.clubName || "Unknown"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>




                            {/* Middle Text — stays fixed */}
                            <span className="flex items-center">
                                <span className="text-lg font-semibold text-amber-700 flex gap-2">
                                    Plant progress:
                                    <h2 className="text-amber-950">
                                        {treeStage(getTreeStage(points))}
                                    </h2>
                                </span>
                            </span>





                            {/* Tree Image — stays fixed */}
                            <div>
                                <Image
                                    src={`/images/${getTreeStage(points)}`}
                                    width={200}
                                    height={200}
                                    alt="Virtual Tree"
                                />
                            </div>
                        </div>

                    </div>



                    <section className="mx-auto max-w-4xl ">

                        {/* Display Daily Goals */}
                        <div className="bg-linear-to-b from-[#dff1dd]/80 to-[#7ba66a]/30 p-5 rounded-2xl shadow-xl mb-5">
                            <h1 className="font-bold mb-2">
                                Daily Goals: <Link href="/tracker" className="hover:font-bold hover:underline">✎</Link>
                            </h1>
                            <ul className="list-disc pl-5 bg-linear-to-tr from-[#dff1dd]/80 to-[#7ba66a]/70 p-2 rounded-2xl">
                                {dailyGoals.length === 0 && (
                                    <li className="text-sm text-gray-500 ">No daily goals yet</li>
                                )}
                                {dailyGoals.map((g, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center justify-between gap-4 mb-3 p-3 bg-indigo-300/40 rounded-2xl shadow-md"
                                    >
                                        <span>{g}</span>
                                        <div className="flex gap-2 items-center justify-center">
                                            <button
                                                onClick={() => {
                                                    handleCompleteDailyGoal(i);
                                                    addExperience(10);
                                                }}
                                                className="text-green-700 text-sm bg-gradient-to-bl from-amber-400/10 to-emerald-500/35 px-2 rounded-2xl shadow"
                                            >
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => handleRemoveDailyGoal(i)}
                                                className="text-sm text-red-600 bg-gradient-to-bl from-amber-400/10 to-emerald-500/35 px-2 rounded-2xl shadow"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Display yearly Goals */}
                        <div className="bg-linear-to-b from-[#dff1dd]/80 to-[#7ba66a]/30 p-5 rounded-2xl shadow-xl">
                            <h1 className="font-bold mb-2">yearly Goals: <Link href="/tracker" className="hover:font-bold hover:underline">✎</Link></h1>
                            <ul className="list-disc pl-5 bg-linear-to-tr from-[#dff1dd]/80 to-[#7ba66a]/70 p-2 rounded-2xl">
                                {yearlyGoals.length === 0 && (
                                    <li className="text-sm text-gray-500">No yearly goals yet</li>
                                )}
                                {yearlyGoals.map((g, i) => (
                                    <li key={i} className="flex items-center justify-between gap-4 mb-1">
                                        <span>{g}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRemoveYearlyGoal(i)}
                                                className="text-sm text-red-600">
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>



                        {/* Display Daily quest */}
                        <div className="p-5">
                            <div className="actions flex flex-col gap-2 mt-4 items-start p-6 bg-linear-to-bl from-amber-400/20 to-emerald-500/60 rounded-4xl max-w-sm shadow-xl">
                                <h1 className="font-bold">Daily quest:</h1>
                                {actions.map((action, index) => (
                                    <button
                                        key={index}
                                        ref={(el) => (buttonRefs.current[index] = el)}
                                        onClick={() => handleClick(index, action.points)}
                                        disabled={completed.includes(index)}
                                        className={`px-4 py-2 rounded-lg w-full transition
              ${completed.includes(index)
                                                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                                                : "bg-green-600 hover:bg-green-700 text-white"}`}
                                    >
                                        {action.name} (+{action.points})
                                    </button>
                                ))}
                                <button
                                    onClick={handleRefresh}
                                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full transition"
                                >
                                    Refresh Quests
                                </button>
                            </div>
                        </div>

                    </section>
                </main>
            </main >
            <ToastContainer />
        </div >
    );
}

