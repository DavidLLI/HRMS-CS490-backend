import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';
import moment from 'moment';

const specialAvailRouter = express.Router();

specialAvailRouter.get('/name/:name', getSpecialAvail);
specialAvailRouter.post('/name/:name', postSpecialAvail);
specialAvailRouter.delete('/name/:name', deleteSpecialAvail);

mongoose.connect('localhost:27017');

function getSpecialAvail(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		response.json(employee[0].specialAvail);
	});
}

function postSpecialAvail(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let updateSpecialAvail = request.body;
		let validationResult = validateSpecialAvail(updateSpecialAvail);
		if (!validationResult.result) {
			response.status(403).send({error: validationResult.message});
			return;
		}

		const currentSpecialAvail = employee[0].specialAvail;
		currentSpecialAvail[updateSpecialAvail.date] = currentSpecialAvail[updateSpecialAvail.date] || {};
		currentSpecialAvail[updateSpecialAvail.date].startTime = moment(updateSpecialAvail.time.startTime, 'HH:mm').format('HH:mm');
		currentSpecialAvail[updateSpecialAvail.date].endTime = moment(updateSpecialAvail.time.endTime, 'HH:mm').format('HH:mm');

		Employee.findOneAndUpdate({name: request.params.name}, {specialAvail: currentSpecialAvail}, (err) => {
			if (err) {
				return err;
			}
		});

		response.json({message: 'Special availability post successful'});

	});
}

function deleteSpecialAvail(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let deleteSpecialAvail = request.body;
		// Validate if the date format is correct
		if (deleteSpecialAvail.date === undefined || !moment(deleteSpecialAvail.date, 'YYYY-MM-DD', true).isValid()) {
			response.status(403).send({error: 'Date object type validation failed.'});
			return;
		}

		const currentSpecialAvail = employee[0].specialAvail;
		delete currentSpecialAvail[deleteSpecialAvail.date];
		
		Employee.findOneAndUpdate({name: request.params.name}, {specialAvail: currentSpecialAvail}, (err) => {
			if (err) {
				return err;
			}
		});

		response.json({message: 'Sepcial availability delete successful'});

	});
}

function validateSpecialAvail(avail) {
	let validationResult = {result: true, message: ''};

	// Check is the date format is correct
	if (avail.date === undefined || !moment(avail.date, 'YYYY-MM-DD', true).isValid()) {
		validationResult.result = false;
		validationResult.message = 'Date object type validation failed.';
	}

	let timeValidationResult = moment(avail.time.startTime, 'HH:mm').isValid() &&
								moment(avail.time.endTime, 'HH:mm').isValid();
	if (timeValidationResult === false) {
		validationResult.result = false;
		validationResult.message = 'Time validation failed';
	}

	return validationResult;
}

export default specialAvailRouter;