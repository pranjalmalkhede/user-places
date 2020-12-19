const HttpError = require('../modals/HttpError')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose');

const Place = require('../modals/PlaceSchema');
const User =require('../modals/userSchema')

const getPlaces = async (req,res,next) => {
    
    let places
    try {
        result = await Place.find()
    } catch (error) {
        return next(new HttpError("Error getting data from db",404))
    }

    if(!result || result.length === 0){
        return next(new HttpError('something wrong happened',500))
    }

    res.json(result.map(r=>r.toObject({getters:true})))
}

const createPlace = async (req,res,next) => {
    // next( new HttpError('success',404))
    let error = validationResult(req)
    // console.log(error)

    if(!error.isEmpty()){
        return next(new HttpError('Please check input',404))
    }

    const {title, description,address,creator} = req.body;

    let user
    try {
        user = await User.findById(creator)
    } catch (error) {
        return next(new HttpError("something went wrong",500))
    }
    if(!user){
        return next(new HttpError('cannot find user',404))
    }
    
    const newPlace = new Place({
        title:title,
        description:description,
        address:address,
        creator:creator
    })

    let result
    try{
        // result= await newPlace.save()
        const sess = await mongoose.startSession() 
        sess.startTransaction()
        result=await newPlace.save({session:sess})
        user.places.push(newPlace)
        await user.save({session:sess})
        await sess.commitTransaction()
    } catch(error){
        console.log(error)
        return next(new HttpError('error saving in db',405))
    }
    if(!result){
        return next(new HttpError('Something wrong happened',500))
    }
    res.json(result)
}

const deletePlace = async (req,res,next)=>{
    const placeId =req.params.pid
    // console.log(req)
    const userId = req.query.uid

    let place
    try {
        place = await Place.findById(placeId).populate('creator')
    } catch (error) {
       return next(new HttpError('Error from db',404))
    }

    if(!place || place.creator.id!==userId){
        return next(new HttpError('something went wrong',500))
    }
    let result
    try {
        // result = await place.remove()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        result =await place.deleteOne({session:sess})
        place.creator.places.pull(place)
        await place.creator.save({session:sess})
        await sess.commitTransaction()
    } catch (error) {
        return next(new HttpError('error removing data',404))
    }

    res.json(result)
}

const updatePlace = async (req,res,next)=>{
    let error = validationResult(req)
    // console.log(error)

    if(!error.isEmpty()){
        return next(new HttpError('Please check input',404))
    }

    const placeId =req.params.pid
    
    let place
    try {
        place = await Place.findById(placeId)
    } catch (error) {
        return next(new HttpError('something wrong',500))
    }

    if(!place){
        return next(new HttpError('no place in db',404))
    }
    const {title, description,address,creator} = req.body;

    place.title=title
    place.description=description
    place.address=address
    place.creator=creator

    try {
        await place.save()
    } catch (error) {
        return next(new HttpError('couuldnt update palce',404))
    }

    res.json(place)
}
exports.getPlaces = getPlaces
exports.createPlace = createPlace
exports.deletePlace = deletePlace
exports.updatePlace = updatePlace