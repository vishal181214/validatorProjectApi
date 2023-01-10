import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import './connection.js'
import fileUpload from 'express-fileupload'

const app = express();

const port = process.env.PORT || 3500;

app.use(cors());
app.use(fileUpload({
    useTempFiles:true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use('/home/users', userRouter);
app.use('/home', userRouter);

app.listen(port, ()=>{
    console.log(`server Statred at ${port}`);
})