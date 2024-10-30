import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import AppRoutes from "./src/Routes/index.js";
import cors from "cors"

dotenv.config();

const app= express();
const PORT= process.env.PORT || 8000

app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
  
app.use(morgan("dev"));
app.use(express.json())
app.use("/",AppRoutes)

app.listen(PORT,()=>console.log(`server listening to the port ${PORT}`));