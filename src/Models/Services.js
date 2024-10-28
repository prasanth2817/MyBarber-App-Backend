import mongoose from "./index.js";

const ServicesSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Service Name is required"] },
    price: { type: Number, required: [true, "Service Price is required"] },
    duration: {
      type: String,
      required: [true, "Service Duration is required"],
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  },
  {
    collection: "Services",
    versionKey: false,
  }
);

const ServicesModel = mongoose.model("Service", ServicesSchema);

export default ServicesModel;
