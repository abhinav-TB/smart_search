import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
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
  padding: '30px 20px',
  backgroundColor: 'rgba(250, 250, 250, 0.85)',
  borderRadius: '12px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
});

// Styled button for more appeal
const StyledButton = styled(Button)(() => ({
  position: 'relative',
  padding: '12px 30px',
  fontSize: '18px',
  backgroundColor: '#ff850f',
  color: '#fff',
  borderRadius: '30px',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#e07b0e',
    color: '#fff',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#1976d2',
      transition: 'transform 0.3s',
      transform: 'translateY(0)',
      zIndex: -1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      transition: 'transform 0.3s',
      transform: 'translateY(-100%)',
      zIndex: -2,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    transition: 'transform 0.3s',
    transform: 'translateY(-100%)',
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#1976d2',
    transition: 'transform 0.3s',
    transform: 'translateY(0)',
    zIndex: -2,
  },
}));

const SearchBar = styled(TextField)(() => ({
  marginBottom: '20px',
  width: '80%',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#ff850f',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff850f',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#555',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff850f', 
  },
}));

const Title = styled(Typography)({
  fontSize: '2.3rem',
  fontWeight: 'bold',
  color: '#ff850f',
  textAlign: 'center',
  margin: '20px 0',
});

function App() {
  const [userQuery, setUserQuery] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Smart Search';
  }, []);

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
    <>
      <div className="background-slider"></div>
      <div className="background-overlay"></div>
      <MainContainer maxWidth="md">
      <Title>Smart Search</Title>
        <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Find Your Dream Apartment
        </Typography>

        <Typography variant="h6" align="center" gutterBottom sx={{ color: '#555' }}>
          Enter a search query like: "Find a 3-bedroom apartment in New York under $500k."
        </Typography>

        <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '30px' }}>
          <SearchBar
            label="Search for apartments"
            variant="outlined"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <div style={{ marginTop: '20px' }}>
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
                <Card sx={{
                  boxShadow: '0px 5px 15px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 8px 25px rgba(0,0,0,0.2)',
                  },
                }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt="Apartment"
                      height="200"
                      image={result[7] || 'https://via.placeholder.com/400x200'} // Dynamically load image URL from the result or fallback to placeholder
                      title="Apartment Image"
                      sx={{
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.03)',
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
    </>
  );
}

export default App;