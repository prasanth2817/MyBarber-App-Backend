import AppointmentModel from "../Models/Appointments.js";
import StoreModel from "../Models/Stores.js";
import ServiceModel from "../Models/Services.js";

const createAppointment = async (req, res) => {
  try {
    const { userId, serviceIds, appointmentDate, appointmentTime, storeId } =
      req.body;

    // Check for required fields and track which ones are missing
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!serviceIds) missingFields.push("serviceIds");
    if (!appointmentDate) missingFields.push("appointmentDate");
    if (!appointmentTime) missingFields.push("appointmentTime");
    if (!storeId) missingFields.push("storeId");

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const serviceIdArray = Array.isArray(serviceIds)
      ? serviceIds
      : [serviceIds];

    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).send({ message: "Store not found" });
    }

    // Validate that each service ID belongs to the given store
    const services = await ServiceModel.find({
      _id: { $in: serviceIdArray },
      storeId,
    });
    if (!services.length) {
      return res
        .status(400)
        .send({
          message: "Invalid services or services do not belong to the store",
        });
    }

    // Proceed with appointment creation if all validations pass
    const newAppointment = new AppointmentModel({
      userId,
      serviceIds: serviceIdArray,
      appointmentDate,
      appointmentTime,
      storeId,
      status: "Confirmed",
    });

    await newAppointment.save();

    res
      .status(201)
      .send({
        message: "Appointment Created Successfully",
        appointment: newAppointment,
      });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ error: error.message, message: "Error in creating appointment" });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).send({ message: "Invalid status value" });
    }

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (updatedAppointment) {
      res
        .status(200)
        .send({
          message: "Appointment status updated successfully",
          appointment: updatedAppointment,
        });
    } else {
      res.status(404).send({ message: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        error: error.message,
        message: "Error in updating appointment status",
      });
  }
};

// Get confirmed appointments by user ID
const getConfirmedAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await AppointmentModel.find({
      userId,
      status: "Confirmed",
    });

    if (appointments.length > 0) {
      res
        .status(200)
        .send({
          message: "Confirmed appointments fetched successfully",
          appointments,
        });
    } else {
      res.status(404).send({ message: "No confirmed appointments found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ error: error.message, message: "Error in getting appointments" });
  }
};

// Edit Appointment
const editAppointment = async (req, res) => {
  try {
    const { _id } = req.params.id;
    const {
      customerName,
      customerEmail,
      services,
      appointmentDate,
      appointmentTime,
      store,
    } = req.body;

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      _id,
      {
        customerName,
        customerEmail,
        services,
        appointmentDate,
        appointmentTime,
        store,
      },
      { new: true }
    );

    if (updatedAppointment) {
      res
        .status(200)
        .send({
          message: "Appointment Updated Successfully",
          appointment: updatedAppointment,
        });
    } else {
      res.status(404).send({ message: "Appointment Not Found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ error: error.message, message: "Error in updating appointment" });
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
    console.error("Error:", error);
    res
      .status(500)
      .send({ error: error.message, message: "Error in deleting appointment" });
  }
};

const getAppointmentByStores = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findById(req.params.id);
    if (appointment)
      res
        .status(200)
        .send({
          message: "Stores Fetched successfully",
          appointments: appointment,
        });
    else res.status(404).send({ message: "No Appointments found" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).send({
      error: error.message,
      message: "Error in getting appointments",
    });
  }
};

const getAppointmentByUser = async (req, res) => {
    try {
      const userId = req.params.id;
      
      const appointments = await AppointmentModel.find({ userId: userId })
        .populate("storeId")
        .populate("serviceIds");
  
      if (appointments.length > 0) {
        res.status(200).send({
          message: "Appointments fetched successfully",
          appointments,
        });
      } else {
        res.status(404).send({ message: "No appointments found" });
      }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({
        error: error.message,
        message: "Error in getting appointments",
      });
    }
  };
  
export default {
  createAppointment,
  updateAppointmentStatus,
  getConfirmedAppointmentsByUser,
  editAppointment,
  deleteAppointment,
  getAppointmentByStores,
  getAppointmentByUser,
};
