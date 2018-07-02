// for validating data before processing Profile
const Validator = require('validator');
const isEmpty = require('./is-empty');
// validator.js
module.exports = function validateProfileInput(data) {
	let errors = {};
	// assign empty string value to data obj key if not provided ( validator only validates string)
	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';

	// email checking
	if(!Validator.isLength(data.handle, { min: 2, max: 40})) {// if it does NOT passes
		errors.handle = 'Handle needs to be between 2 and 40 characters';
	}

	if(Validator.isEmpty(data.handle)) {
		errors.handle = 'Profile handle is required'
	}

	if(Validator.isEmpty(data.status)) {
		errors.status = 'Status field is required'
	}

	if(Validator.isEmpty(data.skills)) {
		errors.skills = 'Skills field is required'
	}

	if(!isEmpty(data.website)){
		if(!Validator.isURL(data.website)) {
			errors.website = "Not a valid URL";
		}
	}
	if(!isEmpty(data.youtube)){
		if(!Validator.isURL(data.youtube)) {
			errors.youtube = "Not a valid URL";
		}
	}
	if(!isEmpty(data.twitter)){
		if(!Validator.isURL(data.twitter)) {
			errors.twitter = "Not a valid URL";
		}
	}
	if(!isEmpty(data.facebook)){
		if(!Validator.isURL(data.facebook)) {
			errors.facebook = "Not a valid URL";
		}
	}
	if(!isEmpty(data.linkedin)){
		if(!Validator.isURL(data.linkedin)) {
			errors.linkedin = "Not a valid URL";
		}
	}
	if(!isEmpty(data.instagram)){
		if(!Validator.isURL(data.instagram)) {
			errors.instagram = "Not a valid URL";
		}
	}


	return {
		errors,
		isValid: isEmpty(errors)
	}
}