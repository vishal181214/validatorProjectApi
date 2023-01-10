import express, { application } from "express";
import userInfo from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'dn7enhhny',
  api_key: '411678245733167',
  api_secret: 'AmLC7EzW-hR8vtfGD2tjob6GOW4'
})
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const result = await userInfo.findOne({ email: req.body.email });
  const resNum = await userInfo.findOne({ cellnum: req.body.cellnum });
  if (result) {
    res.status(409).send("Email already exist");
    // console.log("Email already exist");
  } 
  else if(resNum){
    res.status(409).send("Mobile number already exist");
  }
  else {
    const file = req.files.img;
  cloudinary.uploader.upload(file.tempFilePath,async(result,err)=>{
      // console.log(result);
      const newUser = new userInfo({
      name: req.body.name,
      cellnum: req.body.cellnum,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      Country:req.body.Country,
      State: req.body.State,
      City: req.body.City,
      desc: req.body.desc,
      img: result.url,
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      cellnum: req.body.cellnum,
      email: user.email,
      isAdmin: user.isAdmin,
      Country:req.body.Country,
      State: req.body.State,
      City: req.body.City,
      desc: req.body.desc,
      token: jwt.sign({ user }, "my_encryption_text_key"),
    });
  })
  }
});

userRouter.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await userInfo.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // console.log(user);
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: jwt.sign({ user }, "my_encryption_text_key"),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

userRouter.get("/reserve",async(req,res) => {
  try{
      const alluser = await userInfo.find({});
      res.status(200).send(alluser);
  }catch(err){
      res.status(500).json("cannot get data");
  }
})

userRouter.post(`/delete/:id`,async(req,res)=>{
  // res.send("delete Api")
  console.log("delete api");
  console.log(req.params.id);
  console.log(req.body);
  const result = await userInfo.findOneAndRemove({ _id: req.params.id });
  if(result)
    res.status(200).send("User deleted successfully");
  else
    res.status(400).send("User not found");
})

userRouter.put(`/update/:id`,async(req,res)=>{
  console.log(req.body);
  const result = await userInfo.updateOne({ _id: req.params.id },
    {
      $set: req.body
    });
  if(result){
      res.status(200).send(result);
  }
  else
    res.status(400).send("User not found");
})

export default userRouter;

