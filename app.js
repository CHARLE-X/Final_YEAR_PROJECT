const express = require('express'),
 app = express();
 ejs = require("ejs"),
 nodemailer = require("nodemailer"),
  session =require("express-session"),
 flash = require("connect-flash"),
 expressLayouts = require('express-ejs-layouts');

 passport = require('passport'),
 session =require("express-session"),
 flash = require("connect-flash");
//  User = require("./models/Users");



 

// const require('./config/passport')(passport)
app.use(express.urlencoded({extended:true}));

//flash
app.use(flash());
//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

  }))


  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session())
// initials ejs
  app.set('view engine', 'ejs');
  //app.use(expressLayouts);

// seting gloabal variables

app.use(express.static('public'))

app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next()
})



  //routes
app.use('/',  require("./routes/index"))
app.use("/users", require("./routes/users"))

app.listen(2001, ()=>{
    console.log("Server statred at port 2001")
})
        
