import React from 'react';
import faq from '../assets/images/FAQ.jpg';
import query from '../assets/images/Query.png';
import scheduler from '../assets/images/scheduler.jpg';
import { Grid, Box, Avatar, Typography } from '@mui/material'; // Use MUI Grid for responsiveness

const ARBCategories = ({ handleCategoryClick, selectedCategory }) => {
  const categories = [
    { name: 'ARB Scheduler', key: 'arb_scheduler', image: scheduler },
    { name: 'ARB FAQ', key: 'arb_faq', image: faq },
    { name: 'ARB Query', key: 'arb_query', image: query }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{
            mt: 3,
          mb: 3,
          fontWeight: 'bold',
          color: "#1a3673",
        }}
      >
        Choose an ARB Category
      </Typography>

      {/* Use Grid for responsive layout */}
      <Grid container spacing={4} justifyContent="center">
        {categories.map((category) => (
          <Grid item xs={12} sm={4} md={3} key={category.key}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleCategoryClick(category.key)}
            >
              {/* Avatar with hover and click selection effect */}
              <Avatar
                src={category.image}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  border: selectedCategory === category.key ? '3px solid #1a3673' : '3px solid transparent', // Border applied on selection
                  transition: 'border 0.3s',
                  objectFit: 'cover', // Ensures the image fits correctly inside the avatar
                  borderRadius: '50%', // Circular shape
                  '&:hover': {
                    border: '3px solid #1a3673', // Border on hover
                  },
                }}
              />
              <Typography
                sx={{
                  mt: 1,
                  color: "#1a3673",
                  fontWeight: 'bold',
                }}
              >
                {category.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ARBCategories;
