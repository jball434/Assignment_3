// import statements
const fs = require('fs').promises;
const express = require('express');
const app = express();

// Load JSON files
const ARTISTS = './artists.json';
const PAINTINGS = './paintings-nested.json';
const GALLERIES = './galleries.json';

// Variables to store the JSON data
let artistsData; 
let paintingsData; 
let galleriesData; 

// Read Artists Data
async function readArtistsData() {
  try {
    const data = await fs.readFile(ARTISTS);
    artistsData = JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
  }
}

// Read Paintings Data
async function readPaintingsData() {
  try {
    const data = await fs.readFile(PAINTINGS);
    paintingsData = JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
  }
}

// Read Galleries Data
async function readGalleriesData() {
  try {
    const data = await fs.readFile(GALLERIES);
    galleriesData = JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
  }
}


// Call the respective functions to load the data
readArtistsData();
readPaintingsData();
readGalleriesData();

// Middleware to parse JSON in incoming requests
app.use(express.json());

// Get all paintings
app.get('/api/paintings', (req, res) => {
  if(JSON.stringify(paintingsData).length > 0) {
  res.json(paintingsData);
  } else {
    return res.status(404).send('Data not found on the server.');
  }
});

// Get a specific painting
app.get('/api/painting/:id', (req, res) => {
  const id = req.params.id;
  const painting = paintingsData.find((painting) => painting.paintingID == id);

  if (!painting) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(painting);
});

// Get a specific gallery
app.get('/api/painting/gallery/:id', (req, res) => {
  const id = req.params.id;
  const painting = paintingsData.find((painting) => {
    return painting.gallery.galleryID == id;
  });

  if (!painting) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(painting);
});

// Get a specific painting matching the artist
app.get('/api/painting/artist/:id', (req, res) => {
  const id = req.params.id;
  const artist = paintingsData.find((painting) => {
    return painting.artist.artistID == id;
  });

  if (!artist) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(artist);
});

// Get the painting within the date range
app.get('/api/painting/year/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;

  const paintings = paintingsData.filter((painting) => {
    return painting.yearOfWork >= min && painting.yearOfWork <= max;
  });

  if (!paintings || paintings.length <= 0) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(paintings);
});

// Get the painting with title containing specific text
app.get('/api/painting/title/:text', (req, res) => {
  const text = req.params.text;
  const paintings = paintingsData.filter((painting) => {
    return (painting.title).toLowerCase().includes(text.toLowerCase());
  });

  if (!paintings || paintings.length <= 0) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(paintings);
});

// Get the painting with a specific color name
app.get('/api/painting/color/:name', (req, res) => {
  const name = req.params.name;
  const paintings = paintingsData.filter((painting) => {
    let arrayColor = painting.details.annotation.dominantColors;
    return arrayColor.some(element => element.web.toLowerCase() == name.toLowerCase() || element.name.toLowerCase() == name.toLowerCase());
  });

  if (!paintings || paintings.length <= 0) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(paintings);
});


// Get all artists
app.get('/artists', (req, res) => {
  res.json(artistsData);
});

// Get a specific artist
app.get('/api/artists/:country', (req, res) => {
  const country = req.params.country;
  const artists = artistsData.filter((artist) => {
    return artist.Nationality.toLowerCase() == country.toLowerCase();
  });

  if (!artists || artists.length <= 0) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(artists);
});

// Get all the galleries
app.get('/api/galleries', (req, res) => {
  if(JSON.stringify(galleriesData).length > 0) {
    res.json(galleriesData);
  } else {
    res.status(404).send('Data not found on the server.');
  }
});

// Get gallery by country
app.get('/api/galleries/:country', (req, res) => {
  const country = req.params.country;
  const galleries = galleriesData.filter((gal) => {
    return gal.gallery.country.toLowerCase() == country.toLowerCase();
  });

  if (!galleries || galleries.length <= 0) {
    res.status(404).send('Data not found on the server.');
  }

  res.json(galleries);
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
