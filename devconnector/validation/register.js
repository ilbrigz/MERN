// for validating data before processing registration

const Validator = require('validator');
const isEmpty = require('./is-empty');
// validator.js
module.exports = function validateRegisterInput(data) {
	let errors = {};
	// assign empty string value to data obj key if not provided ( validator only validates string)
	data.name = !isEmpty(data.name) ? data.name : '';// will create and empty string
													// in case name is not sent
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	// name checking
	if(!Validator.isLength(data.name, { min: 2, max: 30})) { // if it does NOT passes
		errors.name = 'Name must be between 2 and 30 characters';
	}
	if(Validator.isEmpty(data.name)) {// check if name is empty
		errors.name = 'Name field is required'
	}
	// email checking
	if(!Validator.isEmail(data.email)) {// if it does NOT passes
		errors.email = 'Email is invalid';
	}
	if(Validator.isEmpty(data.email)) {// check if email is empty
		errors.email = 'Email field is required'
	}
	// password checking
	if(!Validator.isLength(data.password, {min: 6, max: 30})) {
		errors.password = 'Passwords must be at least 6 characters';
	}
	if(Validator.isEmpty(data.password)) {// check if password is empty
		errors.password = 'Password field is required'
	}
	//password 2
	if(Validator.isEmpty(data.password2)) {// check if password2 is empty
		errors.password2 = 'Confirm password field is required'
	}
	if(!Validator.equals(data.password2, data.password)) {// check if password2 is empty
		errors.password2 = 'Passwords must match'
	}



	return {
		errors,
		isValid: isEmpty(errors)
	}
}