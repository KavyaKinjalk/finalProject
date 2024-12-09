const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

async function copyImages() {
  const sourceDir = path.join(__dirname, 'images');
  const targetDir = path.join(__dirname, '..', 'uploads');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    const files = fs.readdirSync(sourceDir);
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      fs.copyFileSync(sourcePath, targetPath);
    }
    console.log('Images copied successfully');
  } catch (error) {
    console.error('Error copying images:', error);
    process.exit(1);
  }
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const coolStuffSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePath: String,
  location: {
    lat: Number,
    lng: Number,
  },
});

const CoolStuff = mongoose.model('CoolStuff', coolStuffSchema);

const coolItems = [
    {
        title: 'The Wave, Arizona, USA',
        description: 'A stunning sandstone rock formation with wave-like patterns.',
        imagePath: '/uploads/the_wave.webp',
        location: {
            lat: 36.9951,
            lng: -112.0069,
        },
    },
    {
        title: 'Rainbow Eucalyptus Trees, Maui, Hawaii',
        description: 'Trees with multicolored bark that resembles a rainbow.',
        imagePath: '/uploads/rainbow_eucalyptus.webp',
        location: {
            lat: 20.7984,
            lng: -156.3319,
        },
    },
    {
        title: 'Socotra Island, Yemen',
        description: "The most isolated continental (not volcanic) island. It is extremely unique to many flora and fauna, and its Dragon's Blood  (resin of the Dracaena cinnabari tree).",
        imagePath: '/uploads/socotra.webp',
        location: {
            lat: 12.4634,
            lng: 53.8235,
        },
    },
    {
        title: 'Chocolate Hills, Bohol, Philippines',
        description: 'Over 1,200 hills that turn brown during the dry season.',
        imagePath: '/uploads/chocolate_hills.webp',
        location: {
            lat: 9.8290,
            lng: 124.1435,
        },
    },
    {
        title: 'Giant’s Causeway, Northern Ireland',
        description: 'About 40,000 interlocking basalt columns formed by volcanic activity.',
        imagePath: '/uploads/giants_causeway.webp',
        location: {
            lat: 55.2408,
            lng: -6.5116,
        },
    },
    {
        title: 'Dead Vlei, Namib-Naukluft Park, Namibia',
        description: 'A white clay pan filled with ancient, dead camel thorn trees.',
        imagePath: '/uploads/dead_vlei.webp',
        location: {
            lat: -24.7408,
            lng: 15.2938,
        },
    },
    {
        title: 'Lake Natron, Tanzania',
        description: 'A salt lake that turns animals into calcified statues due to high alkalinity.',
        imagePath: '/uploads/lake_natron.webp',
        location: {
            lat: -2.4167,
            lng: 36.0000,
        },
    },
    {
        title: 'Red Beach, Panjin, China',
        description: 'A beach covered with red Sueda salsa plants.',
        imagePath: '/uploads/red_beach.webp',
        location: {
            lat: 40.9000,
            lng: 122.0500,
        },
    },
    {
        title: 'Glowworm Caves, Waitomo, New Zealand',
        description: 'Caves illuminated by bioluminescent glowworms.',
        imagePath: '/uploads/glowworm_caves.webp',
        location: {
            lat: -38.2605,
            lng: 175.1035,
        },
    },
    {
        title: 'Stone Forest, Madagascar',
        description: 'Sharp limestone formations resembling a forest made of stone.',
        imagePath: '/uploads/stone_forest.webp',
        location: {
            lat: -18.7718,
            lng: 44.7191,
        },
    },
    {
        title: 'Cool Rock',
        description: 'Cool rock I found somewhere at UMD, College Park.',
        imagePath: '/uploads/coolrock.png',
        location: {
            lat: 38.988201, 
            lng: -76.940679,
        },
    },
    {
        title: 'Park in India',
        description: 'I live next to this park in India.',
        imagePath: '/uploads/parkinindia.png',
        location: {
            lat: 28.5258,
            lng: 77.1587,
        },
    },
];

async function insertFakeData() {
  try {
    await copyImages();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await CoolStuff.insertMany(coolItems);
    console.log('Fake data inserted successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting fake data:', error);
    mongoose.connection.close();
  }
}

insertFakeData();

