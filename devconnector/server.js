const express = require('express');//creating a server on this file
const mongoose = require('mongoose')//bring in mongoose
const logger = require('morgan');//logger
const passport = require('passport');




// importing the routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();

// body parser is not needed
// body parser middleware which is part of express
app.use(logger('dev')); // logging
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose
	.connect(db)
	.then(() => console.log('Mongodb Connected'))
	.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport confi
require('./config/passport.js')(passport)

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));


// to do: 04 profile api routes