import AppointmentModel from '../Models/Appointments.js';
import StoreModel from '../Models/Stores.js';
import ServiceModel from '../Models/Services.js';
import AppointmentsModel from '../Models/Appointments.js';

const createAppointment = async (req, res) => {
    try {
        const { customerName, customerEmail, serviceIds, appointmentDate, appointmentTime, storeId } = req.body;

        if (!customerName || !customerEmail || !serviceIds || !appointmentDate || !storeId || !appointmentTime) {
            return res.status(400).send({ message: 'Required fields are missing' });
        }

        const store = await StoreModel.findById(storeId);
        if (!store) {
            return res.status(404).send({ message: 'Store not found' });
        }

        // Validate each service ID
        const services = await ServiceModel.find({ _id: { $in: serviceIds }, store: storeId });
        if (services.length !== serviceIds.length) {
            return res.status(400).send({ message: 'One or more services are invalid or do not belong to the store' });
        }

        const newAppointment = new AppointmentModel({
            customerName,
            customerEmail,
            services: serviceIds,
            appointmentDate,
            appointmentTime,
            store: storeId
        });

        await newAppointment.save();

        res.status(201).send({ message: 'Appointment Created Successfully', appointment: newAppointment });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, message: 'Error in creating appointment' });
    }
};

// Edit Appointment
const editAppointment = async (req, res) => {
    try {
        const { _id } = req.params.id;
        const { customerName, customerEmail, services, appointmentDate, appointmentTime, store } = req.body;

        const updatedAppointment = await AppointmentsModel.findByIdAndUpdate(
            _id,
            {
                customerName,
                customerEmail,
                services,
                appointmentDate,
                appointmentTime,
                store
            },
            { new: true }
        );

        if (updatedAppointment) {
            res.status(200).send({ message: "Appointment Updated Successfully", appointment: updatedAppointment });
        } else {
            res.status(404).send({ message: "Appointment Not Found" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, message: 'Error in updating appointment' });
    }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
    try {
        const { _id } = req.params.id;

        const deletedAppointment = await AppointmentsModel.findByIdAndDelete(_id);

        if (deletedAppointment) {
            res.status(200).send({ message: "Appointment Deleted Successfully" });
        } else {
            res.status(404).send({ message: "Appointment Not Found" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, message: 'Error in deleting appointment' });
    }
};

const getAppointmentByStores= async(req,res)=>{
    try {
      const appointment = await AppointmentsModel.findById(req.params.id)
      if(appointment)
      res.status(200).send({message:"Stores Fetched successfully",
    appointments:appointment})
    else
    res.status(404).send({message:"No Appointments found"})
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({
        error: error.message,
        message: 'Error in getting appointments',
      });
    }
  }
  
  const getAppointmentByUser= async(req,res)=>{
    try {
      const { email } = req.body;
      const appointments = await AppointmentsModel.find({email})
      if(appointments.length > 0)
      res.status(200).send({message:"appointments Fetched successfully",
    appointment : appointments})
    else
    res.status(404).send({message:"No Appointments found"})
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({
        error: error.message,
        message: 'Error in getting appointments',
      });
    }
  }
export default {
    createAppointment,
    editAppointment,
    deleteAppointment,
    getAppointmentByStores,
    getAppointmentByUser,
};
