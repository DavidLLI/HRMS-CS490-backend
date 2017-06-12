import express from 'express';
import mongoose from 'mongoose';
import Employee from './model';
import availRouter from './availability';

const employeeRouter = express.Router();

employeeRouter.use('/availability', availRouter);

employeeRouter.get('/', getAllEmployees);
employeeRouter.get('/name/:name', getEmployeeByName);
employeeRouter.post('/', postEmployee);

mongoose.connect('localhost:27017');

function getEmployeeByName(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}

		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		response.json(employee);
	});
}

function getAllEmployees(request, response) {
	Employee.find((err, employee) => {
		if (err) {
			response.send(err);
			return;
		}

		response.json(employee);
	});
}

function postEmployee(request, response) {
	if (!request.body.name) {
		response.status(403).send({message: 'Employee name required'});
		return;
	}

	const nameQuery = {'name': request.body.name};

	Employee.findOneAndUpdate(nameQuery, request.body, {upsert: true}, (err) => {
		if (err) {
			response.send(err);
			return;
		}

		response.json({message: 'Employee created'})
	});
}

export default employeeRouter;