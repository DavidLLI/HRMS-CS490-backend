import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';
import moment from 'moment';

const availRouter = express.Router();

mongoose.connect('localhost:27017');

availRouter.get('/name/:name', getAvailability);
availRouter.get('/name/:name/date/:date', getAvailabilityOnDate);
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

function getAvailabilityOnDate(request, response) {
	// Logic: Special availability override regular availability, and timeoff override special availability
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let date = request.params.date;
		// Validate if the date format is correct
		if (date === undefined || !moment(date, 'YYYY-MM-DD', true).isValid()) {
			response.status(403).send({error: 'Date object type validation failed.'});
			return;
		}

		if (employee[0].timeoff[date]) {
			response.json({type: 'timeoff', 
							startTime: employee[0].timeoff[date].startTime, 
							endTime: employee[0].timeoff[date].endTime
						});
		}
		else if (employee[0].specialAvail[date]) {
			response.json({type: 'special availability',
							startTime: employee[0].specialAvail[date].startTime,
							endTime: employee[0].specialAvail[date].endTime
						});
		}
		else {
			const dayName = moment(date, 'YYYY-MM-DD', true).format('dddd');
			response.json({type: 'regular availability',
							startTime:employee[0].availability[dayName].startTime,
							endTime: employee[0].availability[dayName].endTime
						});
		}
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
		let validationResult = availValidation(updateAvail);
		if (!validationResult.result) {
			response.status(403).send({error: validationResult.message});
			return;
		}

		_.forEach(updateAvail, (time, day) => {
			if (currentAvail[day]) {
				currentAvail[day] = time;
			}
		});
		Employee.findOneAndUpdate({name: request.params.name}, {availability: currentAvail}, (err) => {
			if (err) {
				return err;
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
			validationResult.message = 'Day validation failed';
			validationResult.result = false;
			return false;
		}

		let timeValidationResult = moment(time.startTime, 'HH:mm').isValid() && 
									moment(time.endTime, 'HH:mm').isValid();
		if (timeValidationResult === false) {
			validationResult.result = false;
			validationResult.message = 'Time validation failed';
			return false;
		}
		
	});
	return validationResult;
}

export default availRouter;