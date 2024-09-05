import { Box, Typography } from "@mui/material";
import { Highlight } from 'react-instantsearch-dom';
import { Link } from 'react-router-dom';


const Hit2 = ({ hit }) => (
  <Box
    sx={{
      padding: '8px',
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-of-type': {
        borderBottom: 'none'
      },
      listStyle: 'none'
    }}
  >
    <Typography variant="body1">
      <Link to ={`/feed?highlightedItem=${hit.objectID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Highlight attribute="name" hit={hit} />
      </Link>
    </Typography>
  </Box>
);

export default Hit2;