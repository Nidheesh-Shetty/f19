"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import InteractiveBackground from "../components/InteractiveBackground";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DriftingLeaves from "../components/DriftingLeaves";
import ClientOnly from "../components/ClientOnly.jsx";


export default function TrackerPage() {

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
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const confettiRef = useRef(null);
  const [open, setOpen] = useState(true);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  // Single load on mount
  useEffect(() => {
    try {
      const storedDaily = localStorage.getItem("dailyGoals");
      const storedYearly = localStorage.getItem("yearlyGoals");
      const storedPoints = localStorage.getItem("points");
      const storedExperience = localStorage.getItem("experience")
      const savedOpen = localStorage.getItem("cardOpen");

      if (storedDaily) setDailyGoals(JSON.parse(storedDaily));
      if (storedYearly) setYearlyGoals(JSON.parse(storedYearly));
      if (storedPoints) setPoints(JSON.parse(storedPoints));
      if (storedExperience) setExperience(JSON.parse(storedExperience));
      if (savedOpen !== null) setOpen(savedOpen === "true");

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
    { level: 5, exp: 120, title: "Going green!" },
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







  const handleAddDailyGoal = () => {
    const val = dailyInput.trim();
    if (!val) return;
    setDailyGoals(prev => [...prev, val]);
    setDailyInput("");
    addPoints(); // +1 point per added daily goal
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
      image: "/images/Eco_Youth_Community.png"
    },
    {
      name: "Green Innovators SG",
      desc: "Tech-forward organization developing environmental solutions.",
      tags: ["Technology", "Innovation", "Climate"],
      image: "/images/eco2.png"
    },
    {
      name: "Urban Garden Club",
      desc: "Helping Singaporeans grow food sustainably in urban spaces.",
      tags: ["Gardening", "Food", "Nature"],
      image: "/images/eco3.png"
    }
  ];




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
                  <li className="hover:font-bold hover:underline">
                    <Link href="/eco" className="hover:font-bold hover:underline">Eco-Insights</Link>
                  </li>
                  <li className="font-bold text-[#2E5339] text-shadow-2xs">
                    <Link href="#" className="hover:font-bold hover:underline">Explore</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        <main className="mx-auto mt-6 ml-6">
          <div className="flex items-start mb-6">

            {/* Display stats card */}
            <div className="relative flex items-start justify-between pb-10">
              <div
                ref={cardRef}
                className="absolute left-0 top-0 bg-amber-100 drop-shadow-lg rounded-lg px-4 py-6 overflow-hidden transition-all duration-300"
                style={{ width: open ? "80px" : "80px" }}>
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





              {/* Middle Text — stays fixed
                            <span className="ml-[400px] flex items-center">
                                <span className="text-lg font-semibold text-amber-700 flex gap-2">
                                    Plant progress:
                                    <h2 className="text-amber-950">
                                        {treeStage(getTreeStage(points))}
                                    </h2>
                                </span>
                            </span> */}



              {/* Tree Image — stays fixed */}
              {/* <div className="ml-6">
                                <Image
                                    src={`/images/${getTreeStage(points)}`}
                                    width={200}
                                    height={200}
                                    alt="Virtual Tree"
                                />
                            </div> */}


            </div>
            <div className="min-h-screen bg-gradient-to-b from-[#dff1dd]/80 to-[#7ba66a]/30 p-10 mx-auto max-w-4xl rounded-4xl">
              <h1 className="text-4xl font-bold text-[#2E5339] mb-8">
                Explore Eco-Friendly Communities 🌱
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clubs.map((club, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4
                       backdrop-blur-lg bg-white/10 border border-white/20 
                       shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                       hover:scale-[1.02] transition-all duration-300"
                  >
                    <img
                      src={club.image}
                      alt={club.name}
                      className="rounded-xl w-full h-40 object-cover mb-4"
                    />

                    <h2 className="text-xl font-semibold text-[#2E5339] mb-2">
                      {club.name}
                    </h2>

                    <p className="text-sm text-[#2E5339]/80 mb-4">
                      {club.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {club.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs bg-[#7ba66a]/20 text-[#2E5339]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-2 rounded-xl bg-[#2E5339] text-white font-medium hover:bg-[#24452f] transition">
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main >
      </main>
    </div >
  );
}
