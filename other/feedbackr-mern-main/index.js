const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const env = require('dotenv').config()
require('./models/User');
require('./models/Survey');
require('./services/passport');

// mongoose.connect(keys.mongoURI);
const url = 'mongodb://localhost:27017/survey'
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{console.log('connected successfully')})
.catch(Error => {console.log(Error)})

const app = express();

//  You dont need bodyparcer, express now can handle itself
app.use(express.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

//  create a route handler
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  //  Express should serve up production assets
  app.use(express.static('client/build'));

  // Express to serve up index.html if route is not recognized
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT =  5000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
