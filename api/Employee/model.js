import mongoose, {Schema} from 'mongoose';

const dayModel = {startTime: '00:00', endTime: '00:00'};

const EmployeeSchema = new Schema({
	username: { type: String, required: true , unique: true} ,
	password: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String },
	salary: { type: Number, default: 0},
	availability: { type: Object, default: { 'Sunday': dayModel, 'Monday': dayModel, 'Tuesday': dayModel, 
											'Wednesday': dayModel, 'Thursday': dayModel, 
											'Friday': dayModel, 'Saturday': dayModel } 
				},
	specialAvail: { type: Object, default: {} },
	timeoff: { type: Object, default: {} },
	timeSheet: { type: Object, default: {} },
	startDate: { type: Date, default: '01/01/1970' },
	endDate: { type: Date, default: '01/01/1970' }
}, { minimize: false });

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;