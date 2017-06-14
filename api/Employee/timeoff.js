import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';
import moment from 'moment';

const timeoffRouter = express.Router();

timeoffRouter.get('/name/:name', getTimeoff);
timeoffRouter.post('/name/:name', postTimeoff);
timeoffRouter.delete('/name/:name', deleteTimeoff);

mongoose.connect('localhost:27017');

function getTimeoff(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		response.json(employee[0].timeoff);
	});
}

function postTimeoff(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let updateTimeoff = request.body;
		let validationResult = validateTimeoff(updateTimeoff);
		if (!validationResult.result) {
			response.status(403).send({error: validationResult.message});
			return;
		}

		const currentTimeoff = employee[0].timeoff;
		currentTimeoff[updateTimeoff.date] = currentTimeoff[updateTimeoff.date] || {};
		currentTimeoff[updateTimeoff.date].startTime = moment(updateTimeoff.time.startTime, 'HH:mm').format('HH:mm');
		currentTimeoff[updateTimeoff.date].endTime = moment(updateTimeoff.time.endTime, 'HH:mm').format('HH:mm');

		Employee.findOneAndUpdate({name: request.params.name}, {timeoff: currentTimeoff}, (err) => {
			if (err) {
				return err;
			}
		});

		response.json({message: 'Timeoff post successful'});

	});
}

function deleteTimeoff(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let deleteTimeoff = request.body;
		// Validate if the date format is correct
		if (deleteTimeoff.date === undefined || !moment(deleteTimeoff.date, 'YYYY-MM-DD', true).isValid()) {
			response.status(403).send({error: 'Date object type validation failed.'});
			return;
		}

		const currentTimeoff = employee[0].timeoff;
		delete currentTimeoff[deleteTimeoff.date];
		
		Employee.findOneAndUpdate({name: request.params.name}, {timeoff: currentTimeoff}, (err) => {
			if (err) {
				return err;
			}
		});

		response.json({message: 'Timeoff delete successful'});

	});
}

function validateTimeoff(avail) {
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

export default timeoffRouter;