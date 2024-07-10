import mongoose from "./index.js";

const AppointmentsSchema = new mongoose.Schema({
    customerName: { type: String, required: [true, "Customer Name is required"] },
    customerEmail: { type: String, required: [true, "Customer Email is required"] },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    appointmentDate: { type: Date, required: [true, "Appointment Date is required"] },
    appointmentTime: { type: String, required: [true, "Appointment Time is required"] },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
},
{
    collection:"Appointments",
    versionKey : false
})

const AppointmentsModel = mongoose.model('Appointment',AppointmentsSchema)

export default AppointmentsModel