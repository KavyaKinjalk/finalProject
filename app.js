const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

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

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});

