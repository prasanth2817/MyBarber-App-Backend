import mongoose from "./index.js";

const AppointmentsSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true},
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    appointmentDate: { type: Date, required: [true, "Appointment Date is required"] },
    appointmentTime: { type: String, required: [true, "Appointment Time is required"] },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
},
{
    collection:"Appointments",
    versionKey : false
})

// added indexes for better performance
AppointmentsSchema.index({ storeId: 1, userId: 1, appointmentDate: 1 });

const AppointmentsModel = mongoose.model('Appointment',AppointmentsSchema)

export default AppointmentsModel