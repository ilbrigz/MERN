const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation
const validateProfileInput = require('../../validation/profile.js')
const validateExperienceInput = require('../../validation/experience.js');
const validateEducationInput = require('../../validation/education.js');

// Load profile model
const Profile = require('../../models/Profile');
// Load user model
const User = require('../../models/User')

//@route 	GET api/profile/test
//@desc 	test profile route
//@access 	Public
router.get('/test', (req, res) => res.json({msg: 'profile there'}));


//@route 	GET api/profile
//@desc 	Get current users profile
//@access 	Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	  Profile.findOne({ user: req.user.id })
	  //insert from user collection the name and avatar
     	.populate('user', ['name', 'avatar'])
		.then(profile => {
		if(!profile) {
			errors.noprofile = "There is no profile for this user";
			return res.status(404).json(errors);
		}
		res.json(profile);
	})
	.catch(err => res.status(404).json(err));
});

// @route 	get api/profile/all
// @desc 	get all profile
// @access 	Public

router.get('/all', (req, res) => {
	const errors = {};
	Profile.find()
	.populate('user', ['name', 'avatar'])
	.then( profiles => {
		if(!profiles) {
			errors.noprofile = "There are no profiles";
			 return res.status(404).json(errors);
		}

		return res.json(profiles);
	})
	.catch(err => res.status(404).json({profile: 'There are no profiles'}));
});

// @route 	get api/profile/handle/:handle
// @desc 	get profile by handle
// @access 	Public

router.get('/handle/:handle', (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
	.populate('user', ['name', 'avatar'])
	.then( profile => {
		if(!profile) {
			errors.noprofile = "There is no profile for this user";
			 return res.status(404).json(errors);
		}

		return res.json(profile);
	})
	.catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});


// @route 	get api/profile/user/:user_id
// @desc 	get profile by user ID
// @access 	Public

router.get('/user/:user_id', (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
	.populate('user', ['name', 'avatar'])
	.then( profile => {
		if(!profile) {
			errors.noprofile = "There is no profile for this user";
			 return res.status(404).json(errors);
		}

		return res.json(profile);
	})
	.catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

// @route 	post api/profile
// @desc 	Create or edit user profile
// @access 	Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors,isValid } = validateProfileInput(req.body);

	//check validation result
	if(!isValid) {
		return res.status(400).json(errors);
	}
	// get the fileds
	const profileFields = {};
	profileFields.user = req.user.id;
	if(req.body.handle) profileFields.handle = req.body.handle;
	if(req.body.company) profileFields.company = req.body.company;
	if(req.body.website) profileFields.website = req.body.website;
	if(req.body.location) profileFields.location = req.body.location;
	if(req.body.bio) profileFields.bio = req.body.bio;
	if (req.body.status) profileFields.status = req.body.status;
	if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
	//skills -split into an array
	if(typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',');
	}
	// social
	profileFields.social = {};

	if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
	if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
	if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
	if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
	if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

	Profile.findOne({user:req.user.id})
		.then(profile => {
			if(profile) {
				// update
				Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{new: true})
				.then(profile => res.json(profile))
			} else {
				//check if handle exist
				Profile.findOne({ handle: profileFields.hande }).then( profile => {
					if(profile) {
						errors.handle = 'That handle already exist';
						 return res.status(400).json(errors);
					}

					// Save Profile
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}

		});
	}
);


// @route 	POST api/profile/experience
// @desc 	Add experience to profile
// @access 	Private

router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
	const { errors,isValid } = validateExperienceInput(req.body);
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
	//check validation result
	if(!isValid) {

		return res.status(400).json(errors);
	}
console.log(req.user.id);
	Profile.findOne({ user: req.user.id})
	.then(profile => {
		console.log(profile,'found');
		const newExp = {
			title: req.body.title,
			company: req.body.company,
			location: req.body.location,
			from: req.body.from,
			to: req.body.to,
			current: req.body.current,
			desciption: req.body.desciption
		}
		// Add to exp array
		profile.experience.unshift(newExp);
		profile.save().then(profile => res.json(profile));
	}). catch(err => {
		console.log(err);
	});
});


// @route 	POST api/profile/education
// @desc 	Add education to profile
// @access 	Private

router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
	const { errors,isValid } = validateEducationInput(req.body);
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
	//check validation result
	if(!isValid) {

		return res.status(400).json(errors);
	}
console.log(req.user.id);
	Profile.findOne({ user: req.user.id})
	.then(profile => {
		const newEdu = {
			school: req.body.school,
			degree: req.body.degree,
			fieldofstudy: req.body.fieldofstudy,
			from: req.body.from,
			to: req.body.to,
			current: req.body.current,
			desciption: req.body.desciption
		}
		// Add to exp array
		profile.education.unshift(newEdu);
		profile.save().then(profile => res.json(profile));
	}).catch(err => console.log(err))})
;

// @route 	DELETE api/profile/experience/:exp_id
// @desc 	Delete experience from profile
// @access 	Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {

	Profile.findOne({ user: req.user.id})
	.then(profile => {
		//Get remove index
		const removeIndex = profile.experience
		.map(item => item.id)
		.indexOf(req.params.exp_9id);

		//splice our of array
		profile.experience.splice(removeIndex, 1);
		//save
		profile.save().then(profile => res.json(profile));
	}).catch(err => res.status(404).json(err));

});

// @route 	DELETE api/profile/education/:edu_id
// @desc 	Delete education from profile
// @access 	Private

router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {

	Profile.findOne({ user: req.user.id})
	.then(profile => {
		//Get remove index
		const removeIndex = profile.education
		.map(item => item.id)
		.indexOf(req.params.edu_id);

		//splice our of array
		profile.education.splice(removeIndex, 1);
		//save
		profile.save().then(profile => res.json(profile));
	}).catch(err => res.status(404).json(err));

});
module.exports = router;