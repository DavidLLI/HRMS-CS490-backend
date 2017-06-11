import express from 'express';
import mongoose from 'mongoose';
import Employee from './model';
import salaryRouter from './salary';

const employeeRouter = express.Router();

employeeRouter.use('/salary', salaryRouter);

employeeRouter.get('/', getAllEmployees);
employeeRouter.get('/name/:name', getEmployeeByName);
employeeRouter.post('/', postEmployee);

mongoose.connect('localhost:27017');

function getEmployeeByName(request, response) {
	Employee.find({name: request.params.name}, (err, employee) => {
		if (err) {
			response.send(err);
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
	const employee = new Employee();
	employee.name = request.body.name;
	employee.salary = request.body.salary || 0;

	employee.save((err) => {
		if (err) {
			response.send(err);
			return;
		}

		response.json({message: 'Employee created'})
	});
}

export default employeeRouter;