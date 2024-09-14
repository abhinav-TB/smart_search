import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { styled } from '@mui/system';

// Custom styled component for the main container
const MainContainer = styled(Container)({
  marginTop: '40px',
  marginBottom: '40px',
  padding: '0 20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  paddingBottom: '30px',
});

// Styled button for more appeal
const StyledButton = styled(Button)({
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#1976d2',
  '&:hover': {
    backgroundColor: '#135ba1',
  },
  color: '#fff',
});

const SearchBar = styled(TextField)({
  marginBottom: '20px',
  width: '80%',
});

function App() {
  const [userQuery, setUserQuery] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [error, setError] = useState(null);

  // Handle form submission for generating and executing SQL
  const handleSearch = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      // Generate SQL query
      const genResponse = await axios.post('http://127.0.0.1:5000/generate-query', {
        query: userQuery,
      });
      const sqlQuery = genResponse.data.sql_query;
      console.log(sqlQuery);

      // Execute SQL query
      const execResponse = await axios.post('http://127.0.0.1:5000/execute-query', {
        sql_query: sqlQuery,
      });
      setQueryResults(execResponse.data.results);

    } catch (err) {
      setError('Failed to process request.');
      console.error(err);
    }
  };

  return (
    <MainContainer>
      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Find Your Dream House
      </Typography>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: '#555' }}>
        Enter a search query like: "Find me a 3-bedroom house in New York under $500k with a garden."
      </Typography>
      <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <SearchBar
          label="Search for houses"
          variant="outlined"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <div style={{ margin: '20px 0' }}>
          <StyledButton variant="contained" type="submit">
            Search
          </StyledButton>
        </div>
      </form>

      {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}

      {queryResults.length > 0 && (
        <Grid container spacing={4}>
          {queryResults.map((result, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: '0px 5px 15px rgba(0,0,0,0.2)' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="House"
                    height="200"
                    image={result[7] || 'https://via.placeholder.com/400x200'} // Dynamically load image URL from the result or fallback to placeholder
                    title="House Image"
                    sx={{
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent sx={{ backgroundColor: '#fff', textAlign: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#1976d2' }}>
                      {result[1]} in {result[2]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result[3]} Bedrooms, {result[4]} Bathrooms
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      Price: ${result[5].toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amenities: {result[6]}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </MainContainer>
  );
}

export default App;
