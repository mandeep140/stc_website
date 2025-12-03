"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const pathname = usePathname();

  // Determine the theme based on the current route
  let theme = {
    bg: "bg-gray-100",
    accent: "blue",
    gradient: "from-blue-500 to-blue-700",
    border: "border-gray-200",
    hover: "hover:bg-blue-100",
    active: "bg-blue-200",
    text: "text-gray-900",
    navText: "text-gray-800 hover:text-gray-900",
    navHover: "hover:bg-blue-50",
    navActive: "bg-blue-100 text-gray-900 font-medium",
    navBg: "bg-white/90 backdrop-blur-sm shadow-sm",
  };

  if (pathname?.includes("disha")) {
    theme = {
      bg: "bg-red-50",
      accent: "red",
      gradient: "from-red-500 to-red-600",
      border: "border-red-200",
      hover: "hover:bg-red-100",
      active: "bg-red-200",
      text: "text-gray-900",
      navText: "text-gray-800 hover:text-gray-900",
      navHover: "hover:bg-red-50",
      navActive: "bg-red-100 text-gray-900 font-medium",
      navBg: "bg-white/90 backdrop-blur-sm shadow-sm",
    };
  } else if (pathname?.includes("arthniti")) {
    theme = {
      bg: "bg-amber-50",
      accent: "amber",
      gradient: "from-amber-500 to-amber-600",
      border: "border-amber-200",
      hover: "hover:bg-amber-100",
      active: "bg-amber-200",
      text: "text-gray-900",
      navText: "text-gray-800 hover:text-gray-900",
      navHover: "hover:bg-amber-50",
      navActive: "bg-amber-100 text-gray-900 font-medium",
      navBg: "bg-white/90 backdrop-blur-sm shadow-sm",
    };
  } else if (pathname?.includes("tatva")) {
    theme = {
      bg: "bg-teal-50",
      accent: "teal",
      gradient: "from-teal-500 to-teal-600",
      border: "border-teal-200",
      hover: "hover:bg-teal-100",
      active: "bg-teal-200",
      text: "text-gray-900",
      navText: "text-gray-800 hover:text-gray-900",
      navHover: "hover:bg-teal-50",
      navActive: "bg-teal-100 text-gray-900 font-medium",
      navBg: "bg-white/90 backdrop-blur-sm shadow-sm",
    };
  }

  // Map accent to concrete Tailwind classes (avoid dynamic class names).
  const accentBtnClass = (() => {
    switch (theme.accent) {
      case "red":
        return "bg-red-600 hover:bg-red-700";
      case "amber":
        return "bg-amber-600 hover:bg-amber-700";
      case "teal":
        return "bg-teal-600 hover:bg-teal-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  })();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/wings", label: "Wings" },
    { href: "/team", label: "Our Team" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact Us" },
  ];

  const moreItems = [
    { href: "/calendar", label: "Event Calendar" },
    { href: "/registration", label: "Registration" },
    { href: "/results", label: "Results" },
    { href: "/gallery", label: "Gallery" },
  ];

  const _handleDownloadBrochure = () => {
    const link = document.createElement("a");
    link.href = "./STC.pdf";
    link.download = "STC.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Unused function - kept for future implementation
  // const handleNoticesClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (typeof window !== "undefined") {
  //     const noticesSection = document.getElementById("notices-section");
  //     if (noticesSection) {
  //       noticesSection.scrollIntoView({ behavior: "smooth" });
  //     } else {
  //       // If not on home page, navigate to home page with hash
  //       window.location.href = "/#notices";
  //     }
  //   }
  //   setIsOpen(false);
  // };

  // Unused function - kept for future implementation  
  // const isNoticesActive = () => {
  //   if (!isMounted || typeof window === "undefined") return false;
  //   return pathname === "/" && window.location.hash === "#notices";
  // };

  const isAdmin = pathname?.startsWith("/admin");
  const xenith = pathname?.startsWith("/xenith");
  if (isAdmin || xenith) return null;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${theme.navBg} ${isScrolled ? "py-2" : "py-4"} border-b ${theme.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <img
                src="/images/stc-logo.jpg"
                alt="STC Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <h1 className="text-lg font-bold text-[#0f2a4d] group-hover:text-[#1a4b8c] transition-colors leading-tight">
                Student Technical Council
              </h1>
              <p className="text-xs text-[#1a4b8c] font-medium leading-tight">
                IIT Patna Hybrid Programs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.href} className="relative flex items-center">
                <Link
                  href={item.href}
                  className={`relative px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                    (
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    )
                      ? `${theme.navActive} font-semibold`
                      : `${theme.navText} ${theme.navHover}`
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}

            <div
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeout) {
                  clearTimeout(dropdownTimeout);
                  setDropdownTimeout(null);
                }
                setShowMoreDropdown(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setShowMoreDropdown(false);
                }, 200);
                setDropdownTimeout(timeout);
              }}
            >
              <button
                className={`relative px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  moreItems.some((item) => pathname.startsWith(item.href))
                    ? `${theme.navActive} font-semibold`
                    : `${theme.navText} ${theme.navHover}`
                }`}
              >
                More
                <svg
                  className={`inline-block ml-1 w-4 h-4 transition-transform duration-200 ${showMoreDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMoreDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {moreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname.startsWith(item.href)
                          ? `${theme.navActive}`
                          : `text-gray-700 hover:bg-gray-50`
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Download Brochure Button */}
            <a
              href="/STC.pdf"
              download
              target="_blank"
              className={`ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${accentBtnClass} transition-colors duration-200`}
            >
              <Download className="w-4 h-4 mr-2" />
              Brochure
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animations */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-4 pt-2 pb-4 space-y-2 sm:px-6 bg-blue-50 shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:translate-x-1 ${
                (
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                )
                  ? `text-${theme.accent}-700 font-bold`
                  : `text-gray-600 hover:text-${theme.accent}-600`
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile More Items - Direct Links */}
          <div className="pt-2 border-t border-gray-300">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              More
            </p>
            {moreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:translate-x-1 ${
                  pathname.startsWith(item.href)
                    ? `text-${theme.accent}-700 font-bold`
                    : `text-gray-600 hover:text-${theme.accent}-600`
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="/STC.pdf"
              download
              target="_blank"
              className={`w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white ${accentBtnClass} transition-colors duration-200`}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
