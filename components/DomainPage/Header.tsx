"use client";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { CardBody, CardContainer, CardItem } from "@//components/ui/3d-card";
import React from "react";
import { useRouter } from "next/navigation";
import { Spotlight } from "@//components/ui/Spotlight";
import { ArrowRight } from "lucide-react";

interface ClubStats {
  activeMembers: number;
  contestsHeld: number;
  totalSessions: number;
  projectsCompleted?: number;
  satisfactionRate?: number;
  upcomingEvents?: number;
}

type HeaderProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
  stats?: ClubStats;  // Made optional with '?'
  fromColor: string;
  toColor: string;
  to: {
    whatsappLink: string;
    [key: string]: string | undefined; // Allow other properties as well
  };
  prvDomain: string;
  nextDomain: string;
};

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  stats: _stats,
  fromColor,
  toColor,
  to,
  prvDomain,
  nextDomain,
}) => {
  const router = useRouter();

  return (
    <Box 
      component="header"
      sx={{
        width: '100%',
        position: 'relative',
        paddingTop: '80px',
        marginTop: 'calc(4rem - 80px)',
      }}
    >
      <div className="relative flex h-full w-full flex-col rounded-md bg-transparent md:items-center md:justify-center" style={{ zIndex: 10 }}>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: "1rem", md: "2rem" },
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: { xs: "1rem", md: "2rem" },
          }}
        >
          {/* left section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              order: { xs: 2, md: 1 },
            }}
          >
            {/* Premium Header */}
            <Box sx={{ 
              position: 'relative',
              textAlign: 'center',
              mb: 4
            }}>
              <Typography
                className="playfair-display bitcount-grid-single"
                sx={{
                  fontFamily: "'Michroma', 'system-ui', serif",
                  fontSize: { 
                  xs: ['ANALYTICAL ARENA', 'WEBWISER', 'PIXELERATE'].includes(title) ? '2.2rem' : '2.8rem', 
                  sm: '3.5rem', 
                  md: '4.5rem' 
                },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textTransform: 'capitalize',
                  marginTop: { xs: '1.5rem', md: '3rem' },
                  background: `linear-gradient(90deg, ${fromColor} 0%, ${toColor} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
                }}
              >
                {title}
              </Typography>
              
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  color: '#4a4a4a',
                  mt: 3,
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  fontWeight: 400,
                  position: 'relative',
                  '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    width: '60px',
                    height: '1px',
                    background: '#c0a080',
                    opacity: 0.6,
                    transition: 'width 0.3s ease, opacity 0.3s ease'
                  },
                  '&::before': {
                    left: '-40px',
                  },
                  '&::after': {
                    right: '-40px',
                  },
                  '&:hover': {
                    '&::before, &::after': {
                      width: '80px',
                      opacity: 0.8,
                    }
                  },
                  '@media (max-width: 900px)': {
                    '&::before, &::after': {
                      width: '25px',
                      left: '-30px',
                      right: '-30px'
                    },
                    '&:hover': {
                      '&::before, &::after': {
                        width: '35px',
                        left: '-35px',
                        right: '-35px'
                      }
                    }
                  },
                  '@media (max-width: 600px)': {
                    '&::before, &::after': {
                      display: 'none'
                    }
                  }
                }}
              >
                The {subtitle} 
              </Typography>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Box
                component="a"
                href={to.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 5,
                  py: 1.8,
                  background: 'transparent',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: '1.5px solid #1a1a1a',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, box-shadow',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                      transform: 'translateY(0)',
                      opacity: 1
                    },
                    '&::after': {
                      opacity: 0.1,
                      transform: 'scale(1.1)'
                    },
                    '& .button-text': {
                      position: 'relative',
                      zIndex: 2,
                      letterSpacing: '0.15em'
                    },
                    '& .button-arrow': {
                      transform: 'translateX(5px)',
                      opacity: 1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#1a1a1a',
                    transform: 'translateY(100%)',
                    opacity: 0,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 1
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0,
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                <span
                  className="button-text"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  Join Our Community
                  <Box
                    component="span"
                    className="button-arrow"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      opacity: 0.9,
                      lineHeight: 1
                    }}
                  >
                    <ArrowRight size={18} />
                  </Box>
                </span>
              </Box>
              <Typography variant="caption" sx={{
                display: 'block',
                color: '#999',
                mt: 1.5,
                fontSize: '0.75rem',
                letterSpacing: '0.05em'
              }}>
                Become part of our growing community
              </Typography>
            </Box>
          </Box>

          {/* right section */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: '100%', md: 'auto' },
            order: { xs: 1, md: 2 },
            px: { xs: 0, md: 0 },
          }}>
            <CardContainer className="inter-var">
              <CardBody className="relative group/card bg-transparent hover:bg-transparent">
                <CardItem translateZ="100" className="w-[24rem] h-[24rem] md:w-[28rem] md:h-[28rem]">
                  <Image
                    src={imageUrl}
                    width={400}
                    height={400}
                    className="object-contain w-full h-full"
                    alt="thumbnail"
                    priority
                    sizes="(max-width: 768px) 100vw, 28rem"
                  />
                </CardItem>
              </CardBody>
            </CardContainer>
          </Box>
        </Box>
        {/* navigation button section */}
        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            position: 'relative',
            zIndex: 100,
            margin: '2rem 0',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <button
            className="border-[1px] border-zinc-500 text-zinc-400 px-4 py-3 rounded-[2rem] hover:text-zinc-200 hover:border-zinc-400 hover:scale-110 ease-in duration-75"
            onClick={() => router.push(prvDomain)}
          >
            <FaArrowLeft className="text-xl w-8" />
          </button>

          <button
            className="border-[1px] border-zinc-500 text-zinc-400 px-4 py-3 rounded-[2rem] hover:text-zinc-200 hover:border-zinc-400 hover:scale-110 ease-in duration-75"
            onClick={() => router.push(nextDomain)}
          >
            <FaArrowRight className="text-xl w-8" />
          </button>
        </Box>
        <Spotlight
          className="-top-40 -left-40 md:-top-10 md:-left-10"
          fill={toColor}
        />
      </div>
    </Box>
  );
};

export default Header;
