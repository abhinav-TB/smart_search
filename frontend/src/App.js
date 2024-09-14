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
  CardMedia
} from '@mui/material';

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
      console.log(sqlQuery)
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
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        House Listing Search
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Enter a search query like: "Find me a 3-bedroom house in New York under $500k with a garden."
      </Typography>
      <form onSubmit={handleSearch} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search for houses"
          variant="outlined"
          fullWidth
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Search
        </Button>
      </form>

      {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}

      {queryResults.length > 0 && (
        <Grid container spacing={4}>
          {queryResults.map((result, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  alt="House"
                  height="140"
                  image="https://via.placeholder.com/400x200" // Replace with actual images if available
                  title="House Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {result[1]} in {result[2]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result[3]} Bedrooms, {result[4]} Bathrooms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${result[5]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Amenities: {result[6]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default App;
