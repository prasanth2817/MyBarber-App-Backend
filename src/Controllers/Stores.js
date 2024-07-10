import StoreModel from "../Models/Stores.js";

const createStore = async (req, res) => {
  try {
    // Check if file exists in the request
    if (!req.files || !req.files.length) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Destructure fields from the request body
    const {
      storeName,
      description,
      location,
      address,
      timings,
      teamMembers,
      shopOwner,
      services,
    } = req.body;

    // Check if all required fields are present
    if (
      !storeName ||
      !description ||
      !location ||
      !address ||
      !timings ||
      !teamMembers ||
      !shopOwner ||
      !services
    ) {
      return res.status(400).send({ message: "Required fields are missing" });
    }

    // Handle image paths (assuming req.files is an array of file objects)
    const imagePaths = req.files.map((file) => file.path);

    const newStore = new StoreModel({
      storeName,
      description,
      location,
      address,
      timings,
      images: imagePaths,
      teamMembers: JSON.parse(teamMembers), // Assuming teamMembers is sent as a JSON string
      shopOwner: JSON.parse(shopOwner),
      services: JSON.parse(services)
    });

    // Save the new Store to the database
    await newStore.save();

    res.status(201).send({
      message: "Store Created Successfully",
      store: newStore,
    });
  } catch (error) {
    console.error("Error:", error);
    // Send error response
    res.status(500).send({
      error: error.message,
      message: "Error in creating Store",
    });
  }
};

const editStore = async (req, res) => {
  try {
    let store = await StoreModel.findById(req.params.id);
    if (store) {
        if (req.body.storeName) store.storeName = req.body.storeName;
        if (req.body.description) store.description = req.body.description;
        if (req.body.location) store.location = req.body.location;
        if (req.body.address) store.address = req.body.address;
        if (req.body.timings) store.timings = req.body.timings;

      if (req.body.teamMembers) {
        store.teamMembers = JSON.parse(req.body.teamMembers);
      }

      if (req.body.shopOwner) {
        store.shopOwner = JSON.parse(req.body.shopOwner);
      }

      if (req.body.services) {
        store.services = JSON.parse(req.body.services);
    }

      if (req.files && req.files.length > 0) {
        // Handle image paths (assuming req.files is an array of file objects)
        const imagePaths = req.files.map((file) => file.path);
        store.images = imagePaths;
      }

      await store.save();
      res.status(200).send({ message: "Store Edited Successfully", store });
    } else {
      res.status(400).send({ message: "Store Not Found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      error: error.message,
      message: "Error in editing Store",
    });
  }
};

const deleteStore = async (req, res) => {
    try {
      let Store = await StoreModel.findById({_id:req.params.id});
      if (Store) {
        await Store.deleteOne();
        res.status(200).send({ message: 'Store Deleted Successfully' });
      } else {
        res.status(404).send({ message: 'Store Not Found' });
      }
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({
        error: error.message,
        message: 'Error in deleting Store',
      });
    }
  };

  const getStoresById= async(req,res)=>{
    try {
      const store = await StoreModel.findById(req.params.id).populate('services');
      if(store)
      res.status(200).send({message:"Stores Fetched successfully",
    Stores:store})
    else
    res.status(404).send({message:"No Stores found"})
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({
        error: error.message,
        message: 'Error in getting Store',
      });
    }
  }
  
  const getStoresByLocation= async(req,res)=>{
    try {
      const { location } = req.query;
      const stores = await StoreModel.find({location})
      if(stores.length > 0)
      res.status(200).send({message:"Stores Fetched successfully",
    Store : stores})
    else
    res.status(404).send({message:"No Stores found"})
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({
        error: error.message,
        message: 'Error in getting Store',
      });
    }
  }

  const getStores= async(req,res)=>{
    try {
      const stores = await StoreModel.find({})
      if(stores)
      res.status(200).send({message:"Stores Fetched successfully",
    store : stores})
    else
    res.status(404).send({message:"No Stores found"})
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({
        error: error.message,
        message: 'Error in getting Store',
      });
    }
  }
export default {
  createStore,
  editStore,
  deleteStore,
  getStoresById,
  getStoresByLocation,
  getStores
};