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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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

const CustomSelect = styled(Select)(() => ({
  '& .MuiSelect-icon': {
    color: '#ff850f !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ff850f; !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ff850f; !important',
  },
}));

// Custom styled MenuItem
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#ffede1 !important',
  },
  '&.Mui-selected': {
    backgroundColor: '#ffb380 !important',
    color: '#000 !important',
    '&:hover': {
      backgroundColor: '#ffb380 !important',
    },
  },
}));

// Styled InputLabel to change color when focused
const CustomInputLabel = styled(InputLabel)(() => ({
  '&.Mui-focused': {
    color: '#ff850f',
  },
}));

const App = () => {
  const [query, setQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(5);  // Default number of items to show
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Smart Search';
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/search', {
        query,
        limit: itemsToShow
      });
      setResults(response.data.results);
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="background-slider"></div>
      <div className="background-overlay"></div>
      <MainContainer maxWidth="md">
        <Title>Smart Search</Title>
        <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Find Your Dream Home
        </Typography>

        <Typography variant="h6" align="center" gutterBottom sx={{ color: '#555' }}>
          Enter a search query like: "Find a 3-bedroom apartment in New York under $500k."
        </Typography>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ textAlign: 'center', marginBottom: '30px' }}>
          <SearchBar
            label="Search for apartments"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <FormControl fullWidth margin="normal" sx={{ width: '80%', marginTop: '20px' }}>
            <CustomInputLabel>Number of Items</CustomInputLabel>
            <CustomSelect
              value={itemsToShow}
              onChange={(e) => setItemsToShow(e.target.value)}
              label="Number of Items"
            >
              {[5, 10, 15, 20].map((num) => (
                <CustomMenuItem key={num} value={num}>
                  {num}
                </CustomMenuItem>
              ))}
            </CustomSelect>
          </FormControl>
          <div style={{ marginTop: '20px' }}>
            <StyledButton variant="contained" type="submit" disabled={loading}>
              Search
            </StyledButton>
          </div>
        </form>

        {loading && <Typography variant="body1" align="center">Loading...</Typography>}
        {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}

        {results.length > 0 && (
          <Grid container spacing={4}>
            {results.map((item, index) => (
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
                      image={item.image_url || 'https://via.placeholder.com/400x200'}
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
                        {item.property_type} in {item.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.bedrooms} Bedrooms, {item.bathrooms} Bathrooms
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        Price: ${item.price.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amenities: {item.amenities}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Similarity: {item.similarity.toFixed(2)}
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
};

export default App;
