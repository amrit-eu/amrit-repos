import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Divider } from '@mui/material';
import { PageProps } from '../PageProps';
import CodeModal from './CodeModal';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {  Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Field {
  code: string;
  title: string;
  type?: string;
  definition?: string;
}

interface Class {
  id: string;
  label: string;
  type: string;
  definition?: string;
  fields: Field[];
}

const BASE_PATH = '/meta';

const Dictionary: React.FC<PageProps> = ({ darkMode }) => {
  const [data, setData] = useState<Class[]>([]);

  const [expanded, setExpanded] = useState<string | null>(null);

const toggleExpand = (classId: string) => {
  setExpanded(prev => prev === classId ? null : classId);
};

const [previewOpen, setPreviewOpen] = useState(false);
const [previewContent, setPreviewContent] = useState('');
const [previewTitle, setPreviewTitle] = useState('');
const [previewLang, setPreviewLang] = useState<'json' | 'jsonld' | 'ttl'>('ttl');

const getLinks = (classId: string) => {
  const linkGroups = [
    {
      ext: 'ttl',
      folder: 'ontology',
      label: 'OWL/TTL Ontology',
      color: '#42a5f5',
    },
    {
      ext: 'jsonld',
      folder: 'context',
      label: 'JSON-LD Context',
      color: '#66bb6a',
    },
    {
      ext: 'schema',
      folder: 'schema',
      label: 'JSON Schema',
      color: '#ffa726',
    },
    {
      ext: 'example',
      folder: 'example',
      label: 'JSON Examples',
      color: '#bfa583',
    },
  ];

  return linkGroups.map(({ ext, folder, label: fileType, color }) => (
    <Card
      key={ext}
      sx={{
        minWidth: 180,
        border: `2px solid ${color}`,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color, mb: 1, textAlign: 'center' }}
        >
          {fileType}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title={`Published ${fileType}`}>
            <IconButton
              size="small"
              component="a"
              href={`https://www.ocean-ops.org/goosmeta/${folder}/${classId}.${ext === 'schema' ? 'schema.json' : folder === 'example' ? 'example.jsonld' : ext}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`GitHub ${fileType}`}>
            <IconButton
              size="small"
              component="a"
              href={`https://github.com/British-Oceanographic-Data-Centre/amrit-repos/tree/main/goos-metadata-standard/${folder}/${classId}.${ext === 'schema' ? 'schema.json' : ext}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Preview ${fileType}`}>
            <IconButton
              size="small"
              onClick={() => handlePreview(classId, ext as 'ttl' | 'jsonld' | 'schema')}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  ));
};


const handlePreview = async (
  classId: string,
  ext: 'ttl' | 'jsonld' | 'schema'
) => {
  let folder = '';
  let fileName = '';

  switch (ext) {
    case 'ttl':
      folder = 'ontology';
      fileName = `${classId}.ttl`;
      break;
    case 'jsonld':
      folder = 'context';
      fileName = `${classId}.jsonld`;
      break;
    case 'schema':
      folder = 'schema';
      fileName = `${classId}.schema.json`;
      break;
  }

  const url = `https://www.ocean-ops.org/goosmeta/${folder}/${fileName}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const text = await res.text();
    setPreviewContent(text);
    setPreviewTitle(fileName);
    setPreviewLang(ext === 'ttl' ? 'ttl' : 'json'); // syntax highlighter doesn't have 'jsonld' or 'schema', use 'json'
    setPreviewOpen(true);
  } catch (err) {
    console.error('Preview load failed:', err);
  }
};

  useEffect(() => {
    fetch(`${BASE_PATH}/data/mcd.json`)
      .then((response) => response.json())
      .then((schema) => setData(schema.classes))
      .catch((error) => console.error('Error loading MCD schema:', error));
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
        Dictionary
      </Typography>





	  <Box sx={{     
		mt: 4,
    mb: 4,
    p: 2,
    px: 4,
    display: 'inline-block',
    backgroundColor: darkMode ? '#1e3a4d' : '#e3f2fd',
    borderLeft: '5px solid #2196f3',
    borderRadius: 2,
    maxWidth: 900,
    textAlign: 'left',}}>
			<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
				What is the GOOS Passport?
			</Typography>
			<Typography variant="body1" sx={{ mb: 2 }}>
				The GOOS Passport is the central concept of the GOOS Metadata Standard. <br/>It represents a validated metadata record 
				for an ocean observation mission. <br/> It has <strong>GOOS Mission</strong> as its root class and a clearly bounded set 
				of related classes. <br/> The Passport Schema includes only the relevant classes and properties.
				<br/> For more details about Passports, visit the <a href="#/passport">Passports section</a>.
			</Typography>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
				{[
				{ id: 'goos_passport', ext: 'schema', label: 'JSON Schema', color: '#ffa726' },
				{ id: 'goos_passport.example', ext: 'jsonld', label: 'Example JSON-LD', color: '#66bb6a' },
				].map(({ id, ext, label, color }) => (
				<Card key={id} sx={{ minWidth: 200, border: `2px solid ${color}`, borderRadius: 2, boxShadow: 1 }}>
					<CardContent sx={{ p: 1 }}>
					<Typography
						variant="subtitle2"
						sx={{ fontWeight: 600, color, mb: 1, textAlign: 'center' }}
					>
						{label}
					</Typography>
					<Divider sx={{ mb: 1 }} />
					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
						<Tooltip title={`Published ${label}`}>
						<IconButton
							size="small"
							component="a"
							href={`https://www.ocean-ops.org/goosmeta/${ext === 'schema' ? 'schema' : 'example'}/${id}.${ext === 'schema' ? 'schema.json' : 'jsonld'}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<LaunchIcon fontSize="small" />
						</IconButton>
						</Tooltip>
						<Tooltip title={`GitHub ${label}`}>
						<IconButton
							size="small"
							component="a"
							href={`https://github.com/British-Oceanographic-Data-Centre/amrit-repos/tree/main/goos-metadata-standard/${ext === 'schema' ? 'schema' : 'example'}/${id}.${ext === 'schema' ? 'schema.json' : 'jsonld'}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<GitHubIcon fontSize="small" />
						</IconButton>
						</Tooltip>
						<Tooltip title={`Preview ${label}`}>
						<IconButton
							size="small"
							onClick={() =>
							handlePreview(id, ext as 'ttl' | 'jsonld' | 'schema')
							}
						>
							<VisibilityIcon fontSize="small" />
						</IconButton>
						</Tooltip>
					</Box>
					</CardContent>
				</Card>
				))}
			</Box>
		</Box>




		  <Typography variant="h5" noWrap sx={{ fontWeight: 500, color: darkMode ? "#e0e0e0" : "#333" }}>
			  Expand a class to explore its properties, relationships and related code files:
		  </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow  sx={{ backgroundColor: darkMode ? '#438cb0' : '#aae3ff', color: darkMode ? '#ffffff' : '#000000de' }}>

  			  <TableCell /> 
              <TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Code</strong></TableCell>
              <TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Name</strong></TableCell>
              <TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Type</strong></TableCell>
              <TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Definition</strong></TableCell>
            </TableRow>
          </TableHead>
			<TableBody>
			{data.map((cls) => (
				<React.Fragment key={cls.id}>
				<Tooltip title="Click to expand">
					<TableRow
						onClick={() => toggleExpand(cls.id)}
						sx={{
						cursor: 'pointer',
						backgroundColor: expanded === cls.id
							? (darkMode ? '#9e7e50' : '#ffdca9')
							: darkMode ? '#263238' : '#f5f5f5',
						'&:hover': {
							backgroundColor: (darkMode ? '#c2a274' : '#fff8e1'),
						},
						transition: 'background-color 0.2s ease-in-out',
						}}
					>
						<TableCell width={48}>
							<IconButton size="small">
							{expanded === cls.id ? (
								<KeyboardArrowUpIcon />
							) : (
								<KeyboardArrowDownIcon />
							)}
							</IconButton>
						</TableCell>
						<TableCell sx={{ fontFamily: "'Lexend', sans-serif", fontWeight: 500, fontSize: '1rem' }}>{cls.id}</TableCell>
  
						<TableCell sx={{ fontFamily: "'Lexend', sans-serif", fontWeight: 500, fontSize: '1rem' }}>{cls.label}</TableCell>
						<TableCell sx={{ fontFamily: "'Lexend', sans-serif", fontWeight: 400, fontSize: '0.9rem' }}>CLASS</TableCell>
						<TableCell sx={{ fontFamily: "'Lexend', sans-serif", fontWeight: 400, fontSize: '0.9rem' }}>{cls.definition || ''}</TableCell>
					</TableRow>
				</Tooltip>

				{expanded === cls.id && (
					<TableRow >
					<TableCell colSpan={4} >
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" sx={{ fontWeight: 500 }}>
								{cls.label} definition: {cls.definition}
							</Typography>
							<Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
								{getLinks(cls.label.toLowerCase().replace(' ', '_'))}
							</Box>
							<Box sx={{ mt: 4 }}>
								<Typography variant="h6" sx={{ mb: 1 }}>
								Properties of {cls.label}
								</Typography>
								<Table size="small" sx={{ border: '1px solid #ccc' }}>
								<TableHead>
									<TableRow sx={{ backgroundColor: darkMode ? '#37474f' : '#e3f2fd' }}>
									<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Code</strong></TableCell>
									<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Title</strong></TableCell>
									<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Type</strong></TableCell>
									<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}><strong>Definition</strong></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cls.fields.map((field) => (
									<TableRow key={field.code}>
										<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}>{field.code}</TableCell>
										<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}>{field.title}</TableCell>
										<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}>{field.type || ''}</TableCell>
										<TableCell sx={{ fontFamily: "'Lexend', sans-serif" }}>{field.definition || ''}</TableCell>
									</TableRow>
									))}
								</TableBody>
								</Table>
							</Box>
						</Box>
					</TableCell>
					</TableRow>
				)}
				</React.Fragment>
			))}
			</TableBody>

        </Table>
      </TableContainer>

	  <CodeModal
		open={previewOpen}
		onClose={() => setPreviewOpen(false)}
		content={previewContent}
		title={previewTitle}
		language={previewLang}
		/>

    </Box>
  );
};

export default Dictionary;
