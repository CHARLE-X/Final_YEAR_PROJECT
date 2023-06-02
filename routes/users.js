const express = require('express'),
// User = require("../models/Users"),
 app = express();
//  router = express.Router();
 const bcrypt = require('bcryptjs');
const { Router } = require('express');
 const nodemailer = require('nodemailer');
 require('dotenv').config(); 
 const passport = require('passport');
const router = require('.');
 let connection=require("../database")


 router.use(express.static('public'))

 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL,

        pass:process.env.PASSWORD
    }

});


 router.get('/register', (req,res)=>{
    res.render("register")
    
})
//  router.get('/dashboard', (req,res)=>{
//     // var test_type = ("malaria")
//      connection.query('SELECT * FROM patient', function(err,rows)
//      {
// rows.forEach(function (row) {
//     // console.log(rows.email)  
      
//         console.log(row)
      
//       var user_email = row.email  
//       var user_weight= row.weight
//       var user_id= row.id
//       var user_blood_group= row.blood_group
//       var user_phone_no= row.phone_no
//       var user_gender= row.gender
//       var user_test_type= row.test_type
//       var user_date_appointment= row.date_appointment
//       var user_fullname = row.fullname
     
      
        //   res.render("dashboard",{
        //       rows: user_fullname,
        //       id: user_id,
        //       weight:user_weight,
        //       blood_group:  user_blood_group,
        //       phone_no: user_phone_no,
        //       gender: user_gender,
        //       test_type:user_test_type,
        //       date_appointment:user_date_appointment,
        //       email:user_email





    //       })
    //   })
    // })
//  })


router.get('/doc_reg', (req,res)=>{
    res.render("doc_reg")
})


router.get('/login', (req,res)=>{
    res.render("login")
})
// router.post("/register", (req,res)=>{
//     const {fullname, email, password, confirm_password,}= req.body;
//     let errors = [];
 
    
//     if(!fullname || !email || !password || !confirm_password){
//         errors.push({msg: "Please fill in all fields"})
//     }
 
//     if(password !== confirm_password){
//         errors.push({msg:"Passwords do not match"})
//     }
 
//     if(password< 6){
//         errors.push({msg:"Password must not be less than six characters"})
//     }
 
//     if(errors.length>0){
//      res.render('register',{
//          errors,
//          fullname,
//          email,
//          password,
//          confirm_password
//      });
//     }else{
//         //Validation passed
//         // patience.findOne({email:email})
//         // .then(user =>{
//         //     if(user){
//         //         //User exists
//         //         errors.push({msg:'Email is already registered'})
//         //         res.render('register',{
//         //          errors,
//         //          fullname,
//         //          email,
//         //          password,
//         //          confirm_password
//         //      });
 
//         //     }else{
 
//             //  const newUser = new User({fullname, email, password});
            
//              //Hash Password
 
//              bcrypt.genSalt(10, (err,salt)=>
//                  bcrypt.hash(newUser.password, salt, (err,hash)=>{
//                      if(err) throw err;
                  
//                      newUser.password = hash;

//                      connection.query('INSERT INTO patience SET ?', {fullname:fullname,   email:email, password:password, 
//                          confirm_password:confirm_password,}, (error, results) =>{
//                             if(error){
//                                 console.log(error);
//                             }else{
//                                 console.log(results)
//                                 return res.redirect('login')
//                             }
//                         })
                     
                     
                    
 
                    
//              }))
 
