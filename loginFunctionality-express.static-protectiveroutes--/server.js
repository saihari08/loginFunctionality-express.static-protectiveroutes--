const mongoose=require("mongoose");
const express=require("express");
const cors=require("cors");
const multer=require("multer");

let app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/profilePics',express.static('profilepics'));

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
      cb(null, "profilePics")
    },
    filename: (req, file, cb) =>{
        console.log(file);
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
  const upload = multer({ storage: storage })

let userSchema=new mongoose.Schema({
    firstName:String,
    lastName:String,
    age:String,
    email:String,
    password:String,
    phoneNo:String,
    profilePic:String,
});

let User=new mongoose.model("user",userSchema);

app.post("/login",upload.none(),async(req,res)=>{
    console.log(req.body);

    let userDetails=await User.find().and({email:req.body.email});
    console.log(userDetails);

    if(userDetails.length>0){
        if(userDetails[0].password==req.body.password){

            let details={
                firstName:userDetails[0].firstName, 
                lastName:userDetails[0].lastName,
                age:userDetails[0].age,
                email:userDetails[0].email,
                profilePic:userDetails[0].profilePic,
        
            }
          res.json({status:"sucess",data:userDetails[0]})
        }else{
            
        res.json({status:"failure",msg:"invalid password."});
        }

    }else{
        res.json({status:"failure",msg:"User doesnot exist."});
    }
    res.json(["some dummy response"]);
});

app.post("/signup",upload.single("profilePic"),async(req,res)=>{
    console.log(req.body);
    console.log(req.files);
    console.log(req.file);

try{
    let newUser=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        age:req.body.age,
        email:req.body.email,
        password:req.body.password,
        phoneNo:req.body.phoneNo,
        profilePic:req.file.path,
    });
    
    await User.insertMany([newUser])
    console.log("Saved Successfully");
    res.json({status:"success",msg:"Account created Successfully"});
}catch(err){
    console.log("Unable to save")
    res.json({status:"failure",msg:"Unable to create Account"});
}
});

app.listen(2120,()=>{
    console.log("Listening to port 2120");
});

let connectToMDB=async()=>{
    try{
        mongoose.connect("mongodb://localhost:27017/2404Batch");
        console.log("connected to MDB successfully")
    }catch(err){
       console.log("Unable to connect to MDB")
    }
}
connectToMDB();