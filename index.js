const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios')

const HttpError = require('./modals/HttpError')

const PlacesRoute = require('./routes/places-routes')
const UsersRoute = require('./routes/users-routes')
const fileUpload = require('./routes/file-upload')


const app = express()
const file = express()
// console.log(process.env)
 
app.use(bodyparser.json())
file.use(bodyparser.urlencoded({extended: true}))


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/api/places', PlacesRoute)
app.use('/api/users', UsersRoute)

file.use('/api/files',fileUpload)


app.use((req,res,next)=>{
    next(new HttpError('No route matched',404))
})

app.use((error,req,res,next)=>{
    if(res.headerSent){
        return
    }
    res.status(error.code || 500).json({message:error.message|| 'Error occured'})
})

mongoose.connect(encodeURI(`mongodb+srv://pranjal:Pranjal@8793@cluster0-x63mr.mongodb.net/react?retryWrites=true&w=majority`) ,{ useNewUrlParser: true ,useUnifiedTopology: true})
.then(()=>{
    console.log("connected to MongoDB")
    app.listen(8000,()=>{
        console.log("app started")
        // console.log()
    })
})
.catch((error)=>{
    console.log("connection failed! MongoDB")
    console.log("App cannot be started")
})

file.use((error,req,res,next)=>{
    // console.log(error.status,error.message)
    if(res.headerSent){
        return
    }
    res.status(error.code || 500).json({message:error.message|| 'Error occured'})
})
file.listen(8001)


