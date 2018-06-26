// for validating data before processing login
const Validator = require('validator');
const isEmpty = require('./is-empty');
// validator.js
module.exports = function validateLoginInput(data) {
	let errors = {};
	// assign empty string value to data obj key if not provided ( validator only validates string)
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	// email checking
	if(!Validator.isEmail(data.email)) {// if it does NOT passes
		errors.email = 'Email is invalid';
	}
	if(Validator.isEmpty(data.email)) {// check if email is empty
		errors.email = 'Email field is required'// this needs to follow the email is invalid
												// so that if no email is sent it will assisng this will be the final value of the errors.email
	}
	// password checking
	if(Validator.isEmpty(data.password)) {// check if password is empty
		errors.password = 'Password field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}