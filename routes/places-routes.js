const express = require('express');
const {check} = require('express-validator')

const placesController = require('../controllers/places-controller')

const router = express.Router();

router.get('/',placesController.getPlaces )
router.post(
  "/",
  [
    check("title").notEmpty(),
    check("description").isLength(6),
    check("address").notEmpty(),
    check("creator").notEmpty(),
  ],
  placesController.createPlace
);
// router.patch(
//     "/:pid",
//     [
//       check("title").notEmpty(),
//       check("description").isLength(6),
//       check("address").notEmpty(),
//       check("creator").notEmpty(),
//     ],
//     placesController.updatePlace
//   );
router.delete('/:pid',placesController.deletePlace )



module.exports = router