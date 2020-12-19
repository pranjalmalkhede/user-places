const User = require('../modals/userSchema')
const HttpError  =require('../modals/HttpError')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');


const createUser = async (req,res,next)=>{
    
    let error =validationResult(req)
    if(!error.isEmpty()){
        return next(new HttpError('please enter valid input',404))
    }

    const {name, email, password}=req.body


    let hashPassword
    try {
        hashPassword= await bcryptjs.hash(password,12)
    } catch (error) {
        return next(new HttpError('something went wrong',500))
    }

    const newUser = new User({
        name:name,
        email:email,
        password:hashPassword,
        places:[]
    })

    // const newUser = await User.create(req.body)
    

    let result
    try{
        result= await newUser.save()
    } catch(error){
        return next(new HttpError('error saving in db',404))
    }
    if(!result){
        return next(new HttpError('Something wrong happened',500))
    }

    let encodedData= jsonwebtoken.sign({id:result.id,email:result.email},'supersecretkey',{expiresIn:'1h' })

    res.json({token:encodedData,userId:result.id,email:result.email})
}

const getUsers = async (req,res,next)=>{
    let users
    try {
        users = await User.find({},'-password -email')
    } catch (error) {
        return next(new HttpError('something went wrong',500))
    }
    if(!users || users.length===0){
        return next(new HttpError('no user found',404))
    }
    res.json(users.map(user=>user.toObject({getters:true})))
}

const deleteUser= async(req,res,next)=>{
    const userId=req.params.uid
    let user
    try {
        user = await User.findById(userId)
    } catch (error) {
        return next(new HttpError('something went wrong',500))
    }
    if(!user){
        return next(new HttpError("no user found",404))
    }

    try {
        await user.remove()
    } catch (error) {
        return next(new HttpError('something went wrong',500))
    }

    res.json(user.toObject({getters:true}))
}

const updateUser = async (req,res,next)=>{
    let error = validationResult(req)
    // console.log(error)

    if(!error.isEmpty()){
        return next(new HttpError('Please check input',404))
    }

    const {userId} =req.body
    const decodedId  =req.params.uid
    // console.log(object)
    if(decodedId!==userId){
        return next(new HttpError('invalid user',401))
    }
    
    let user
    try {
        user = await User.findById(userId)
    } catch (error) {
        return next(new HttpError('something wrong',500))
    }

    if(!user){
        return next(new HttpError('no user in db',404))
    }
    const {name} = req.body;

    user.name=name

    try {
        await user.save()
    } catch (error) {
        return next(new HttpError('couuldnt update palce',404))
    }

    res.json(user)
}

const loginUser = async (req,res,next)=>{
    let error = validationResult(req)
    // console.log(error)
    if(!error.isEmpty()){
        return next(new HttpError('please check input',404))
    }
    const {email,password,userId}=req.body

    // console.log(req.body)
    let user
    try {
        user = await User.findById(userId)
    } catch (error) {
        return next(new HttpError("no user",500))
    }
    // if(!user || user.password!==password){
    //     return next(new HttpError("connot find user",404))
    // }
    let result
    try {
        result= await bcryptjs.compare(password,user.password)
    } catch (error) {
        return next(new HttpError('something went wrong',500))
    }
    // console.log(result)
    if(!result){
        return next(new HttpError("somethnig went wrong",500))
    }
    
    // return res.json(user.toObject({getters:true}))
    return res.json({id:user.id,email:user.email,status:"ok"})
}

exports.createUser =createUser
exports.getUsers =getUsers
exports.deleteUser =deleteUser
exports.updateUser=updateUser
exports.loginUser=loginUser

