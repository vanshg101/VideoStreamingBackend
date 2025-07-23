// require('dotenv').config({path: '../.env'});
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import express from "express"
const app=express()
 
dotenv.config({
  path: "../.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error in Express server:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });

/*

;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}}`)
        app.on("error",(error)=>{
            console.error("Error in Express server:", error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})()
*/
