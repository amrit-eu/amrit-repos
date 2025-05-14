import { Box, Typography, Paper, Grid, Container } from '@mui/material';
import { PageProps } from '../PageProps';
import { motion, useAnimation } from 'framer-motion';
import { IntegrationInstructions, AutoAwesome, Api, FactCheck } from '@mui/icons-material';
import Highlight from './Highlight';

interface OceanMetaProps extends PageProps {
  setSelectedOption: (option: string) => void; // Needed to switch pages
}

const OceanMeta: React.FC<OceanMetaProps> = ({ darkMode }) => {
  const controls = useAnimation();

  return (
    <motion.div animate={controls}>
		<Container
		maxWidth="lg"
		sx={{
			py: { xs: 2, md: 4 },
			mt: { xs: 2, md: 4 },
		}}
>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 4 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 500,
                color: darkMode ? "#03a9f4" : "#009af4",
				mb:2,
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' }, // Responsive font size
              }}
            >
              The GOOS Metadata Standard 
              
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: darkMode ? "#e0e0e0" : "#333",
                fontSize: { xs: '1rem', md: '1.5rem' }, // Responsive font size
              }}
            >
              A Unified Metadata Standard for the{' '} 
			   <Typography
              sx={{
                fontWeight: 400,
				backgroundColor: '#f38417', 
                fontSize: { xs: '1rem', md: '1.5rem' }, // Responsive font size
				px: 1, 
				py:0.5,
				color: '#ffffff',
				borderRadius: '2px',
				display: 'inline',
              }}>Global Ocean Observation System</Typography>
            </Typography>
          </Box>
        </motion.div>

        {/* Main Content */}
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Text Section */}
          <Grid item xs={12} md={12} lg={8} xl={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                elevation={0}
                sx={{
                  padding: { xs: 2, md: 4 },
                //   color: darkMode ? '#e0e0e0' : '#333',
                  backgroundColor: darkMode ? 'transparent' : '#fff',
                }}
              >
                <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, textAlign:"center",
        fontWeight: 600,mb: 4 }}>
                  The<Highlight> GOOS Metadata Standard</Highlight> is a unified framework for describing, validating, and exchanging metadata to enhance the
                  <Highlight> interoperability</Highlight>, <Highlight> discoverability</Highlight> and <Highlight>consistency</Highlight> of information across operational oceanographic observing efforts.
                </Typography>
                <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' },textAlign:"center",
        fontWeight: 600, mb: 3 }}>
                  This standard aligns with <Highlight>global standards</Highlight> and ensures that ocean observing platforms are documented with <Highlight>machine-readable metadata </Highlight>
                  enabling traceability, integration, and discovery.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

        </Grid>

        {/* Key Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.5rem', md: '2rem' }, 
              }}
            >
              Tools and services
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {[
                { icon: <IntegrationInstructions sx={{ color: "#FF6F61" }} fontSize="large" />, text: "Standardised Metadata Ontology and Definitions" },
                { icon: <Api sx={{ color: "#4bda3d" }} fontSize="large" />, text: "Human- and Machine-Readable Metadata APIs" },
                { icon: <FactCheck sx={{ color: "#ffde79" }} fontSize="large" />, text: "ODIS compatible JSON Schemas and JSON-LD" },
                { icon: <AutoAwesome sx={{ color: "#2196F3" }} fontSize="large" />, text: "Validation & Conversion of JSON and CSV formats" },
              ].map(({ icon, text }, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      textAlign: 'center',
                      padding: 2,
                      backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                      color: darkMode ? '#e0e0e0' : '#333',
                    }}
                  >
                    {icon}
                    <Typography variant="body2" sx={{ mt: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                      {text}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default OceanMeta;
