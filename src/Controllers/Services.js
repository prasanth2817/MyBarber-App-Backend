import ServiceModel from "../Models/Services.js";
import StoreModel from "../Models/Stores.js";

const createService = async (req, res) => {
    try {
      const { name, price, duration, storeId } = req.body;
  
      // Validate if storeId is provided
      if (!storeId) {
        return res.status(400).send({ message: 'storeId is required' });
      }
  
      // Create the new service
      const newService = new ServiceModel({ name, price, duration, storeId });
      await newService.save();
  
      // Update the corresponding store with the new service
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res.status(404).send({ message: 'Store not found' });
      }
  
      // Ensure the services array is initialized properly
      if (!store.services) {
        store.services = [];
      }
  
      // Push the new service _id into the services array of the store
      store.services.push(newService._id);
      await store.save();
  
      res.status(201).send({ message: "Service Created Successfully", service: newService });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error: error.message, message: 'Error in creating service' });
    }
  };

  const editService = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, duration, store } = req.body;
  
      // Find the service by ID and update it
      const updatedService = await ServiceModel.findByIdAndUpdate(
        id,
        { name, price, duration, store },
        { new: true, runValidators: true }
      );
  
      if (!updatedService) {
        return res.status(404).send({ message: "Service not found" });
      }
  
      res.status(200).send({
        message: "Service updated successfully",
        service: updatedService,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({
        error: error.message,
        message: "Error in updating service",
      });
    }
  };

  const deleteService = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the service
      const deletedService = await ServiceModel.findByIdAndDelete(id);
  
      if (!deletedService) {
        return res.status(404).send({ message: "Service not found" });
      }
  
      // Remove the service reference from the store
      await StoreModel.updateOne(
        { _id: deletedService.store },
        { $pull: { services: deletedService._id } }
      );
  
      res.status(200).send({
        message: "Service deleted successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({
        error: error.message,
        message: "Error in deleting service",
      });
    }
  };

  const getServicesByStore = async (req, res) => {
    try {
        const storeId = req.params.storeId;

        const services = await ServiceModel.find({ storeId });

        if (!services.length) {
            return res.status(404).send({ message: 'No services found for this store' });
        }

        res.status(200).send(services);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, message: 'Error in fetching services' });
    }
};


export default {
    createService,
    editService,
    deleteService,
    getServicesByStore,
};