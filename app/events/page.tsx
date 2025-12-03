"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Target,
  CalendarCheck,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CompanyCards from "@/components/CompanyCards";
import { useState, useEffect, Fragment } from "react";
import { toIndianDateString } from "@/lib/formatDate";

interface Event {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  eventDate: string;
  club: string;
  organizer: string;
  isImportant: boolean;
  expireAt?: string;
  redirectLink?: string;
  redirectLabel?: string;
  resourcesLink?: string;
  resourcesLabel?: string;
  _eventDate?: Date;
  _expireDate?: Date;
  _isRegistrationOpen?: boolean;
  _isEventEnded?: boolean;
  _hasRegistration?: boolean;
  _isRegistrationUpcoming?: boolean;
}

const hackathonWinners = [
  {
    position: "Winner",
    teamName: "Caffeine Coderz",
    members: [
      "Shubham Raj (Team Leader)",
      "Ayush Kr. Gupta",
      "Nishant Sharma",
      "Arvind Kumar",
      "Harsh Kumar",
    ],
    image: "/images/hackathon-winner.jpg",
    prize: "₹5,000",
    project: "AI-powered helmet system",
  },
  {
    position: "1st Runner Up",
    teamName: "Prachand",
    members: [
      "Ankit Shankar (Team Leader)",
      "Akash Dhibar",
      "Debangsu Das",
      "Smita Raj",
      "Alekhya Chatterjee",
    ],
    image: "/images/hackathon-first-runner.jpg",
    prize: "₹3,000",
    project: "Blockchain-based Student Verification Platform",
  },
  {
    position: "2nd Runner Up",
    teamName: "Tech_X",
    members: [
      "Ali Raza (Team Leader)",
      "Brejbhushan Kumar",
      "Saurav Sharma",
      "Ashmit Kumar",
      "Ankit Kumar",
    ],
    image: "/images/hackathon-second-runner.jpg",
    prize: "₹2,000",
    project: "IoT-enabled Environmental Monitoring System",
  },
];

