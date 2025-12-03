import React from "react";
import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  achievements?: string[];
  linkedin?: string;
  github?: string;
  email?: string;
}

interface MemberSectionProps {
  members: Member[];
}

export const MemberSection: React.FC<MemberSectionProps> = ({ members }) => {
  const getGridConfig = (count: number) => {
    // Base styles for all screen sizes
    const baseStyles = "w-full mx-auto px-4 sm:px-6";

    // For 1 member: Single centered card
    if (count === 1)
      return {
        container: `${baseStyles} max-w-md`,
        grid: "grid-cols-1",
        gap: "gap-8",
        specialLayout: false,
      };

    // For 2 members: 1 column on mobile, 2 on larger screens
    if (count === 2)
      return {
        container: `${baseStyles} max-w-4xl`,
        grid: "grid-cols-1 sm:grid-cols-2",
        gap: "gap-6 sm:gap-8",
        specialLayout: false,
      };

    // For 3 members: 1 column on mobile, 3 on larger screens with wider cards
    if (count === 3)
      return {
        container: `${baseStyles} max-w-6xl`, // Increased from max-w-5xl to max-w-6xl
        grid: "grid-cols-1 md:grid-cols-3", // Changed from sm:grid-cols-2 to md:grid-cols-3
        gap: "gap-6 md:gap-8 lg:gap-10", // Adjusted gaps for better spacing
        specialLayout: false,
      };

    // For 4 members: 2 columns on mobile, 4 on larger screens with wider cards
    if (count === 4)
      return {
        container: `${baseStyles} max-w-7xl`, // Increased from max-w-6xl to max-w-7xl
        grid: "grid-cols-2 md:grid-cols-4", // Changed from sm:grid-cols-2 to md:grid-cols-4
        gap: "gap-4 md:gap-6 lg:gap-8", // Adjusted gaps for better spacing
        specialLayout: false,
      };

    // For 5 members: Special layout (2-3)
    if (count === 5)
      return {
        container: `${baseStyles} max-w-6xl`,
        grid: "grid-cols-2 md:grid-cols-3",
        gap: "gap-4 sm:gap-6",
        specialLayout: true,
      };

    // For 6+ members: 2 columns on mobile, 3 on medium, 4 on large screens
    return {
      container: `${baseStyles} max-w-7xl`,
      grid: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      gap: "gap-4 sm:gap-5",
      specialLayout: false,
    };
  };

  const gridConfig = getGridConfig(members.length);

  // For 5 cards, we'll split them into two separate rows with responsive layout
  if (members.length === 5 && gridConfig.specialLayout) {
    const firstRow = members.slice(0, 2);
    const secondRow = members.slice(2);

    return (
      <section className="pb-8 sm:pb-12 md:pb-16">
        <div className={gridConfig.container}>
          <div className="text-center mb-8 sm:mb-12">
            <div className="relative inline-block group">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 mb-4 sm:mb-5 relative z-10 font-sans">
                <span className="relative">
                  Our Team
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></span>
                </span>
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Meet the amazing members of our subclub - their expertise, skills,
              and achievements.
            </p>
          </div>

          {/* First row with 2 cards */}
          <div className="flex justify-center mb-6 sm:mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-4xl">
              {firstRow.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-center px-2 w-full"
                >
                  <ProfileCard member={member} />
                </div>
              ))}
            </div>
          </div>

          {/* Second row with 3 cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
              {secondRow.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-center px-2 w-full"
                >
                  <ProfileCard member={member} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default grid layout for other cases
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className={gridConfig.container}>
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative inline-block group">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 mb-4 sm:mb-5 relative z-10 font-sans">
              <span className="relative">
                Our Team
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></span>
              </span>
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Meet the amazing members of our subclub - their expertise, skills,
            and achievements.
          </p>
        </div>

        <div
          className={`grid ${gridConfig.grid} ${gridConfig.gap} w-full mx-auto`}
        >
          {members.map((member) => (
            <div key={member.id} className="flex justify-center px-2 w-full">
              <ProfileCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProfileCard: React.FC<{ member: Member }> = ({ member }) => {
  return (
    <div className="w-full h-[300px] sm:h-[340px] md:h-[380px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-sky-300/60 to-sky-500/60 shadow-md sm:shadow-lg overflow-hidden relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Profile Image - Responsive container with fixed aspect ratio */}
      <div className="relative w-full h-full">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Bottom Overlay Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent"></div>

        {/* Bottom Section */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 w-full flex justify-center px-2">
          <div className="w-[95%] flex items-center justify-between bg-white/20 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
            {/* Name and Position */}
            <div className="text-left">
              <p className="text-sm sm:text-base font-semibold text-white">
                {member.name}
              </p>
              <p className="text-xs sm:text-sm text-white/80 leading-tight font-light">
                {member.role}
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex items-center space-x-2">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block hover:opacity-80 transition-all duration-200 hover:scale-125"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
              )}
              {member.github && (
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block hover:opacity-80 transition-all duration-200 hover:scale-125"
                >
                  <Github className="w-4 h-4 text-white" />
                </a>
              )}
              {member.email && (
                <a 
                  href={`mailto:${member.email}`} 
                  className="inline-block hover:opacity-80 transition-all duration-200 hover:scale-125"
                >
                  <Mail className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSection;
