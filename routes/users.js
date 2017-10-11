const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

//register 

router.post('/register' , (req,res , next) => {
	// res.send("Register !");
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		contact: req.body.contact
	});

	User.addUser(newUser , (err,user)=>{
		if(err){
			res.json({
				success:false,
				msg: 'Failed to register user !'
			});
		}
		else{
			res.json({
				success: true,
				msg: 'User regitered !'
			});
		}
	});
});



//authenticate

router.post('/authenticate' , (req,res , next) => {
	// res.send("authenticate !");
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username , (err, user)=>{
		if(err) throw err;

		if(!user){
			return res.json({
				success:false,
				msg:'User not found !'
			});
		}

		// User.comparePassword(password , user.password , (err , isMatch)=>{
		// 	 if(err) throw err;
		// 	 console.log(isMatch);
		// 	 if(isMatch == true){
		// 	 	const token = jwt.sign(user, config.secret , {
		// 	 		expiresIn: 604800
		// 	 	});

		// 	 	res.json({
		// 	 		success:true,
		// 	 		token:'JWT :'+token,
		// 	 		user:{
		// 	 			id:user._id,
		// 	 			name:user.name,
		// 	 			username:user.username,
		// 	 			email:user.email,
		// 	 			contact:user.contact
		// 	 		}
		// 	 	});
		// 	 }
		// 	 else{
		// 	 	return res.json({
		// 	 		success:false,
		// 	 		msg:"Wrong password !"
		// 	 	});
		// 	 }
		// });

		if (user.password != password) {
        res.json({ success: false, msg: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
var token = jwt.sign({data:user}, config.secret, {
          expiresIn: 604800 	// expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          msg: 'Enjoy your token1!',
          token: token,
          user:{
			 			id:user._id,
			 			name:user.name,
			 			username:user.username,
			 			email:user.email,
			 			contact:user.contact
			 		}
        });
      }   
	});
});

//profile to be protected with auth token 


// router.get('/profile', passport.authenticate('jwt', { session: false }),
//     function(req, res) {
//     	if (err)
//     	{
//     		console.log("err");
//     	}
//     	else
//     	{
//     		console.log("ok");
//     	}
//     	res.send("response");
//         res.send(req.user.name);
//     }
// );

router.get('/profile',function(req,res,next){
	passport.authenticate('jwt',{session:false} , function(err,user,info){
		if(err){ return next(err);}
		if(!user){
			console.log('User not found 1! ');
			// return res.redirect('/register');
		}
		else{
			// console.log(user);
			        res.json({
						          success: true,
						          msg: 'You have entered profile successfully !',
								  user:{
									id:user._id,
									name:user.name,
									username:user.username,
									email:user.email,
									contact:user.contact
								}
						        });
			
		}
		
	})(req,res,next);
});







module.exports = router;