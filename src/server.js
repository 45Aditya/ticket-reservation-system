import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";

connectDB();

app.listen(5000, ()=>{
    console.log("server is running");
})