import { HeroSection } from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import WingsSection from "@/components/WingsSection"
import CoreValues from "@/components/coreValues"
import Notifications from "@/components/Notifications"
import FaQ from "@/components/FaQ"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "STC IITP | Student Technical Council IIT Patna Hybrid Programs - Official Website",
  description: "STC IITP - Official Student Technical Council IIT Patna Hybrid Programs. Join STC Hybrid for technical excellence, events, workshops, and competitions through DISHA, ARTHNITI, and TATVA wings. Leading student organization at IIT Patna for innovation and leadership.",
  keywords: [
    "STC",
    "STC IITP",
    "STC IIT Patna",
    "STC Hybrid", 
    "Student Technical Council",
    "Student Technical Council IIT Patna",
    "Student Technical Council Hybrid",
    "Student Technical Council IITP",
    "Student Technical Council Hybrid Programs",
    "IIT Patna student council",
    "IITP technical council",
    "STC official website",
    "DISHA ARTHNITI TATVA",
    "technical events IIT Patna",
    "student organizations IIT Patna"
  ],
  openGraph: {
    title: "STC IITP | Student Technical Council IIT Patna Hybrid Programs",
    description: "Official Student Technical Council IIT Patna Hybrid Programs. Technical excellence and innovation through our specialized wings - DISHA, ARTHNITI, and TATVA.",
    url: 'https://stciitphybrid.in',
    siteName: 'STC IITP - Student Technical Council IIT Patna Hybrid Programs',
    images: [{
      url: '/images/stc.jpg',
      width: 1200,
      height: 630,
      alt: 'STC IITP - Student Technical Council IIT Patna Logo'
    }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STC IITP | Student Technical Council IIT Patna Hybrid Programs',
    description: 'Official Student Technical Council IIT Patna. Join us for technical excellence and innovation.',
    images: ['/images/stc.jpg'],
    creator: '@stc_iitpatna',
  },
  alternates: {
    canonical: 'https://stciitphybrid.in',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* SEO-optimized hidden headings for better search indexing */}
      <div className="sr-only">
        <h1>STC IITP - Student Technical Council IIT Patna Hybrid Programs Official Website</h1>
        <h2>STC IIT Patna - Leading Student Technical Council for Hybrid Programs</h2>
        <h2>Student Technical Council IITP - Empowering Innovation and Excellence</h2>
        <p>STC IITP is the official Student Technical Council at Indian Institute of Technology Patna Hybrid Programs, offering comprehensive hybrid programs for students. As the premier technical council at IIT Patna, STC provides career development, entrepreneurship opportunities, and technical innovation through three specialized wings.</p>
        <h3>STC Hybrid Programs - Three Specialized Wings</h3>
        <p>DISHA Wing: Career Growth and Training Cell at STC IIT Patna focuses on professional development and skill enhancement for students.</p>
        <p>ARTHNITI Wing: Entrepreneurship and Innovation Cell at Student Technical Council IITP promotes startup culture and business development.</p>
        <p>TATVA Wing: Technology and Research Cell at STC Hybrid advances technical expertise and research initiatives.</p>
        <h3>STC IITP Events and Activities</h3>
        <p>Join STC IIT Patna for technical events, coding competitions, hackathons, workshops, webinars, and seminars. Student Technical Council Hybrid Programs offer year-round activities for skill development.</p>
        <h3>Why Choose STC IIT Patna?</h3>
        <p>STC IITP is the best student technical council at IIT Patna for career growth, technical learning, and leadership opportunities. As the official Student Technical Council for Hybrid Programs, we serve students across India.</p>
      </div>
      
      <HeroSection />
      <Notifications />
      <StatsSection/>
      <WingsSection/>
      <CoreValues/>
      {/* <NoticesSection /> */}
      <FaQ/>
    </div>
  )
}
