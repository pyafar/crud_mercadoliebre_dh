const fs = require('fs');
const path = require('path');
const multer = require('multer');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render('products', {products : products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		let product = products.find(product => product.id === parseInt(req.params.id));
		res.render('detail', {product : product})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {

		// PRIMERO queremos leer qué cosas ya había: si ya tenía usuarios registrados, no
		// queremos pisar el archivo
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		//para sacar el numero de id
		let last = products.length -1;
		let newId = products[last].id +1;

		console.log(req.file)

		// Do the magic
		let newProduct = {
			id : newId,
			name : req.body.name,
			price : req.body.price,
			discount : req.body.discount,
			category : req.body.category,
			description : req.body.description,
	//		image : req.file.filename
		}


		let product;
		//definimos la variable antes del if así la toma globalmente

		if (products == ''){
			product = [];
		}else{
			product = JSON.parse(products);
		}
		// Para leer un archivo .json usamos parse para descomprimir la información.
		// De este modo vamos a tener la variable productos como un array, con todos
		// los productos viejos. Si el archivo está vacío, de manera previa vamos a
		// escribir una condición.
		//O sea, si el archivo no tenía nada, va a ser un array vacío, y si ya tenía
		// contenido, ahí va a descomprimir el archivo para obtener el array de productos.

		product.push(newProduct);
		// Ahora le agregamos el usuario nuevo (el que se creo arriba con los dtos del form)
		// ahora para poder escribirla hay que pasarla a JSON de nuevo, con stringify.

		let productsJSON = JSON.stringify(product,null,"\t");

		fs.writeFileSync(productsFilePath, productsJSON);

		res.redirect('/products/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		//leer el json de archivo de productos, se guarda en variable products
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		let product = products.find(item => item.id == req.params.id)

		res.render('product-edit-form', {productToEdit : product})
	},


	// Update - Method to update
	update: (req, res) => {

		//leer el json de archivo de productos, se guarda en variable products
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		//acá encontramos un producto específico que coincide con el ID del json
		let productToEdit = products.find(item => item.id === parseInt(req.params.id));

		//segun lo que el usuario ingrese a través de los campos, sobre-escribir esa info

		//crear una variable con la info que carga el usuario
		let newEdit ={
			name : req.body.name,
			price : req.body.price,
			discount : req.body.discount,
			category : req.body.category,
			description : req.body.description,
		}

		productToEdit = newEdit;

		// if(newEdit.name !== ''){
		// 	productToEdit.name = newEdit.name; 

		// }else{

		
		fs.writeFileSync(productsFilePath, JSON.stringify(productToEdit,null,"\t"));
			res.redirect('/products/', {product : product});
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		//let productToDelete = products.find(item => item.id === parseInt(req.params.id))
		//acá guarda en la variable sólo el producto que encontró como coincidencia

		const newListProducts = products.filter(item => item.id !== parseInt(req.params.id))
		//acá me crea una nueva lista con todos los productos MENOS el de la coincidencia (porque está !==)
		// parseInt me permite hacer una comparación estricta, porque me devuelve un entero (del string
		// que llega por URL)

		fs.writeFileSync(productsFilePath, JSON.stringify(newListProducts,null,"\t"));

		res.redirect('/products');
	}
};


module.exports = controller;