const internshipCompanies = [
  {
    name: "GUVI",
    category: "EdTech",
    positions: "Frontend/Backend Developer",
    image: "/images/company/guvi.png",
  },
  {
    name: "HCL",
    category: "IT Services",
    positions: "Software Engineer",
    image: "/images/company/hcl.png",
  },
  {
    name: "Superset",
    category: "Analytics",
    positions: "Data Analyst",
    image: "/images/company/superset.png",
  },
  {
    name: "Physics Wallah",
    category: "EdTech",
    positions: "Content Developer",
    image: "/images/company/pw.png",
  },
  {
    name: "Humantics",
    category: "HR Tech",
    positions: "Product Developer",
    image: "/images/company/humantics.png",
  },
  {
    name: "Samriddh",
    category: "Consulting",
    positions: "Business Analyst",
    image: "/images/company/samriddh.png",
  },
  {
    name: "SkillNet",
    category: "Training",
    positions: "Technical Trainer",
    image: "/images/company/skillnet.png",
  },
  {
    name: "Makasa Industries",
    category: "Manufacturing",
    positions: "Process Engineer",
    image: "/images/company/makasa.png",
  },
  {
    name: "NEXTUTE",
    category: "EdTech",
    positions: "Software Developer",
    image: "/images/company/nextute.png",
  },
  {
    name: "D2D",
    category: "Media",
    positions: "Content Creator",
    image: "/images/company/d2h.png",
  },
  {
    name: "FLATX",
    category: "Real Estate",
    positions: "Full Stack Developer",
    image: "/images/company/flatx.png",
  },
  {
    name: "deWall",
    category: "FinTech",
    positions: "Backend Developer",
    image: "/images/company/dewall.png",
  },
  {
    name: "ApkaAds",
    category: "Product Base",
    positions: "Product Manager",
    image: "/images/company/apkaads.png",
  },
  {
    name: "Syksha",
    category: "Fashion Tech",
    positions: "UI/UX Designer",
    image: "/images/company/syksha.png",
  },
  {
    name: "Gramin",
    category: "AgriTech",
    positions: "Mobile App Developer",
    image: "/images/company/gramin.png",
  },
];

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
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

        const getEventPriority = (event: Event) => {
          if (event._isEventEnded) return 4; // Past events last
          if (!event._hasRegistration) return 3; // Events without registration
          if (event._isRegistrationOpen) return 1; // Registration live
          if (event._isRegistrationUpcoming) return 0; // Registration upcoming
          return 2; // Registration ended but event not completed
        };

        const sortedEvents = processedEvents.sort((a: Event, b: Event) => {
          const aPriority = getEventPriority(a);
          const bPriority = getEventPriority(b);

          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }

          if (aPriority === 4) {
            return (b._eventDate?.getTime() || 0) - (a._eventDate?.getTime() || 0);
          }
          return (a._eventDate?.getTime() || 0) - (b._eventDate?.getTime() || 0);
        });

        setUpcomingEvents(sortedEvents);
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
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Our Events & Achievements
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Celebrating innovation, fostering talent, and creating
              opportunities through impactful events and initiatives
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Stay tuned for more exciting opportunities and events
            </p>
          </div>

          {loadingEvents ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading upcoming events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents
                .slice(0, showAllEvents ? upcomingEvents.length : 6)
                .map((event) => (
                  <Card
                    key={event._id}
                    className="group h-full flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white/60 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {event.imageUrl && (
                      <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className=" object-contain transition-transform duration-500 group-hover:scale-105"
                        />

                        {event.redirectLink && (
                          <div
                            className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full font-semibold shadow-md backdrop-blur-lg
                            ${
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
                      </div>
                    )}

                    <CardContent className="p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {event.content}
                      </p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatEventDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.club}</span>
                        </div>
                      </div>

                      {(event.redirectLink || event.resourcesLink) && (
                        <div className="pt-5 border-t border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {event.redirectLink && (
                              <Link
                                href={
                                  event._isRegistrationOpen
                                    ? event.redirectLink
                                    : "#"
                                }
                                target="_blank"
                                className={`relative flex items-center justify-center gap-2 px-4 py-2.5 
                                rounded-lg font-semibold text-sm
                                ${
                                  event._isRegistrationOpen
                                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    : "text-gray-400 bg-gray-100 cursor-not-allowed"
                                } 
                                transition-all duration-300`}
                                onClick={(e) => {
                                  if (!event._isRegistrationOpen) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <CalendarCheck className="w-4 h-4" />
                                {event._isRegistrationOpen
                                  ? event.redirectLabel || "Register Now"
                                  : "Registration Closed"}
                              </Link>
                            )}

                            {event.resourcesLink && (
                              <Link
                                href={event.resourcesLink}
                                target="_blank"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 
              bg-gray-100 border border-gray-300 rounded-lg text-gray-700 
              hover:bg-gray-200 hover:text-gray-900
              shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-1"
                              >
                                <Download className="w-4 h-4" />
                                {event.resourcesLabel || "Rulebook"}
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Upcoming Events
              </h3>
              <p className="text-gray-500">
                Stay tuned! New events will be announced soon.
              </p>
            </div>
          )}

          {upcomingEvents.length > 0 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              {upcomingEvents.length > 6 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 px-6 py-3 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => setShowAllEvents(!showAllEvents)}
                >
                  {showAllEvents ? "Show Less" : "Show More"}
                </Button>
              )}
              <Link href="/calendar">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  View Full Calendar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Hack N Tech Hackathon */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              HACK N TECH Hackathon 2025
            </h2>
            <p className="text-xl text-gray-600">
              "Unleash your innovation. Code the future" - A 24-hour coding
              marathon
            </p>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <img
                src="/images/hack-n-tech-poster.jpg"
                alt="Hack N Tech Hackathon Poster"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Event Highlights
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">23-24 May 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">24 Hours Non-stop</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">
                    Central Lecture Hall, IIT Patna
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">150+ Participants</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">
                    Innovation & Future Technology
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Event Features:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Workshops & Tech Talks</li>
                  <li>• Coding Sprints & Challenges</li>
                  <li>• Networking Opportunities</li>
                  <li>• Mentorship from Industry Experts</li>
                  <li>• Innovation Showcase</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Event Collage */}
          <div className="mb-16 relative">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Event Moments
            </h3>

            {/* Background Pattern */}
            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-purple-300 rounded-full blur-lg"></div>
                <div className="absolute bottom-20 left-20 w-28 h-28 bg-pink-300 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 bg-indigo-300 rounded-full blur-lg"></div>
              </div>

              {/* Geometric pattern overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                  radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                  radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px),
                  radial-gradient(circle at 75% 25%, #ec4899 2px, transparent 2px),
                  radial-gradient(circle at 25% 75%, #6366f1 2px, transparent 2px)
                `,
                  backgroundSize: "60px 60px",
                }}
              ></div>

              {/* Watermark Text */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-16 left-20 text-gray-400 text-sm font-extrabold opacity-20 transform rotate-12 select-none">
                  HACK N TECH
                </div>
                <div className="absolute top-32 right-24 text-gray-400 text-sm font-extrabold opacity-15 transform -rotate-12 select-none">
                  HACK N TECH
                </div>
                <div className="absolute bottom-24 left-16 text-gray-400 text-sm font-extrabold opacity-20 transform rotate-6 select-none">
                  HACK N TECH
                </div>
                <div className="absolute bottom-40 right-20 text-gray-400 text-sm font-extrabold opacity-15 transform -rotate-6 select-none">
                  HACK N TECH
                </div>
                <div className="absolute top-1/2 left-20 text-gray-400 text-xs font-extrabold opacity-10 transform rotate-45 select-none">
                  HACK N TECH
                </div>
                <div className="absolute top-1/3 right-16 text-gray-400 text-xs font-extrabold opacity-10 transform -rotate-45 select-none">
                  HACK N TECH
                </div>
                <div className="absolute bottom-1/3 left-15 text-gray-400 text-xs font-extrabold opacity-10 transform rotate-12 select-none">
                  HACK N TECH
                </div>
              </div>

              {/* Main image container */}
              <div className="relative z-10 flex justify-center">
                <div className="max-w-3xl w-full">
                  <img
                    src="/images/hackathon-collage.jpg"
                    alt="Hackathon Event Collage"
                    className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/50 hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-8 left-12 w-2.5 h-2.5 bg-pink-400 rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-6 right-6 w-3 h-3 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>

          <div className="mb-24">
            <h3 className="text-4xl font-extrabold text-gray-900 text-center mb-14 tracking-tight">
              Hackathon Winners
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {hackathonWinners.map((winner, index) => {
                const isWinner = winner.position === "Winner";
                const isFirstRunner = winner.position === "1st Runner Up";

                return (
                  <Card
                    key={index}
                    className={`
                      group relative overflow-hidden rounded-3xl 
                      bg-white shadow-lg border border-gray-100
                      transition-all duration-500 hover:-translate-y-2 
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                      ${isWinner ? "ring-4 ring-yellow-400/60" : ""}
                    `}
                  >
                    <CardContent className="p-8">
                      <div className="flex justify-center">
                        <div
                          className={`
                            px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow
                            flex items-center gap-1.5
                            ${
                              isWinner
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                : isFirstRunner
                                  ? "bg-gray-100 text-gray-800 border border-gray-300"
                                  : "bg-orange-100 text-orange-800 border border-orange-300"
                            }
                          `}
                        >
                          <Trophy className="w-4 h-4" />
                          {winner.position}
                        </div>
                      </div>

                      <div className="w-full h-56 mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group-hover:shadow-xl transition-all duration-500">
                        <img
                          src={winner.image || "/placeholder.svg"}
                          alt={`${winner.teamName} team`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-center mb-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">
                          {winner.teamName}
                        </h4>
                        <p
                          className={`text-lg font-semibold ${
                            isWinner
                              ? "text-yellow-600"
                              : isFirstRunner
                                ? "text-gray-700"
                                : "text-orange-600"
                          }`}
                        >
                          {winner.prize}
                        </p>
                      </div>

                      <div className="mb-8">
                        <h5 className="font-semibold text-gray-900 mb-2 text-base">
                          Project
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {winner.project}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3 text-base">
                          Team Members
                        </h5>
                        <ul className="space-y-1.5">
                          {winner.members.map((member, memberIndex) => (
                            <li
                              key={memberIndex}
                              className="text-sm text-gray-700 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {member}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Internship Drive */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Internship Drive 2025
            </h2>
            <p className="text-xl text-gray-600">
              Connecting talented students with leading industry partners
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <img
                src="/images/internship-drive-poster.jpg"
                alt="Internship Drive Poster"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Drive Details
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">23 May 2025</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">
                    Central Lecture Hall, IIT Patna
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">15+ Partner Companies</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg">Multiple Domain Opportunities</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Opportunities Available:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Software Development Internships</li>
                  <li>• Data Science & Analytics Roles</li>
                  <li>• UI/UX Design Positions</li>
                  <li>• Product Management Opportunities</li>
                  <li>• Business Development Roles</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Companies List */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Company details
            </h3>

            {/* Infinite Horizontal Scroll for Company Logos */}
            <div className="mb-12 overflow-hidden py-4">
              <div className="flex items-center">
                <style jsx global>{`
                  @keyframes scroll {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .animate-scroll {
                    animation: scroll 60s linear infinite;
                    width: max-content;
                    display: flex;
                    align-items: center;
                  }
                  .animate-scroll:hover {
                    animation-play-state: running !important;
                  }
                  .logo-container {
                    transform-origin: center;
                    transition: transform 0.3s ease;
                    min-width: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .logo-container img {
                    max-height: 50px;
                    width: auto;
                    max-width: 120px;
                  }
                  .logo-container:hover {
                    transform: scale(1.25);
                  }
                `}</style>
                <div className="flex animate-scroll">
                  {/* First set of logos */}
                  {[...Array(4)].map((_, i) => (
                    <Fragment key={`set-${i}`}>
                      {internshipCompanies.map((company, index) => (
                        <div
                          key={`${i}-${index}`}
                          className="logo-container flex-shrink-0 mx-6"
                        >
                          <Image
                            src={company.image}
                            alt={company.name}
                            width={100}
                            height={50}
                            className="object-contain max-h-[50px] w-auto"
                          />
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>

            <CompanyCards company={internshipCompanies} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to Participate in Our Events?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and be the first to know about upcoming events
            and opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/participation">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Join Student Technical Council
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
