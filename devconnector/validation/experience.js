// for validating data before processing login
const Validator = require('validator');
const isEmpty = require('./is-empty');
// validator.js
module.exports = function validateExperienceInput(data) {
	let errors = {};
	// assign empty string value to data obj key if not provided ( validator only validates string)
	data.title = !isEmpty(data.title) ? data.title : '';
	data.company = !isEmpty(data.company) ? data.company : '';
	data.from = !isEmpty(data.from) ? data.from : '';
	console.log(data);

	// email checking
	if(Validator.isEmpty(data.title)) {// if it does NOT passes
		errors.title = 'Job title field is required';
	}
	if(Validator.isEmpty(data.company)) {// if it does NOT passes
		errors.company = 'Company field is required';
	}

	if(Validator.isEmpty(data.from)) {// if it does NOT passes
		errors.from = 'From date field is required';
	}


	return {
		errors,
		isValid: isEmpty(errors)
	}
}