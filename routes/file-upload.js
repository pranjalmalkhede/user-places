const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer");
const fs = require("fs");
const axios = require("axios");
const Stream = require("stream").Transform;
const request = require('request');
const js = require('../Messenger-5c8eb60385a3.json')
// const fire = require('../firebase');
// const firebase = fire
const {Storage} = require('@google-cloud/storage')

const storage = new Storage({keyFilename:js})

// const { firestore } = require("firebase");

router.post(
  "/uploadfile",
  multer.single("myFile"),
  (req, res, next) => {
    if (!req.file) {
      return next(new HttpError("no file found", 404));
    }
    // console.log(req)
    if (
      !(
        req.file.mimetype === "image/jpg" ||
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png"
      )
    ) {
      return next(
        new HttpError("invalid file type please select jpg/png", 404)
      );
    }
    next();
  },
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.code = 400;
      error.message = "please enter supported file";
      return next(error);
    }
    res.send(file);
  }
);

router.post(
  "/uploadmultiple",
  multer.array("myFiles", 10),
  (req, res, next) => {
    const file = req.files;
    if (!file) {
      const error = new Error("Please upload a file");
      error.code = 400;
      error.message = "please enter supported file";

      return next(error);
    }
    res.send(file);
  }
);

router.get("/clean", async (req, res, next) => {
  // console.log(__dirname+"/uploads")
  if (fs.existsSync(__dirname + "/uploads")) {
    const files = fs.readdirSync(__dirname + "/uploads");

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (
          fs.statSync(__dirname + "/uploads" + "/" + filename).isDirectory()
        ) {
          removeDir(__dirname + "/uploads" + "/" + filename);
        } else {
          fs.unlinkSync(__dirname + "/uploads" + "/" + filename);
        }
      });
      fs.rmdirSync(__dirname + "/uploads");
    } else {
      fs.rmdirSync(__dirname + "/uploads");
    }
  } else {
    console.log("Directory path not found.");
  }
  res.send({ message: "cleaned up" });
});

router.get("/image", async (req, res, next) => {
  // fetch('https://www.google.com').then(data=>console.log(data))
  axios.get("https://www.google.com").then((data) => {
    let response = data.data.toString();
    let index = response.indexOf("<img");
    let imgtag = response.slice(index, index + 200);
    imgtag = imgtag.split(" ");
    imgtag = imgtag.filter((tag) => tag.startsWith("src"))[0];
    imgtag = imgtag.split('"')[1];
    let url = `https://www.google.com${imgtag}`;
    console.log(imgtag);
    // var download = function(uri, filename, callback){
    //   request.head(uri, function(err, res, body){    
    //     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    //   });
    // };
    
    // download(url, 'google.png', function(){
    //   console.log('done');
    // });
    // console.log(typeof firebase.auth())
    var file = fs.readFileSync('helloworld.txt')
    console.log(file)
    // var bucket = storage.createBucket('img');
    var bucket = storage.bucket('images')
    // var remoteFile = bucket.file('helloworld.txt');
    var localFilename = 'helloworld.txt';
    // bucket.upload(localFilename, function(err, file) {
    //   if (!err) {
    //     console.log('somefile-inThisCaseASong.mp3 is now in your bucket.');
    //   } else {
    //     console.log('Error uploading file: ' + err);
    //   }
    // });
    // bucket.getFiles({},(err,file)=>{
    //   console.log(err)
    //   console.log(file)
    // })
     console.log(storage.baseUrl)


    // res.setHeader('Content-Type','image/png')
    res.send(file)
  });

});

module.exports = router;
