import AppointmentModel from '../Models/Appointments.js';
import StoreModel from '../Models/Stores.js';
import ServiceModel from '../Models/Services.js';

const createAppointment = async (req, res) => {
    try {
        const { userId, serviceIds, appointmentDate, appointmentTime, storeId } = req.body;

         // Check for required fields and track which ones are missing
         const missingFields = [];
         if (!userId) missingFields.push("userId");
         if (!serviceIds) missingFields.push("serviceIds");
         if (!appointmentDate) missingFields.push("appointmentDate");
         if (!appointmentTime) missingFields.push("appointmentTime");
         if (!storeId) missingFields.push("storeId");
 
         if (missingFields.length > 0) {
             return res.status(400).send({ 
                 message: `Missing required fields: ${missingFields.join(", ")}` 
             });
         }

         console.log("Creating appointment with the following data:", {
            userId,
            serviceIds,
            appointmentDate,
            appointmentTime,
            storeId
        });

         const serviceIdArray = Array.isArray(serviceIds) ? serviceIds : [serviceIds];

        const store = await StoreModel.findById(storeId);
        if (!store) {
            return res.status(404).send({ message: 'Store not found' });

//             const testServiceIds = ["671ee029f82cac9fb758d644"];
// const testStoreId = "671dfb86e59e43c0f03a6b7d";

// const services = await ServiceModel.find({ _id: { $in: testServiceIds }, store: testStoreId });
// console.log("Hardcoded services query result:", services);
        }

        // Validate that each service ID belongs to the given store
        const services = await ServiceModel.find({ _id: { $in: serviceIdArray }, storeId });
        console.log("Services found for store:", services);
console.log("Provided service IDs:", serviceIdArray);
        if (!services.length) {
            return res.status(400).send({ message: 'Invalid services or services do not belong to the store' });
        }


        // Check if all requested services exist and are valid for the store
        const validServiceIds = services.map(service => service._id.toString());

        console.log(validServiceIds);
        
        const invalidServices = serviceIdArray.filter(id => !validServiceIds.includes(id));

        if (invalidServices.length) {
            return res.status(400).send({ message: 'Some services are invalid or do not belong to the store', invalidServices });
        }

        // Proceed with appointment creation if all validations pass
        const newAppointment = new AppointmentModel({
            userId,
            serviceIds: serviceIdArray,
            appointmentDate,
            appointmentTime,
            storeId,
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

        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
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

        const deletedAppointment = await AppointmentModel.findByIdAndDelete(_id);

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
      const appointment = await AppointmentModel.findById(req.params.id)
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
      const appointments = await AppointmentModel.find({email})
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
