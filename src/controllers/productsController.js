const fs = require('fs');
const path = require('path');
const multer = require('multer');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
// const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		res.render('products', {products : products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productsDB = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		let product = productsDB.find(product => product.id == req.params.id)
		res.render('detail', {product : product})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// esto es lo mismo que lo de abajo, uno de los dos scrollbars, yo digo que el de abajo
		let productsDB = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		//para sacar el numero de id
		let lastItem = productsDB.length -1;
		let newId = productsDB[lastItem].id +1;


		// Do the magic
		let newProduct = {
			id : newId,
			name : req.body.name,
			price : req.body.price,
			discount : req.body.discount,
			category : req.body.category,
			description : req.body.description,
			//image : req.file.filename
		}

		if(!req.file){
			newProduct.image = 'default-image.png';
		}else{
			newProduct.image = req.file.filename
		}

		// PRIMERO queremos leer qué cosas ya había: si ya tenía usuarios registrados, no
		// queremos pisar el archivo

		let newProductList;
		//definimos la variable antes del if así la toma globalmente

		if (productsDB == ''){
			newProductList = [];
		}else{
			newProductList = productsDB;
		}
		// Para leer un archivo .json usamos parse para descomprimir la información.
		// De este modo vamos a tener la variable productos como un array, con todos
		// los productos viejos. Si el archivo está vacío, de manera previa vamos a
		// escribir una condición.
		//O sea, si el archivo no tenía nada, va a ser un array vacío, y si ya tenía
		// contenido, ahí va a descomprimir el archivo para obtener el array de productos.

		newProductList.push(newProduct);
		// Ahora le agregamos el usuario nuevo (el que se creo arriba con los dtos del form)
		// ahora para poder escribirla hay que pasarla a JSON de nuevo, con stringify.


		fs.writeFileSync(productsFilePath, JSON.stringify(newProductList,null,"\t"));

		res.redirect('/products/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productsDB = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		let productToEdit = productsDB.find(item => item.id == req.params.id);

		res.render('product-edit-form', {productToEdit : productToEdit});
	},
	// Update - Method to update
	update: (req, res) => {

		//leer el json de archivo de productos, se guarda en variable products
		let productsDB = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		//acá encontramos un producto específico que coincide con el ID del json

		let productToEdit = productsDB.find(item => item.id == req.params.id);

		
		//segun lo que el usuario ingrese a través de los campos, sobre-escribir esa info
		
		//crear una variable con la info que carga el usuario
		let newEdit ={
			id : req.params.id,
			name : req.body.name,
			price : req.body.price,
			discount : req.body.discount,
			category : req.body.category,
			description : req.body.description,
		//	image : req.file.filename
		}

		if(!req.file){
			newEdit.image = 'default-image.png';
		}else{
			newEdit.image = req.file.filename
		}

		
		
		// hay que traer la misma lógica de crear para acá, ahí estas sobre escribiendo el archivo, Vamos a hacer lo siguiente para que se entretenga un ratico
		//solución uno
		//1. la lista de productos que esta en la variable products es un array, como es un array cada elemento tiene asociado un index, necesitamos recuperar ese indice puede utilizar el método indexof.
		//2. cuando obtengamos ese indice, accedemos al products[index] y lo reemplazamos por el newEdit simplemente igualando como en la línea 108
		//3. ahora si tenemos la lista de productos actualizada en la variable products, podemos proceder a escribir de nuevo en el archivo
		
		let productIndex = productsDB.indexOf(productToEdit);
		

		productsDB[productIndex] = newEdit;





		//Solución dos
		//1. Eliminar el elemento a editar de la variable products
		//2. Hacer push de newEdit a la variable products
		//3. Escribir en el archivo

		//Cualquiera de los dos nos sirve pero lo que estas haciendo acá abajo es que editas un producto y ese producto va y sobrescribe todo el archivo de la base de datos, cuando en realidad necesitamos guardar todos los productos con el producto modificado
		//Eso del navegador es lo que hay que hacer, se activó el insert o algo así del teclado
		fs.writeFileSync(productsFilePath, JSON.stringify(productsDB,null,"\t"));
		
		res.redirect('/products/');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productsDB = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		// Do the magic
		//let productToDelete = products.find(item => item.id === parseInt(req.params.id))
		//acá guarda en la variable sólo el producto que encontró como coincidencia

		const newListProducts = productsDB.filter(item => item.id !== parseInt(req.params.id))
		//acá me crea una nueva lista con todos los productos MENOS el de la coincidencia (porque está !==)
		// parseInt me permite hacer una comparación estricta, porque me devuelve un entero (del string
		// que llega por URL)

		fs.writeFileSync(productsFilePath, JSON.stringify(newListProducts,null,"\t"));

		res.redirect('/products/');
	}
};


module.exports = controller;