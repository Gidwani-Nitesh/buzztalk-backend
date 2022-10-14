const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session")
const cors = require('cors');
const app = express();



dotenv.config({path:'./config.env'});
const port = Number(process.env.PORT||3000);
require('./database/mongoconnection');

app.use(cookieParser());
app.use(express.json());
app.use(
    cookieSession({
      secret: 'yourSecret',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      httpOnly: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
    }),
  );
  
  app.enable('trust proxy');
  
  app.use(
    cors({
      credentials: true,
      origin: 'https://fantastic-pie-4220cf.netlify.app',
    }),
  );
app.use(require('./routing/authentication'));
app.get('/blogs',(req,res)=>{
    res.send("hello from blogs")
});
app.listen(port, function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", port);
})
