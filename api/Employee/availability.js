import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';

const availRouter = express.Router();

mongoose.connect('localhost:27017');

availRouter.get('/name/:name', getAvailability);
availRouter.post('/name/:name', postAvailabilty);

function getAvailability(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		response.json(employee[0].availability);
	});
}

function postAvailabilty(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		const currentAvail = employee[0].availability;
		const updateAvail = request.body;
		// Validation of updateAvail
		let validationResult = availValidation(updateAvail)
		if (!validationResult.result) {
			response.status(403).send({error: validationResult.message});
		}

		_.forEach(updateAvail, (time, day) => {
			if (currentAvail[day]) {
				currentAvail[day] = time;
			}
		});
		response.json({message: 'Availability post successful'});
	});
}

function availValidation(avail) {
	let validationResult = {result: true, message: ''};
	_.forEach(avail, (time, day) => {
		if (day !== 'Monday' &&
			day !== 'Tuesday' &&
			day !== 'Wednesday' &&
			day !== 'Thursday' &
			day !== 'Friday' &
			day !== 'Saturday' &&
			day !== 'Sunday') {
			validationResult.message = 'day validation failed';
			validationResult.result = false;
			return false;
		}

		if (!time.startTime || !time.endTime) {
			validationResult.message = 'start and end time validation failed';
			validationResult.result = false;
			return false;
		}

		if (time.startTime.hour === undefined || time.startTime.min === undefined || 
			time.endTime.hour === undefined || time.endTime.min === undefined) {
			validationResult.message = 'hour and min validation failed';
			validationResult.result = false;
			return false;
		}

		if (time.startTime.hour < 0 || time.startTime.hour >= 24) {
			validationResult.message = 'start time hour validation failed';
			validationResult.result = false;
			return false;
		}

		if (time.startTime.min < 0 || time.startTime.min >= 60) {
			validationResult.message = 'start time min validation failed';
			validationResult.result = false;
			return false;
		}

		if (time.endTime.hour < 0 || time.endTime.hour >= 24) {
			validationResult.message = 'end time hour validation failed';
			validationResult.result = false;
			return false;
		}

		if (time.endTime.min < 0 || time.endTime.min >= 60) {
			validationResult.message = 'end time min validation failed';
			validationResult.result = false;
			return false;
		}
		
	});
	return validationResult;
}

export default availRouter;