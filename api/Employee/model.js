import mongoose, {Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const EmployeeSchema = new Schema({
	name: { type: String, unique: true, required: true },
	salary: Number
});

EmployeeSchema.plugin(uniqueValidator);

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;