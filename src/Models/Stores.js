import mongoose from "./index.js";

const StoreSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: [true, "Store Name is required"] },
    location: { type: String, required: [true, "Store Location is required"] },
    venueType: {
      type: String,
      enum: ["unisex", "mens", "womens"],
      required: [true, "Venue Type is required"],
    },
    address: { type: String, required: [true, "Store Address is required"] },
    description: {
      type: String,
      required: [true, "Store description is required"],
    },
    openTime: { type: String, required: [true, "Opening time is required"] },
    closeTime: { type: String, required: [true, "Closing time is required"] },
    images: [{ type: String }],
    teamMembers: [
      {
        firstName: { type: String, required: [true, "First Name is required"] },
        lastName: { type: String, required: [true, "Last Name is required"] },
        role: { type: String, default: "Staff" },
      },
    ],
    shopOwner: [
      {
        firstName: { type: String, required: [true, "First Name is required"] },
        lastName: { type: String, required: [true, "Last Name is required"] },
      },
    ],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    professionals: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    ],
  },
  {
    collection: "Stores",
    versionKey: false,
  }
);

const StoreModel = mongoose.model("Store", StoreSchema);

export default StoreModel;
