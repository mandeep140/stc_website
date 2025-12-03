"use client";

import { Box, Typography, Container, Button } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

type AboutProps = {
  title: string;
  about: string;
  message: string;
  toColor: string;
  fromColor: string;
  to: string;
};

const About: React.FC<AboutProps> = ({
  title,
  about,
  message,
  fromColor: _fromColor,
  toColor: _toColor,
  to: _to,
}) => {
  return (
    <Box
      component="section"
      className="relative w-full overflow-hidden"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 12, md: 16 },
        px: { xs: 4, sm: 6 },
        position: 'relative',
        background: '#fcfcfc',
        minHeight: '100vh',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
        }
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <Container maxWidth="lg" className="relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Typography
              variant="overline"
              className="inline-block tracking-[0.2em] uppercase text-xs font-medium"
              sx={{
                color: 'text.secondary',
                letterSpacing: '0.3em',
                position: 'relative',
                paddingBottom: '0.5rem',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '1px',
                  background: 'currentColor',
                  opacity: 0.5,
                }
              }}
            >
              Welcome to {title}
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', md: '2.75rem', lg: '3.25rem' },
                fontWeight: 800,
                
                position: 'relative',
                display: 'inline-block',
                fontFamily: 'var(--font-sans, Inter), sans-serif',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-0.5rem',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent, #9ca3af, transparent)'
                }
              }}
            >
              <span className="relative">
                {title}
              </span>
            </Typography>
          </motion.div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Typography
              variant="body1"
              className="leading-relaxed"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'text.secondary',
                lineHeight: 1.75,
                mb: 6,
                fontFamily: 'var(--font-sans, Inter), sans-serif',
                fontWeight: 400,
                position: 'relative',
                '@media (min-width: 1024px)': {
                  fontSize: '1.25rem',
                }
              }}
            >
              {about}
            </Typography>
          </motion.div>
        </div>

        <div className="w-full mt-20 pt-12 border-t border-gray-100 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl px-4"
          >
            <Typography
              variant="h5"
              className="mb-8 font-normal italic mx-auto"
              sx={{
                color: 'text.secondary',
                fontSize: '1.375rem',
                lineHeight: 1.6,
                position: 'relative',
                fontFamily: 'var(--font-sans, Inter), sans-serif',
                fontWeight: 400,
                fontStyle: 'italic',
                textAlign: 'center',
                '&::before': {
                  content: '"\u201C"',
                  position: 'absolute',
                  top: '-1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '3rem',
                  color: 'rgba(0,0,0,0.05)',
                  lineHeight: 1,
                  fontFamily: 'serif',
                }
              }}
            >
              {message}
            </Typography>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 flex justify-center w-full"
            >
              <Button
                variant="text"
                size="large"
                className="px-8 py-3 font-normal tracking-wider uppercase text-sm mx-auto"
                sx={{
                  borderRadius: '0',
                  borderBottom: '1px solid',
                  borderColor: 'text.primary',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    opacity: 0.8,
                  },
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.15em',
                  display: 'inline-flex',
                }}
              >
                Explore More
                <svg
                  className="w-4 h-4 ml-2 -mr-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Box>
  );
};

export default About;
