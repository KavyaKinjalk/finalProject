const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');

dotenv.config();

const app = express();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Define schema for cool stuff
const CoolStuffSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePath: String,
  location: {
    lat: Number,
    lng: Number
  }
});

const CoolStuff = mongoose.model('CoolStuff', CoolStuffSchema); 

// Routes
app.get('/', async (req, res) => {
  const coolItems = await CoolStuff.find();
  res.render('index', { coolItems });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', upload.single('image'), async (req, res) => {
  const newCoolItem = new CoolStuff({
    title: req.body.title,
    description: req.body.description,
    imagePath: '/uploads/' + req.file.filename,
    location: {
      lat: req.body.lat,
      lng: req.body.lng
    }
  });
  await newCoolItem.save();
  res.redirect('/');
});

app.get('/confirmRemoveAll', (req, res) => {
  res.render('confirmRemoveAll');
});

app.post('/removeAll', async (req, res) => {
  const adminPassword = req.body.adminPassword;
  const correctPassword = 'somepassword';

  if (adminPassword !== correctPassword) {
    return res.status(403).send('Incorrect password.');
  }

  try {
    const items = await CoolStuff.find();

    for (const item of items) {
      if (item.imagePath) {
        const imagePath = path.join(__dirname, 'public', item.imagePath);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image file for ${item.title}:`, err);
          }
        });
      }
    }

    await CoolStuff.deleteMany({});

    res.redirect('/');
  } catch (error) {
    console.error('Error removing all items:', error);
    res.status(500).send('Error removing all items.');
  }
});

app.post('/remove/:id', async (req, res) => {
  try {
    const item = await CoolStuff.findById(req.params.id);
    if (item && item.imagePath) {
      const imagePath = path.join(__dirname, 'public', item.imagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image file for ${item.title}:`, err);
        }
      });
    }
    await CoolStuff.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});