const fs = require('fs');
const multer = require('multer');
const HttpError =require('../modals/HttpError')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(__dirname.split("middleware")[0]+'uploads')
        if(!fs.existsSync(__dirname.split("middleware")[0]+"uploads")){
            fs.mkdir(__dirname.split("middleware")[0]+"uploads",()=>console.log("created uploads"))
        }
      cb(null, __dirname.split("middleware")[0]+"uploads")
    },
    filename: function (req, file, cb) {
        // console.log(file.mimetype.split('/')[1])
        if(file.mimetype.split('/')[1]!=='png' && file.mimetype.split('/')[1]!=='jpeg' ){
            return cb("no image format")
        }
       
      cb(null, file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1])
    }
  })
   
module.exports = multer({ storage: storage })