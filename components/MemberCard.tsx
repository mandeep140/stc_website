import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

type TeamMember = {
  name: string;
  position: string;
  imgUrl: string;
};

type CardProps = {
  memberData : TeamMember;
}

const MemberCard : React.FC<CardProps>= ({memberData}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
     
      <Box sx={{ position: "relative" }}>
        <Image
          src={memberData.imgUrl}
          alt="member"
          width={180}
          height={200}
        />

        
        {/* <Typography
          sx={{
            position: "absolute",
            zIndex : '5',
            top : '135px',
            writingMode: "vertical-rl", 
            transform: "rotate(180deg)", 
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
            color: "white",
            padding: "4px",
            borderRadius: "4px",
            fontSize : '1.2rem'
          }}
        >
          {memberData.name}
        </Typography> */}
      </Box>

      {/* Position Text (Below Image) */}
      <Typography
        className="audiowide-font"
        sx={{
          fontSize: "2rem",
         
        }}
      >
        {memberData.position}
      </Typography>
    </Box>
  );
};

export default MemberCard;
