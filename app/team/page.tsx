"use client";

import { Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AppConfig from "@/config/appConfig";

const coreTeam = [
  {
    name: "Gautam Kumar",
    designation: "President",
    department: "Student Technical Council - CEP",
    image: "/gautam.png",
    email: "gautam_2312res266@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/gautamkumar266/",
    description:
      "Leading STC's vision and driving innovation across all wings. Passionate about entrepreneurship and technology.",
  },
  {
    name: "Aryan Singh",
    designation: "Vice President",
    department: "Student Technical Council - CEP",
    image: "/aryan.png",
    email: "aryan_2312res179@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/aryan-singh-358556245/",
    description:
      "Overseeing technical initiatives and research projects. Expert in competitive programming and AI.",
  },
  {
    name: "Ritu Raj",
    designation: "General Secretary",
    department: "Student Technical Council - CEP",
    image: "/Ritu.png",
    email: "ritu_2312res532@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/ritu-raj-9321b5294/",
    description:
      "Managing operations and career development programs. Focused on bridging academia and industry.",
  },
  {
    name: "Hridyanand Gupta",
    designation: "Treasurer",
    department: "Student Technical Council - CEP",
    image: "/hridyanand.png",
    email: "hridayanand_2312res301@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/hridayanand-gupta-abb501304/",
    description:
      "Managing financial operations and budget planning. Expertise in financial modeling and analysis.",
  },
];

const councilMembers = [
  {
    name: "Tushar Parihar",
    designation: "Council Head",
    department: "Student Technical Council - CEP",
    image: "/tushar.png",
    email: "tushar_2312res704@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/tushar-parihar-87168a34a/",
    description:
      "Leading the Student Technical Council to foster innovation, impactful event management and holistic student growth across IIT Patna.",
  },
  {
    name: "Satyam Kumar",
    designation: "Editor in Chief",
    department: "Student Technical Council - CEP",
    image: "/satyam.png",
    email: "satyam_24a12res597@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/satyamkumariitp/",
    description:
      "Overseeing editorial content and communications. Skilled in technical writing and media relations.",
  },
  {
    name: "Ayush Jha",
    designation: "Overall Management Lead",
    department: "Student Technical Council - CEP",
    image: "/ayush-jha.png",
    email: "ayush_2312res211@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/ayush1979/",
    description:
      "Coordinating overall management and strategic planning. Experienced in project management and leadership.",
  },
  {
    name: "Kumar Aayush",
    designation: "Tatva Cell Head",
    department: "Student Technical Council - CEP",
    image: "/aayush.png",
    email: "aayush_2312res805@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/kumar-aayush-772973332/",
    description:
      "Leading the Tatva Cell and coordinating its activities. Skilled in event management and team leadership.",
  },
  {
    name: "Kanishk Arya",
    designation: "Disha Cell Head",
    department: "Student Technical Council - CEP",
    image: "/kanishk.png",
    email: "kanishk_2312res322@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/kanishk-arya-a47a70283/",
    description:
      "Heading the Training & Placement Cell with a mission to empower students with opportunities and professional readiness.",
  },
  {
    name: "Raunak Verma",
    designation: "Arthniti Cell Head",
    department: "Student Technical Council - CEP",
    image: "/raunak.png",
    email: "raunak_24a11res65@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/raunak-verma-7b365a2a3/",
    description:
      "Leading the Arthniti Cell and coordinating its activities. Skilled in financial analysis and team leadership.",
  },
];

const developers = [
  {
    name: "Ankit Kumar",
    designation: "Pixelerate Sub-Coordinator",
    department: "STC Development Team",
    image: AppConfig.imageUrls.Ankit,
    email: "ankit_24a12res103@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/ankit-kumar-0435b8257",
    description:
      "Led Frontend development and provided crucial Backend support, ensuring seamless integration and optimal performance across the website.",
  },
  {
    name: "Mandeep Nagar",
    designation: "WebWiser Member",
    department: "STC Development Team",
    image: AppConfig.imageUrls.Mandeep,
    email: "mandeep_25s12res200@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/mandeepnagar",
    description:
      "Spearheaded Backend architecture while contributing to frontend components, focusing on creating a robust and scalable web application.",
  },
  {
    name: "Mohit Kumar",
    designation: "WebWiser Coordinator",
    department: "STC Development Team",
    image: AppConfig.imageUrls.MohitWebWiser,
    email: "mohit_2312res394@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/mohiitp",
    description:
      "Provided expert guidance and technical insights throughout the development process, helping shape the website's architecture and features.",
  },
  {
    name: "Abhijeet Kumar",
    designation: "Codered Sub-Coordinator",
    department: "STC Development Team",
    image: AppConfig.imageUrls.AbhijeetKumar,
    email: "abhijeet_2312res11@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/abhijeetiitp/",
    description:
      "Contributed valuable expertise in web development, offering solutions and optimizations that enhanced the website's functionality and user experience.",
  },
  {
    name: "Abhishek Mohanty",
    designation: "WebWiser Sub-Coordinator",
    department: "STC Development Team",
    image: AppConfig.imageUrls.Abhishek,
    email: "abhishek_2312res891@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/abhishekiitp891",
    description:
      "Played a key role in development, providing technical direction and implementing critical features that elevated the website's capabilities.",
  },
  {
    name: "Vatsal Srivastava",
    designation: "Webwiser Member",
    department: "STC Development Team",
    image: AppConfig.imageUrls.VatsalWebWiser,
    email: "vatsal_2313res728@iitp.ac.in",
    linkedin: "https://www.linkedin.com/in/vatsalsrivastava-iitp",
    description:
      "Delivered essential technical contributions and innovative solutions that were instrumental in the successful deployment of key website features.",
  },
];

interface TeamMember {
  name: string;
  designation: string;
  department: string;
  image: string;
  email: string;
  linkedin: string;
  team?: string;
  description?: string;
}

function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  // Generate colors based on index for variety
  const colorThemes = [
    { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
    { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
    { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
    { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
  ];
  const colors = colorThemes[index % colorThemes.length];

  return (
    <motion.div
      key={index}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transform transition-all duration-500 group-hover:scale-105">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = `w-full h-full flex items-center justify-center ${colors.bg}`;
                  fallback.textContent = member.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("");
                  fallback.style.color = "white";
                  fallback.style.fontWeight = "bold";
                  fallback.style.fontSize = "2rem";
                  target.parentNode?.insertBefore(fallback, target.nextSibling);
                }}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${colors.bg} text-white font-bold text-4xl`}
              >
                {member.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-[#2e86c1] mb-1 group-hover:translate-x-1 transition-transform duration-300">
                {member.name}
              </h3>
              <p className="text-lg font-medium text-muted-foreground mb-1">
                {member.designation}
              </p>
              <p className="text-sm font-semibold text-[#2e86c1] mb-4 inline-block px-3 py-1 rounded-full bg-[#e8f1f8] bg-opacity-80">
                {member.department}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed border-l-2 border-gray-200 pl-4 italic">
                "{member.description}"
              </p>
            </div>

            {member.team && (
              <p className="text-muted-foreground mb-6 leading-relaxed border-l-2 border-gray-200 pl-4 italic">
                {member.team} Team
              </p>
            )}

            {/* Contact Links */}
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href={`mailto:${member.email}`}
                className="p-3 bg-[#e8f1f8] hover:bg-[#d4e5f5] text-[#2e86c1] rounded-lg transition-colors duration-300"
                aria-label={`Email ${member.name}`}
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={member.linkedin}
                className="p-3 bg-[#e8f1f8] hover:bg-[#d4e5f5] text-[#2e86c1] rounded-lg transition-colors duration-300"
                aria-label={`${member.name}'s LinkedIn`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Meet the dedicated individuals who lead the Student Technical
              Council and drive innovation across our three wings and
              specialized teams.
            </p>
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="
      text-4xl md:text-5xl font-extrabold 
      text-[#1d4ed8] 
      drop-shadow-sm 
      mb-4 tracking-tight
    "
            >
              Core Leadership Team
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The executive leadership providing strategic direction and
              governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {coreTeam.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* council Team */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="
      text-4xl md:text-5xl font-extrabold 
      text-[#1d4ed8] 
      drop-shadow-sm 
      mb-4 tracking-tight
    "
            >
              Council Team
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Meet the council team of Student Technical Council IIT Patna
              Hybrid Programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {councilMembers.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/*Developers*/}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="
       text-4xl md:text-5xl font-extrabold 
      text-[#1d4ed8] 
      drop-shadow-sm 
      mb-4 tracking-tight
    "
            >
              Our Developers
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Meet the Core Developers of Student Technical Council IIT Patna
              Hybrid Programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {developers.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>
      <div>
        <div className="flex flex-col items-center justify-center py-16 relative">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
            More Positions Coming Soon
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </h2>
          <p className="text-gray-500 text-base">Stay tuned for updates!</p>
        </div>
      </div>
      {/* Contact CTA */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Connect with Our Team?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help with any questions about participation,
            collaboration, or Student Technical Council activities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
