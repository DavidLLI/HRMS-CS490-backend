import mongoose, {Schema} from 'mongoose';

const timeModel = {hour: 0, min: 0};
const dayModel = {startTime: timeModel, endTime: timeModel};

const EmployeeSchema = new Schema({
	name: { type: String, unique: true, required: true },
	salary: { type: Number, default: 0},
	availability: { type: Object, default: { 'Sunday': dayModel, 'Monday': dayModel, 'Tuesday': dayModel, 
											'Wednesday': dayModel, 'Thursday': dayModel, 
											'Friday': dayModel, 'Saturday': dayModel } 
				},
	specialAvail: { type: Object, default: {} },
	timeSheet: { type: Object, default: {} },
	startDate: { type: Date, default: '01/01/1970' },
	endDate: { type: Date, default: '01/01/1970' }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;