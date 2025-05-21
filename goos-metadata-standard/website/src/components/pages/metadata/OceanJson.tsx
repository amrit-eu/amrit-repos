import { Box, Typography, Link } from '@mui/material';
import { PageProps } from '../PageProps';
import GitHubIcon from '@mui/icons-material/GitHub';

const OceanJson: React.FC<PageProps> = ({ darkMode }) => {
  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Page Title */}
      <Typography variant="h3" noWrap sx={{ fontWeight: 500, color: darkMode ? "#FF6F61" : "#FF6F61", marginBottom: 4 }}>
        
        <Typography variant="h3" component="span" sx={{ fontWeight: '600', color: darkMode ? "#ffa36a" : "#ffa36a", marginBottom: 2 }}>
          JSON
        </Typography>
      </Typography>
      <Typography variant="h5" sx={{ maxWidth: 800, textAlign: 'center', color: darkMode ? '#e0e0e0' : '#333', marginBottom: 2 }}>
        The GOOS Metadata Standard uses standard JSON format to allow communication between GOOS nodes.
      </Typography>

		<Typography variant="h5" sx={{ maxWidth: 800, textAlign: 'center', color: darkMode ? '#e0e0e0' : '#333', marginBottom: 0 }}>
		JSON is lightweight, human-readable, and universally supported, 
		making it ideal for seamless data exchange and integration across diverse systems.
		</Typography>

      <Box sx={{ maxWidth: 800, textAlign: 'left', mt: 3 }}>
	  
		<br /><br />
        <Typography variant="h4" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4", mb: 2 }}>
          The Technology
        </Typography>
        <Typography paragraph>
          The metadata standard uses two complementary technologies: <strong>JSON Schema</strong> and <strong>JSON-LD</strong>. Together, they provide both structure and semantic meaning to our data.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>JSON Schema</Typography>
        <Typography paragraph>
          JSON Schema is a powerful tool that:
        </Typography>
        <ul>
          <li>Defines the structure of data.</li>
          <li>Ensures data is valid and complete by enforcing rules (e.g., required fields, valid formats).</li>
          <li>Supports interoperability by creating a clear and consistent blueprint for data.</li>
        </ul>

        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3 }}>JSON-LD</Typography>
        <Typography paragraph>
          JSON-LD (Linked Data) adds semantic meaning to our data, enabling it to be easily understood and linked to other datasets. Key features include:
        </Typography>
        <ul>
          <li><strong>@context:</strong> Provides mappings to standard vocabularies (e.g., Schema.org, PROV).</li>
          <li><strong>@type:</strong> Identifies the type of data (e.g., Platform, Sensor).</li>
          <li><strong>@id:</strong> Provides unique identifiers for resources, making them discoverable globally.</li>
        </ul>
		<br /><br />
        <Typography variant="h4" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4", mt: 4, display: 'flex', alignItems: 'center' }}>
          <GitHubIcon sx={{ mr: 2, fontSize: '46px' }} /> Community Development
        </Typography>
		<br />
        <Typography paragraph>
          We encourage contributions from the community in our GitHub! Here’s how you can help:
        </Typography>
        <ul>
          <li>
            <strong>Raise Issues:</strong> Found a bug or have a suggestion?
            <br />
            Please raise an issue on our{' '}
            <Link href="https://github.com/British-Oceanographic-Data-Centre/amrit-repos/tree/main/goos-metadata-standard" target="_blank" rel="noopener" sx={{ color: darkMode ? "#03a9f4" : "#009af4" }}>
              GOOS Metadata Standard GitHub Repository
            </Link>.
          </li>
          <li>
            <strong>Contribute:</strong> Fork the repository, make changes, and submit a pull request!
          </li>
        </ul>
        <Typography paragraph>
          The current version is <code>0.0.1</code> and is still a draft and has not been officially published yet.
        </Typography>
      </Box>
    </Box>
  );
};

export default OceanJson;
