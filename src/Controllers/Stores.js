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
      venueType,
      address,
      openTime,
      closeTime,
      teamMembers,
      shopOwner,
      serviceIds,
    } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!storeName) missingFields.push("storeName");
    if (!description) missingFields.push("description");
    if (!location) missingFields.push("location");
    if (!venueType) missingFields.push("location");
    if (!address) missingFields.push("address");
    if (!openTime) missingFields.push("openTime");
    if (!closeTime) missingFields.push("closeTime");
    if (!teamMembers) missingFields.push("teamMembers");
    if (!shopOwner) missingFields.push("shopOwner");
    if (!serviceIds) missingFields.push("serviceIds");

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: "Required fields are missing",
        missingFields: missingFields,
      });
    }

    // Handle image paths (assuming req.files is an array of file objects)
    const imagePaths = req.files.map((file) => file.path);

    const newStore = new StoreModel({
      storeName,
      description,
      location,
      venueType,
      address,
      openTime,
      closeTime,
      images: imagePaths,
      teamMembers: JSON.parse(teamMembers),
      shopOwner: JSON.parse(shopOwner),
      services: serviceIds,
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

  const searchStore = async (req, res) => {
    try {
      const { query, venueType } = req.query;
      const filters = {};
  
      // Handle search query
      if (query) {
        filters.$or = [
          { storeName: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
        ];
      }
  
      // Handle property type filter
      if (venueType) filters.venueType = venueType;
   
      // Fetch properties based on filters
      const stores = await StoreModel.find(filters);
      res.status(200).json(stores);
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Error searching properties", error: error.message });
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
  searchStore,
  getStoresById,
  getStoresByLocation,
  getStores
};