import express from "express";
import dotenv from "dotenv";
import AppRoutes from "./src/Routes/index.js";

dotenv.config();

const app= express();
const PORT= process.env.PORT || 8000

app.use(express.json())
app.use("/Images", express.static("Public/Images"));
app.use("/",AppRoutes)

app.listen(PORT,()=>console.log(`server listening to the port ${PORT}`));