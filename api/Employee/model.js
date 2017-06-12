import mongoose, {Schema} from 'mongoose';

const EmployeeSchema = new Schema({
	name: { type: String, unique: true, required: true },
	salary: Number,
	gender: String
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;