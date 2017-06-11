import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';

const salaryRouter = express.Router();

mongoose.connect('localhost:27017');

salaryRouter.get('/', getSalary);

function getSalary(request, response) {
	response.send('salary get call received');
}

function postSalary(request, response) {
	const employee = new Employee();
	employee.name = request.body.name;
	employee.salary = request.body.salary;

	employee.save((err) => {
		if (err) {
			response.send(err);
		}

		respond.json({message: 'Employee created'})
	});
}

export default salaryRouter;