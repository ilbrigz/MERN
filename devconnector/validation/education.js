// for validating data before processing login
const Validator = require('validator');
const isEmpty = require('./is-empty');
// validator.js
module.exports = function validateExperienceInput(data) {
	let errors = {};
	// assign empty string value to data obj key if not provided ( validator only validates string)
	data.school = !isEmpty(data.school) ? data.school : '';
	data.degree = !isEmpty(data.degree) ? data.degree : '';
	data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
	data.from = !isEmpty(data.from) ? data.from : '';
	console.log(data);

	// email checking
	if(Validator.isEmpty(data.school)) {// if it does NOT passes
		errors.school = 'School field is required';
	}
	if(Validator.isEmpty(data.degree)) {// if it does NOT passes
		errors.degree = 'Degree field is required';
	}

	if(Validator.isEmpty(data.fieldofstudy)) {// if it does NOT passes
		errors.fieldofstudy = 'Fieldofstudy field is required';
	}

	if(Validator.isEmpty(data.from)) {// if it does NOT passes
		errors.from = 'From date field is required';
	}


	return {
		errors,
		isValid: isEmpty(errors)
	}
}