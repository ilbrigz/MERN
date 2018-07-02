const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys')
//Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// load user model
const User = require('../../models/User');
//@route 	GET api/users/test
//@desc 	test users route
//@access 	Public

router.get('/test', (req, res) => res.json({msg: 'hi there'}));

//@route 	POST api/users/register
//@desc 	register users
//@access 	Public

router.post('/register', (req, res) => {
	// check for errors
	const { errors, isValid } = validateRegisterInput(req.body);
	//check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne( { email : req.body.email })// check if email already exist
	.then(user => {
		if(user) {
			errors.email = 'Email already exists';
			return res.status(400).json(errors);
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200',// size
				r: 'pg', // rating
				d: 'mm' //default
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err) throw(err);
					newUser.password = hash;
					newUser.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				})
			})
		}
	})
});

//@route 	GET api/users/login
//@desc 	login user / create JWT token
//@access 	Public

router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	//check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}
	console.log(req.body)
	const email = req.body.email;
	const password = req.body.password;
	// check if email exist
	User.findOne({ email })
	.then(user => {
		if(!user) {
			errors.email = 'User not found'; // add this error to erros obj
			return res.status(400).json(errors)
		}
		//check password
		bcrypt.compare(password, user.password)
		.then(isMatch => { //ismatch is a true or false value
		if(isMatch) {//creaing JWT Token here
			//user matchec
			const payload = {//create jwt payload
				id: user.id,
				name: user.name,
				avatar: user.avatar
			}
			//sign token
			// expires in seconds
			jwt.sign(payload,
			keys.secretOrKey,
			{expiresIn: 3600},
			(err, token) => {
				res.json({
					sucess:true,
					token: 'Bearer ' + token, // bearer protocol
				})
			});

			//user did not match
		} else {
			errors.password = 'Password incorrect' // add this error to erros obj
			return res.status(400).json(errors)
		}});
	})
});

//@route 	GET api/users/current
//@desc 	return current user
//@access 	private
router.get('/current',
	passport.authenticate('jwt',
	{session: false }),
		(req, res) => {
			res.json({
				id: req.user.id,
				name: req.user.name,
				email: req.user.email
			});
		});
module.exports = router;