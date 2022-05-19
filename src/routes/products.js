// ************ Require's ************
const express = require('express');
const router = express.Router();


// ************ Controller Require ************
const productsController = require('../controllers/productsController');
const path = require('path');

//********** Multer */
const multer = require('multer');

const storage = multer.diskStorage({

	destination: (req, file, callback)=> {
	    callback(null, path.join(__dirname + '/../../public/images/products'));
	},

	filename: (req, file, callback)=> {
	    let imageName = Date.now() + file.originalname + path.extname(file.originalname);
	    callback(null, imageName);
	},
});

const uploadImage = multer({storage : storage});

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/', uploadImage.single('prod-img'), productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/edit/:id', uploadImage.single('prod-img'), productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;
