import express from 'express';
import employeeRouter from './Employee/employeeBase';

const router = express.Router();

router.use('/employee', employeeRouter);

router.get('/', (request, response) => {
	response.send('router heathcheck good');
});

export default router;