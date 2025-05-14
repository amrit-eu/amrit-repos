import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Divider } from '@mui/material';
import { PageProps } from '../PageProps';
import CodeModal from './CodeModal';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Tooltip } from '@mui/material';

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
      folder: 'schemas',
      label: 'JSON Schema',
      color: '#ffa726',
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
              href={`https://www.ocean-ops.org/goosmeta/${folder}/${classId}.${ext === 'schema' ? 'schema.json' : ext}`}
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
      folder = 'schemas';
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
      <Typography variant="h2" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
        Dictionary
      </Typography>
		  <Typography variant="h5" noWrap sx={{ fontWeight: 500, color: darkMode ? "#e0e0e0" : "#333" }}>
			  Expand a class to explore its properties, relationships and related code files
		  </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow  sx={{ backgroundColor: darkMode ? '#438cb0' : '#aae3ff', color: darkMode ? '#ffffff' : '#000000de' }}>
              <TableCell><strong>Code</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Definition</strong></TableCell>
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
							? (darkMode ? '#9e7e50' : '#ffdca9') // light orange for selected
							: darkMode ? '#263238' : '#f5f5f5',
						'&:hover': {
							backgroundColor: (darkMode ? '#c2a274' : '#fff8e1'), // faint orange on hover
						},
						transition: 'background-color 0.2s ease-in-out',
						}}
					>
						<TableCell>{cls.id}</TableCell>
						<TableCell>{cls.label}</TableCell>
						<TableCell>CLASS</TableCell>
						<TableCell>{cls.definition || ''}</TableCell>
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
								{getLinks(cls.label.toLowerCase())}
							</Box>
							<Box sx={{ mt: 4 }}>
								<Typography variant="h6" sx={{ mb: 1 }}>
								Properties of {cls.label}
								</Typography>
								<Table size="small" sx={{ border: '1px solid #ccc' }}>
								<TableHead>
									<TableRow sx={{ backgroundColor: darkMode ? '#37474f' : '#e3f2fd' }}>
									<TableCell><strong>Code</strong></TableCell>
									<TableCell><strong>Title</strong></TableCell>
									<TableCell><strong>Type</strong></TableCell>
									<TableCell><strong>Definition</strong></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cls.fields.map((field) => (
									<TableRow key={field.code}>
										<TableCell>{field.code}</TableCell>
										<TableCell>{field.title}</TableCell>
										<TableCell>{field.type || ''}</TableCell>
										<TableCell>{field.definition || ''}</TableCell>
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
