import { Box, Typography } from '@mui/material';
import { PageProps } from '../PageProps';
import DynamicMCD from './DynamicMCD';

const Diagram: React.FC<PageProps> = ({ darkMode }) => {
  return (
    <><Box sx={{ padding: 4 }}>
		  <Typography variant="h3" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
			  Class Diagram
		  </Typography>
		  <Typography variant="h5" noWrap sx={{ fontWeight: 500, color: darkMode ? "#e0e0e0" : "#333" }}>
			  Zoom, drag and click on classes to highlight relationships
		  </Typography>
	  </Box><DynamicMCD darkMode={darkMode}/></>
  );
};

export default Diagram;
