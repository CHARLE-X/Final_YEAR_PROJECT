const express = require('express');
const app = express();
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth')



router.get('/', (req,res)=>{
  res.render('welcome')

})
  router.get("/das", ensureAuthenticated,  (req,res)=>{
      
      res.render('dashboard')
      console.log(req.name)
  })
module.exports=router