//             }
//         // });
//     }   
//  })
 // login handle

 router.post("/register", (req,res)=>{
      let error= [];
      const {fullname, email, gender, weight, blood_group, phone_no, date_appointment, test_type} = req.body
      let mailOptions = {
        from:'testjohn129@gmail.com',
        to:email,
        subject: 'Testing my email service',
        html: "<p>Hello " + fullname + " " + email +", We are pleased to inform you that the date of appointment is <b>"+date_appointment+"and the type of test selcted  is "+ test_type +"</b> was succesful. <br> "+
        
        "Please endavour to make it avalaible on the date of appointment thank you <h2>"+ 
        "Please note that failure to be present on the actuall date will result as a loss of sechulded time. <br>"
    }
    
         
      //check if user exist
      connection.query('SELECT * FROM patient WHERE email = ?', [email], function(err,rows){

        if(err){
            console.log(err)
        }else{
            if(rows.length>0){
                return res.render('register',{
                    error: 'that user already exist'
                })
            }
            // if(weight.length<0){
            //     return res.render('register',{
            //         error: "Include Weight below"
            //     })
            // }
            if(blood_group<0){
                return res.render('register',{
                    error: "Include blood_group below"
                })
            }
            if(phone_no<=11){
                return res.render('register',{
                    error: "Invalid Phone Number"
                })
            }
            if(!date_appointment){
                return res.render('register',{
                    error: "Insert date"
                })
            }
            // if(date_appointment<){

            // }
            console.log(date_appointment)

           
                connection.query('INSERT INTO patient SET ?', {fullname:fullname,  email:email, gender:gender, weight:weight, blood_group:blood_group, phone_no:phone_no, date_appointment:date_appointment, test_type}, (error, results) =>{
                        if(error){
                            console.log(error);
                        }else{

                             transporter.sendMail(mailOptions, function(err, data){
                         if(err){
                            console.log('There was an error sending the email.', err)
                    
                        }else{
                            console.log('email sent');
                            // res.redirect('appointment_dashboard');
                            res.render('appointment_dashboard',{
                                email:email,
                                fullname:fullname, 
                                gender:gender,
                                test_type:test_type,
                                date_appointment:date_appointment
                            })
                            }
                    })
                            console.log(results)
                            
                        }
                    })
                    
           

            
           

        }
      } )    

 })


 router.post("/doc_reg", (req,res)=>{ 
    let error= [];
    const {fullname, email, password, password2} = req.body
       
    //check if user exist
    connection.query('SELECT * FROM doctor WHERE email = ?', [email], function(err,rows){

      if(err){
          console.log(err)
      }else{
          if(rows.length>0){
              return res.render('doc_reg',{
                  error: 'that user already exist'
              })
          }
          if(password.length<6){
              return res.render('doc_reg',{
                  error: "The password is less than 6"
              })
         }
          if(password2 !==password){
              return res.render('doc_reg',{
                  error: "The password don't match"
              })
          }

          bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(password, salt, (err, hash) => {
              if(err) throw err;

              let password = hash;
              // var dated= new Date(); 234(0)9156076275
      // var date = dated.toISOString().slice(0,10)
          
              connection.query('INSERT INTO doctor SET ?', {fullname:fullname,  email:email,password:password, confirm_password:password2}, (error, results) =>{
                      if(error){
                          console.log(error);
                      }else{
                          console.log(results)
                          return res.redirect('login')
                      }
                  })
                  // transporter.sendMail(mailOptions, function(err, data){
                  //     if(err){
                  //         console.log('There was an error sending the email.', err)
                  
                  //     }else{
                  //         console.log('email sent');
                  //         }
                  // })
         

          
          }))   

      }
    } )    

})


// router.post('/login', (req,res)=>{
//     var email =req.body.email;
//     var password = req.body.password
//       console.log(password)
//     return
// })












router.post('/login', (req,res)=>{
var email = req.body.email;
var password = req.body.password;
 var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    //console.log(results)
    connection.query('SELECT * FROM patient WHERE date_appointment = ?', [date], function(err,results)  
    {    
connection.query('SELECT * FROM doctor WHERE email = ?', [email], function(err,rows)
            {

                // console.log(date)  
                 
                if(rows.length<= 0){
                    
                 return res.render("login",{
                error: "Email does not exist"
     
         })
        
     }else{
    
       
     
        
           res.render("dashboard",{
                  rows:rows,
                  results:results
                
              })
              
          
    
        };
  })

})
})




//"SELECT name, address FROM customers"





//   router.post('/login', (req,res,next)=>{
//       passport.authenticate('local',{
//           successRedirect:'/dashboard',
//           failureRedirect: '/users/login',
//           failureFlash:true
//       })(req,res,next);
//       req.flash('success_msg', 'You are logged in')
//   });

 //logout hanbdle

 router.get('/logout',(req,res)=>{
     req.logout();
     req.flash('success_msg', 'you are logged out');
     res.redirect('/users/login');
 })


 router.get('/appointment_dashboard', (req,res)=>{
    // var email = req.body.email;
    connection.query('SELECT * FROM patient WHERE email = ?',  [email],function(err,rows)
    {
       if(err){
        console.log(err)
       }else{
        rows.forEach(function (row) {
            console.log(row)
        var user_email = row.email;
        var user_fullname = row.fullname;
        var user_gender = row.gender;
        var user_test_type = row.test_type;
        var user_date = row.date;
   res.render('appointment_dashboard',{
       fullname:user_fullname, 
       email:user_email,
       gender:user_gender,
       test_type:user_test_type,
       date:user_date
    })
}
)};
})
})


   
    // res.render('appointment_dashboard')

