const jsonwebtoken = require('jsonwebtoken');
const HttpError  = require('../modals/HttpError')

module.exports = (req,res,next)=>{
    // next()
    if(!req.body.token){
        return next()
    }
    let data
    try {
         data = jsonwebtoken.verify(req.body.token,"supersecretkey")
        
    } catch (error) {
        return next(new HttpError('token invalid',401))
    }
    // console.log(data)
    // console.log(req.body.email)
    if(data.email!==req.body.email){
        return next(new HttpError('token invalid',401))
    }
    req.body.userId=data.id
    next()
    // next(req)

}