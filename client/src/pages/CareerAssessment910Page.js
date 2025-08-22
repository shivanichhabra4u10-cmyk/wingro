import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AssessmentWithScoring from '../components/AssessmentWithScoring';

/**
 * CareerAssessment page component for 9-10 grade students
 */
const CareerAssessment910Page = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Career Assessment for 9th-10th Grade
        </Typography>
        
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          This assessment will help you understand your career readiness, identify areas for growth,
          and provide personalized recommendations based on your responses.
        </Typography>
        
        {/* Render the assessment component with our new scoring-enabled JSON file */}
        <AssessmentWithScoring assessmentFileName="student-9-10-questions-fixed.json" />
      </Box>
    </Container>
  );
};

export default CareerAssessment910Page;
