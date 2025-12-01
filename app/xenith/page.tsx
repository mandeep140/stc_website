"use client";
import React, { useState, useEffect } from "react";
import XenithNav from "@/components/XenithNav";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Inter, Poppins } from "next/font/google";
import Confetti from "react-confetti";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
import { AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { toIndianDateString } from "@/lib/formatDate";

interface Event {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  eventDate: string;
  club: string;
  isImportant: boolean;
  expireAt?: string;
  resourcesLink?: string;
  resourcesLabel?: string;
  redirectLink?: string;
  redirectLabel?: string;
  // Internal properties added during processing
  _eventDate?: Date;
  _expireDate?: Date;
  _hasRegistration?: boolean;
  _isRegistrationOpen?: boolean;
  _isRegistrationUpcoming?: boolean;
  _isEventEnded?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEventLive: boolean;
}

interface CountdownProps {
  timeLeft: TimeLeft;
  setTimeLeft: React.Dispatch<React.SetStateAction<TimeLeft>>;
}

const Countdown: React.FC<CountdownProps> = ({ timeLeft, setTimeLeft }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const eventDate = new Date("2025-12-03T00:00:00").getTime();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = eventDate - now;

      if (diff <= 0) {
        setTimeLeft((prev) => ({
          ...prev,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEventLive: true,
        }));

        if (!hasTriggered) {
          setShowConfetti(true);
          setHasTriggered(true);
          // Stop confetti after 8 seconds
          const timer = setTimeout(() => {
            setShowConfetti(false);
          }, 8000);
          return () => clearTimeout(timer);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isEventLive: false,
      });
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [hasTriggered]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
            colors={["#ba9efe", "#d4b3ff", "#6366f1", "#a78bfa", "#8b5cf6"]}
          />
        </div>
      )}

      {!timeLeft.isEventLive && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-[#22143a]/40 to-[#0b1228]/40 border border-white/10 backdrop-blur-sm shadow-[0_0_18px_rgba(167,139,250,0.25)]">
            <svg
              className="w-4 h-4 text-[#e8d8ff] drop-shadow-[0_0_6px_rgba(212,179,255,0.9)]"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeOpacity="0.8"
                strokeWidth="1.8"
              />
              <path
                d="M12 7v6l4 2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray-300">
              Event starts on <b>Dec 3, 2025</b>
            </span>
          </div>
        </div>
      )}

      {!timeLeft.isEventLive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {units.map((u) => (
            <div
              key={u.label}
              className="relative flex items-center justify-center"
            >
              <div className="w-full">
                <div
                  className={`
              rounded-2xl p-5 text-center
              bg-gradient-to-b from-white/5 to-white/2
              border border-white/10 backdrop-blur-sm

              /* constant glow always visible */
              shadow-[0_0_22px_rgba(167,139,250,0.28)]

              /* slightly stronger glow on hover */
              hover:shadow-[0_0_45px_rgba(167,139,250,0.45)]
              hover:border-white/20

              transition-all duration-300 ease-out
            `}
                >
                  <div className="flex items-center justify-center" aria-hidden>
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-2xl animate-pulse-slow"
                        style={{
                          background:
                            "linear-gradient(135deg,#ba9efe33,#6366f120)",
                        }}
                      />
                      <div
                        className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
                        style={{
                          background:
                            "linear-gradient(90deg,#ba9efe 0%, #d4b3ff 40%, #6366f1 100%)",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {String(u.value).padStart(2, "0")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs md:text-sm uppercase tracking-wider text-gray-300">
                    {u.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .animate-pulse-slow {
          animation: pulseSlow 3.6s ease-in-out infinite;
        }
        @keyframes pulseSlow {
          0% {
            transform: scale(1);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
};

const Page = () => {
  const { scrollYProgress } = useScroll();
  const translateY = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventLive: false,
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState<
    Array<{
      width: number;
      height: number;
      top: number;
      left: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    fetchEvents();
    setMounted(true);
    setDots(
      Array.from({ length: 200 }).map(() => ({
        width: Math.random() * 2 + 0.5,
        height: Math.random() * 2 + 0.5,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random(),
      }))
    );
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await fetch("/api/admin/events");
      if (response.ok) {
        const data = await response.json();
        const now = new Date();

        const processedEvents = data.map((event: Event) => {
          const eventDate = new Date(event.eventDate);
          const hasRegistration = !!event.redirectLink;
          const expireDate = event.expireAt
            ? new Date(event.expireAt)
            : eventDate;
          const isRegistrationOpen = hasRegistration && expireDate > now;
          const isRegistrationUpcoming =
            hasRegistration &&
            new Date() < new Date(event.eventDate) &&
            !isRegistrationOpen;
          const isEventEnded = eventDate < now;

          return {
            ...event,
            _eventDate: eventDate,
            _expireDate: expireDate,
            _hasRegistration: hasRegistration,
            _isRegistrationOpen: isRegistrationOpen,
            _isRegistrationUpcoming: isRegistrationUpcoming,
            _isEventEnded: isEventEnded,
          };
        });

        const getEventPriority = (event: any) => {
          if (event._isEventEnded) return 4; // Past events last
          if (!event._hasRegistration) return 3; // Events without registration
          if (event._isRegistrationOpen) return 1; // Registration live
          if (event._isRegistrationUpcoming) return 0; // Registration upcoming
          return 2; // Registration ended but event not completed
        };

        const sortedEvents = processedEvents.sort((a: any, b: any) => {
          const aPriority = getEventPriority(a);
          const bPriority = getEventPriority(b);

          // Different priority levels
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }

          // Same priority level, sort by date
          if (aPriority === 4) {
            // For past events, newest first
            return b._eventDate.getTime() - a._eventDate.getTime();
          }
          // For all other cases, soonest first
          return a._eventDate.getTime() - b._eventDate.getTime();
        });

        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    return toIndianDateString(dateString);
  };

  return (
    <div
      className={`${inter.variable} ${poppins.variable} font-sans overflow-x-hidden`}
    >
      <AnimatePresence mode="wait">
        <React.Fragment key="xenith-layout">
          <XenithNav key="xenith-nav" />
          <section
            style={{
              fontFamily:
                '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            }}
            className="cursor-cursor"
            key="xenith-content"
          >
            {/* Hero Section */}
            <div
              className="w-full h-screen bg-radial from-[#293673] to-[#060717] overflow-hidden relative"
              id="main"
            >
              <div className="absolute inset-0 flex flex-wrap justify-center items-center">
                {mounted &&
                  dots.map((dot, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-full"
                      style={{
                        width: `${dot.width}px`,
                        height: `${dot.height}px`,
                        position: "absolute",
                        top: `${dot.top}%`,
                        left: `${dot.left}%`,
                        opacity: dot.opacity,
                      }}
                    ></div>
                  ))}

                {/* hero section content */}
                <div className="flex flex-col justify-center items-center gap-4 mb-10 md:mb-20 px-4">
                  <span className="pointer-events-none select-none flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0">
                    <img
                      src="/xenith/logo.png"
                      alt=""
                      className="h-24 md:h-32 lg:h-40"
                    />
                    <span className="flex flex-col gap-1 md:gap-2 items-center md:items-start">
                      <img
                        src="/xenith/xenith.png"
                        alt=""
                        className="h-6 md:h-8"
                      />
                      <h2 className="text-white text-xs md:text-sm font-medium tracking-[0.15em] text-center md:text-left uppercase font-mono opacity-90 mt-1 md:mt-2">
                        Where Innovation Touches Infinity
                      </h2>
                      {timeLeft.isEventLive && (
                        <div className="mt-2 md:mt-3 flex items-center justify-center md:justify-start gap-2">
                          <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                            </span>
                            <span className="text-purple-200 text-xs font-medium">
                              XENITH is{" "}
                              <span className="font-bold text-white">LIVE</span>{" "}
                              Now
                            </span>
                          </div>
                        </div>
                      )}
                    </span>
                  </span>
                </div>

                {/* Structures image on bottom */}
                <motion.div
                  style={{ y: translateY, opacity }}
                  className="absolute bottom-0 w-full flex justify-center items-end pointer-events-none select-none"
                >
                  <img
                    src="/xenith/bg-side.png"
                    alt="structure left"
                    className="h-20 md:h-32 lg:h-40 transform scale-x-[-1] opacity-50"
                  />
                  <img
                    src="/xenith/bg-mid.png"
                    alt="structure mid"
                    className="h-24 md:h-40 lg:h-50 opacity-50"
                  />
                  <img
                    src="/xenith/bg-side.png"
                    alt="structure right"
                    className="h-20 md:h-32 lg:h-40 opacity-50"
                  />
                </motion.div>
              </div>
            </div>

            <div
              className="w-full min-h-screen bg-gradient-to-b from-[#0C0F29] via-[#060717] to-[#000000] relative py-16 md:py-20 lg:py-0 flex items-center"
              id="about"
            >
              <div className="absolute inset-0">
                {Array.from({ length: 150 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-full animate-pulse"
                    style={{
                      width: `${Math.random() * 2 + 0.5}px`,
                      height: `${Math.random() * 2 + 0.5}px`,
                      position: "absolute",
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                  ></div>
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/5 via-transparent to-[#293673]/5 pointer-events-none"></div>

              <div className="relative z-10 container mx-auto px-4 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                  {/* Centered Heading */}
                  <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-8 md:w-12 bg-gradient-to-r from-transparent to-[#ba9efe]"></div>
                      <h2 className="flex items-center gap-2 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#ba9efe] via-[#d4b3ff] to-[#ba9efe] bg-clip-text text-transparent whitespace-nowrap">
                        <img
                          src="/xenith/xenith.png"
                          alt="Xenith"
                          className="h-6 md:h-8 lg:h-10 xl:h-12 w-auto object-contain"
                        />
                      </h2>
                      <div className="h-1 w-8 md:w-12 bg-gradient-to-l from-transparent to-[#ba9efe]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
                    {/* Left Content */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                      <div className="relative bg-gradient-to-br from-[#1a1a2e]/60 to-[#0f0f1e]/60 backdrop-blur-xl rounded-2xl border border-[#ba9efe]/20 p-6 md:p-8 lg:p-10 shadow-2xl shadow-[#ba9efe]/10 hover:border-[#ba9efe]/40 transition-all duration-500">
                        <div className="absolute -top-1 -left-1 w-20 h-20 border-t-2 border-l-2 border-[#ba9efe]/60 rounded-tl-2xl"></div>
                        <div className="absolute -bottom-1 -right-1 w-20 h-20 border-b-2 border-r-2 border-[#ba9efe]/60 rounded-br-2xl"></div>

                        <div className="space-y-4 text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                          <p className="hover:text-white transition-colors duration-300">
                            <b>Xenith</b> is the definitive{" "}
                            <span className="text-[#ba9efe] font-semibold">
                              convergence of human potential
                            </span>{" "}
                            and technological frontier. The name itself
                            signifies the Extreme Peak of innovation-the moment
                            where imagination becomes reality and engineering
                            brilliance is unbound.
                          </p>
                          <p className="hover:text-white transition-colors duration-300">
                            This year, the festival is a celebration of creators
                            who defy convention and ideas that transcend human
                            limits. Xenith envisions a revolutionary future
                            shaped by{" "}
                            <span className="text-[#ba9efe] font-semibold">
                              Artificial Intelligence, Quantum Frontiers, and
                              Human-Machine Symbiosis.
                            </span>
                          </p>
                          <p className="hover:text-white transition-colors duration-300">
                            We are exploring a world where innovation isn't
                            merely discovered; it is actively designed. From
                            intelligent systems that learn and adapt, to
                            immersive realities that blur the lines of
                            perception, Xenith stands as the testament to
                            humanity's power to push toward its next great
                            evolution.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center -mt-4 lg:mt-16">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/30 to-[#293673]/30 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#0f0f1e]/80 backdrop-blur-xl rounded-full p-6 md:p-8 border-2 border-[#ba9efe]/30 group-hover:border-[#ba9efe]/60 transition-all duration-500 shadow-2xl shadow-[#ba9efe]/20">
                          <img
                            src="/xenith/logo.png"
                            alt="Xenith Logo"
                            className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ba9efe]/20 animate-spin-slow"></div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ba9efe] rounded-full animate-pulse"></div>
                        <div
                          className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#ba9efe] rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events section */}
            <div
              className="min-h-screen w-full bg-black relative overflow-hidden py-10"
              id="events"
            >
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 200 }).map((_, index) => {
                  const hash = (index * 9301 + 49297) % 233280;
                  const random = (seed: number) => {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                  };

                  const posX = random(hash * 100) * 100;
                  const posY = random(hash * 200) * 100;
                  const size = 0.5 + random(hash * 300) * 2;
                  const opacity = 0.1 + random(hash * 400) * 0.9;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        position: "absolute",
                        top: `${posY}%`,
                        left: `${posX}%`,
                        opacity: opacity,
                        willChange: "transform",
                      }}
                    />
                  );
                })}
              </div>

              <div className="relative z-10 container mx-auto px-4 md:px-12 lg:px-20 pt-4">
                <Countdown timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
                <div className="text-center mb-12 md:mb-16">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-1 w-8 md:w-12 bg-gradient-to-r from-transparent to-[#ba9efe]"></div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#ba9efe] via-[#d4b3ff] to-[#ba9efe] bg-clip-text text-transparent tracking-tight">
                      Featured Events
                    </h2>
                    <div className="h-1 w-8 md:w-12 bg-gradient-to-l from-transparent to-[#ba9efe]"></div>
                  </div>
                  <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
                    Explore the cutting-edge competitions and workshops at
                    Xenith 2025
                  </p>
                </div>

                {/* Events Grid */}
                {loadingEvents ? (
                  <div className="text-center text-white py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ba9efe]"></div>
                    <p className="mt-4 text-gray-400">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center text-gray-400 py-20">
                    <p className="text-xl">No upcoming events at the moment</p>
                    <p className="mt-2">
                      Stay tuned for exciting announcements!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="group relative"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative h-full flex flex-col bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 rounded-xl overflow-hidden border border-[#ba9efe]/20 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/30 hover:scale-[1.02] group/card">
                          <div className="relative h-[58vh] md:h-[65vh] flex-shrink-0 overflow-hidden">
                            {event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="aspect-[4/5] object-cover transition-transform duration-500 group-hover/card:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#ba9efe]/30 to-[#293673]/30 flex items-center justify-center">
                                <Calendar className="w-16 h-16 text-[#ba9efe]/50" />
                              </div>
                            )}
                            <div className="absolute bottom-0 h-2/3 w-full bg-gradient-to-t from-[#000000]/100 via-[#3b2a6a]/90 to-transparent pointer-events-none"></div>

                            {/* Registration Status Badge */}
                            {event.redirectLink && (
                              <div
                                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                  event._isEventEnded
                                    ? "bg-gray-600/90 text-white"
                                    : event._isRegistrationOpen
                                      ? "bg-green-600/90 text-white"
                                      : "bg-amber-600/90 text-white"
                                }`}
                              >
                                {event._isEventEnded
                                  ? "Event Ended"
                                  : event._isRegistrationOpen
                                    ? "Registration Open"
                                    : "Registration Closed"}
                              </div>
                            )}
                            <div className="absolute bottom-0 h-1/2 w-full bg-transparent flex flex-col p-4 md:p-6 pb-10 md:pb-12 border-t border-white/6">
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2 md:mb-3">
                                  <div className="inline-block bg-[#ba9efe]/10 text-[#ba9efe] px-2 md:px-3 py-1 rounded-full text-xs font-semibold border border-[#ba9efe]/30">
                                    {event.club}
                                  </div>
                                  <span className="text-[#ba9efe] text-xs inline-flex items-center bg-[#ba9efe]/10 px-2 py-1 rounded-full border border-[#ba9efe]/30">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    IITP
                                  </span>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover/card:text-[#ba9efe] transition-colors duration-300">
                                  {event.title}
                                </h3>
                                <div className="flex items-center text-gray-400 text-xs md:text-sm mb-3">
                                  <Calendar className="w-3 md:w-4 h-3 md:h-4 mr-2" />
                                  {formatEventDate(event.eventDate)}
                                </div>

                                {/* Preview */}
                                {/* <p className="text-gray-400 text-xs md:text-sm transition-all duration-300 whitespace-pre-wrap">
                                {event.content}
                              </p> */}
                              </div>

                              {/* Action Buttons - Always visible on desktop */}
                              {(event.redirectLink || event.resourcesLink) && (
                                <div
                                  className={`hidden md:flex ${event.redirectLink && event.resourcesLink ? "flex-row" : "flex-col"} gap-2 mt-4 pt-3 border-t border-white/10`}
                                >
                                  {event.redirectLink && (
                                    <a
                                      href={
                                        event._isRegistrationOpen
                                          ? event.redirectLink
                                          : "#"
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                        event._isRegistrationOpen
                                          ? "bg-gradient-to-r from-[#ba9efe] to-[#7a5cff] text-white hover:shadow-lg hover:shadow-[#7a5cff]/30"
                                          : "bg-gray-700/80 text-gray-400 cursor-not-allowed"
                                      }`}
                                      onClick={(e) =>
                                        !event._isRegistrationOpen &&
                                        e.preventDefault()
                                      }
                                    >
                                      {event._isRegistrationOpen
                                        ? event.redirectLabel || "Register Now"
                                        : "Registration Closed"}
                                      {event._isRegistrationOpen && (
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                          />
                                        </svg>
                                      )}
                                    </a>
                                  )}
                                  {event.resourcesLink && (
                                    <a
                                      href={event.resourcesLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex flex-1 items-center justify-center gap-2 bg-white/5 text-white border border-[#ba9efe]/30 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/10 transition-all duration-200 hover:border-[#ba9efe]/60"
                                    >
                                      {event.resourcesLabel || "View Resources"}
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              )}

                              {/* Mobile-only Action Buttons */}
                              {(event.redirectLink || event.resourcesLink) && (
                                <div className="md:hidden flex gap-2 mt-3">
                                  {event.redirectLink && (
                                    <a
                                      href={
                                        event._isRegistrationOpen
                                          ? event.redirectLink
                                          : "#"
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                                        event._isRegistrationOpen
                                          ? "bg-gradient-to-r from-[#ba9efe] to-[#7a5cff] text-white hover:shadow-lg"
                                          : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                                      }`}
                                      onClick={(e) =>
                                        !event._isRegistrationOpen &&
                                        e.preventDefault()
                                      }
                                    >
                                      {event._isRegistrationOpen
                                        ? event.redirectLabel || "Register Now"
                                        : "Registration Closed"}
                                      {event._isRegistrationOpen && (
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                          />
                                        </svg>
                                      )}
                                    </a>
                                  )}
                                  {event.resourcesLink && (
                                    <a
                                      href={event.resourcesLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-[#ba9efe]/30 px-3 py-2 rounded-lg font-semibold text-xs hover:bg-white/20 transition-all duration-200"
                                    >
                                      {event.resourcesLabel || "Resources"}
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sponsors Section */}
            <div
              className="min-h-screen w-full bg-gradient-to-b from-[#000000] to-[#0C0F29] relative overflow-hidden py-20"
              id="sponsors"
            >
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 200 }).map((_, index) => {
                  // Use a simple hash function to generate deterministic values based on index
                  const hash = (index * 9301 + 49297) % 233280;
                  const random = (seed: number) => {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                  };

                  const posX = random(hash * 100) * 100;
                  const posY = random(hash * 200) * 100;
                  const size = 0.5 + random(hash * 300) * 2;
                  const opacity = 0.1 + random(hash * 400) * 0.9;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        position: "absolute",
                        top: `${posY}%`,
                        left: `${posX}%`,
                        opacity: opacity,
                        willChange: "transform",
                      }}
                    />
                  );
                })}
              </div>

              <div className="relative z-10 container mx-auto px-4 md:px-12 lg:px-20">
                <div className="text-center mb-12 md:mb-16 pt-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-1 w-8 md:w-12 bg-gradient-to-r from-transparent to-[#ba9efe]"></div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#ba9efe] via-[#d4b3ff] to-[#ba9efe] bg-clip-text text-transparent tracking-tight">
                      Our Sponsors
                    </h2>
                    <div className="h-1 w-8 md:w-12 bg-gradient-to-l from-transparent to-[#ba9efe]"></div>
                  </div>
                  <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
                    Powered by industry leaders who believe in innovation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                  {/* Red Bull Sponsor Card */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/redbull.png"
                              alt="Red Bull Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Red Bull
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* PW */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/pw.jpg"
                              alt="Apka Ads Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Physics Wallah
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* IC IITP */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/ic-iitp.png"
                              alt="Incubation Center-IITP Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Incubation Center-IITP
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* Adshree Sponsor Card */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/adshree.png"
                              alt="Adshree Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Adshree
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* apka ads */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/apkaads.png"
                              alt="Apka Ads Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Apka Ads
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* futterflow */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/flutterflow.jpg"
                              alt="Flutterflow Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Flutterflow
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* nextute */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/nextute.jpg"
                              alt="Nextute Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Nextute
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* idnetify */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/idnetify.png"
                              alt="Idnetify Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          Idnetify
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          Official Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* AceInt */}
                  <div className="group relative">
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ba9efe]/40 transition-all duration-500 hover:border-[#ba9efe] hover:shadow-2xl hover:shadow-[#ba9efe]/40 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/0 via-[#ba9efe]/0 to-[#ba9efe]/0 group-hover:from-[#ba9efe]/20 group-hover:via-[#ba9efe]/10 group-hover:to-transparent transition-all duration-500"></div>
                      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#ba9efe] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="relative mb-4 md:mb-6">
                          <div className="absolute inset-0 bg-[#ba9efe]/30 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/10 group-hover:border-[#ba9efe]/50 transition-all duration-500 overflow-hidden">
                            <img
                              src="/xenith/sponsor/aceint.png"
                              alt="AceInt Logo"
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ba9efe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Company name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#ba9efe] transition-colors duration-300">
                          AceInt
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base text-center mb-4 group-hover:text-gray-300 transition-colors">
                          AI Sponsor
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-[#ba9efe]/0 group-hover:border-[#ba9efe]/30 group-hover:scale-105 transition-all duration-700"></div>
                    </div>
                  </div>

                  {/* Become a Sponsor Card */}
                  <a
                    href="#contact"
                    className="group relative md:col-span-2 lg:col-span-1 cursor-pointer"
                  >
                    <div className="relative h-[300px] md:h-[350px] bg-gradient-to-br from-[#ba9efe]/20 to-[#293673]/20 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-[#ba9efe] transition-all duration-300 hover:shadow-2xl hover:shadow-[#ba9efe]/50 hover:scale-105 animate-pulse-glow">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9efe]/30 via-[#293673]/30 to-[#ba9efe]/30 group-hover:from-[#ba9efe]/50 group-hover:via-[#293673]/50 group-hover:to-[#ba9efe]/50 transition-all duration-500"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-bold text-center text-white mb-2 group-hover:text-[#ba9efe] transition-colors">
                          Your Brand Here
                        </h3>
                        <p className="text-gray-300 text-xs md:text-sm text-center mb-3 md:mb-4 max-w-[220px] md:max-w-[250px]">
                          Be part of the xenith. Add yourself as a sponsor and
                          empower the next generation of tech leaders.
                        </p>
                        <div className="flex items-center gap-2 text-[#ba9efe] font-semibold text-sm md:text-base transition-all">
                          <span>Become a Sponsor</span>
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-[#ba9efe]"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-[#ba9efe]"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-[#ba9efe]"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-[#ba9efe]"></div>
                    </div>
                  </a>
                </div>

                <div className="text-center mt-12 md:mt-16">
                  <p className="text-gray-400 text-base md:text-lg mb-4 px-4">
                    Join us in shaping the future of technology
                  </p>
                  <a
                    href="#contact"
                    className="inline-block bg-gradient-to-r from-[#ba9efe] to-[#293673] text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-full hover:shadow-lg hover:shadow-[#ba9efe]/50 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                  >
                    Contact Us for Sponsorship
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div
              className="min-h-screen w-full bg-gradient-to-b from-[#0C0F29] to-[#000000] relative overflow-hidden py-20"
              id="contact"
            >
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 200 }).map((_, index) => {
                  // Use a simple hash function to generate deterministic values based on index
                  const hash = (index * 9301 + 49297) % 233280;
                  const random = (seed: number) => {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                  };

                  const posX = random(hash * 100) * 100;
                  const posY = random(hash * 200) * 100;
                  const size = 0.5 + random(hash * 300) * 2;
                  const opacity = 0.1 + random(hash * 400) * 0.9;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        position: "absolute",
                        top: `${posY}%`,
                        left: `${posX}%`,
                        opacity: opacity,
                        willChange: "transform",
                      }}
                    />
                  );
                })}
              </div>

              <div className="relative z-10 container mx-auto px-4 md:px-12 lg:px-20">
                <div className="text-center mb-12 md:mb-16 pt-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-1 w-8 md:w-12 bg-gradient-to-r from-transparent to-[#ba9efe]"></div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#ba9efe] via-[#d4b3ff] to-[#ba9efe] bg-clip-text text-transparent tracking-tight">
                      Get In Touch
                    </h2>
                    <div className="h-1 w-8 md:w-12 bg-gradient-to-l from-transparent to-[#ba9efe]"></div>
                  </div>
                  <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
                    Have questions about sponsorship or participation? We'd love
                    to hear from you!
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#0f0f1e]/80 backdrop-blur-sm rounded-2xl border-2 border-[#ba9efe]/30 p-6 md:p-8 lg:p-12 hover:border-[#ba9efe]/50 transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                          Contact Information
                        </h3>
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex w-2xl items-start gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ba9efe]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-[#ba9efe]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs md:text-sm">
                                Email
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base break-all">
                                stc_iitp@iitp.ac.in
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base break-all">
                                tatva@iitp.ac.in
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base break-all">
                                arthniti@iitp.ac.in
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base break-all">
                                disha@iitp.ac.in
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ba9efe]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-[#ba9efe]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs md:text-sm">
                                Phone
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base">
                                +91-93267-60945
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base">
                                +91-62022-36461
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ba9efe]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-[#ba9efe]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs md:text-sm">
                                Location
                              </p>
                              <p className="text-white font-semibold text-sm md:text-base">
                                IIT Patna, Bihar
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                          Quick Message
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
                          For sponsorship, events or participation inquiries,
                          please reach out via email or phone. We'll get back to
                          you ASAP.
                        </p>
                        <a
                          href="mailto:stc_iitp@iitp.ac.in"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ba9efe] to-[#293673] text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg hover:shadow-lg hover:shadow-[#ba9efe]/50 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                        >
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Send Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </React.Fragment>
      </AnimatePresence>
    </div>
  );
};

export default Page;