// router.post('/appointment_dashboard', (req,res)=>{
//     var email = req.body.email;
//     var fullname = req.body.fullname;
//     var gender = req.body.gender;
//     var test_type = req.body.test_type;
//     var date = req.body.date;
//     connection.query('SELECT * FROM patient WHERE email = ?', [email], function(err,rows)
//                 {
          
//                res.render('appointment_dashboard',{
//                    fullname,
//                    email,
//                    gender,
//                    test_type,
//                    date
//                })
//        })

router.get('/collect_sample/:p_id', (req,res)=>{
    
   
    var patient_id = req.params
    const sample_id = Object.values(JSON.parse(JSON.stringify(patient_id)));
   
    connection.query('SELECT * FROM patient WHERE p_id = ?',  [sample_id],function(err,rows)
    {
        
        rows.forEach(function(row){
            var test_type = row.test_type 
        
    res.render('test.ejs',{
             sample_id,
             test_type            
        })
     })
      })
    })


router.post('/collect_sample', (req,res)=>{

    router.use(express.static('public'))
        var specimen = req.body.specimen;
        var p_id = req.body.p_id;       
        var test_type = req.body.test_type;
        var doc_id = req.body.doc_id;
        
        
         
         connection.query('INSERT INTO sample SET ?', {p_id:p_id,  doc_id:doc_id,specimen:specimen, test_type:test_type}, (error, results) =>{
        
            if(error){
                console.log(error);
            }else{
                connection.query('SELECT * FROM sample WHERE p_id = ?', [p_id], function(err,rows)
{
       
           

                console.log(rows)
                res.render('result.ejs',{
                            rows:rows
                })
        

            }) 
            }
        })

})  

// router.get('/result', (req,res)=>{
//     res.render("result.ejs")
// })

router.post('/result', (req,res)=>{
    var sample_id = req.body.sample_id;
    var status = req.body.status;
    var test_description = req.body.test_description;
  
    connection.query('INSERT INTO result SET ?', {sample_id:sample_id,status:status, test_description:test_description}, (error, results) =>{
        
       

        if(error){
            console.log(error);
        }else{

            connection.query('SELECT * FROM sample WHERE sample_id = ?', [sample_id], function(err,rows){
                rows.forEach(function(row){
                    var test_type= row.test_type 

                    connection.query('SELECT * FROM patient WHERE test_type = ?', [test_type], function(err,rows){
                        rows.forEach(function(row){
                            var email= row.email 
                            var fullname = row.fullname;
                            var date_appointment = row.date_appointment

                            let mailOptions = {
                                from:'testjohn129@gmail.com',
                                to:email,
                                subject: 'RESULT',
                                html: "<p>Hello " + fullname + " " + email +", The breakdown of the result conducted on <b>"+date_appointment+"and the type of test selcted  "+ test_type +"</b> The RESULT. <br> "+
                                
                                status+ ", " + "<br>Details of the test <br>"+ test_description 
                                
                            }
                            transporter.sendMail(mailOptions, function(err, data){
                                if(err){
                                   console.log('There was an error sending the email.', err)
                           
                               }else{
                                   console.log('email sent');
                                   res.redirect('result')
                                   }
                           })
                        
                        })
                })

            })
        })
          

           
                   
                   
               }
        })
    })

    router.get('/patient',(req,res)=>{
        var dated= new Date();
        var date = dated.toISOString().slice(0,10)
        
        connection.query('SELECT * FROM patient WHERE date_appointment = ?', [date], function(err,results)
        {
       res.render("patient",{
        results:results
       })

    })
    })
   
    router.post('/login', (req,res)=>{
        var email = req.body.email;
        var password = req.body.password;
        // var today = new Date();
        //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
       
        
       
            //console.log(results)
                
        connection.query('SELECT * FROM doctor WHERE email = ?', [email], function(err,rows)
                    {
        
                        // console.log(date)  
                         
                        if(rows.length<= 0){
                            
                         return res.render("login",{
                        error: "Email does not exist"
             
                 })
                
             }else{
            
               
             
                
                   res.render("dashboard",{
                          rows:rows,
                          
                      })
                      
                  
            
                };
          })
        
        })
        
      
      
    
    
    
    
    
 router.get('/dashboard', (req,res)=>{

          var no =2
        
          connection.query('SELECT * FROM doctor WHERE doc_id = ?', [no], function(err,rows)
          {

               res.render("dashboard",{
                rows:rows,
              
            })
            
        })   
  
      




    })

    router.post('/search', (req,res)=>{

      var search =req.body.search
      
        connection.query('SELECT * FROM patient WHERE email = ?', [search], function(err,results)
        {

             res.render("patient",{
              results:results,
            
          })
          
      })   

    




  })
         


  
module.exports=router
