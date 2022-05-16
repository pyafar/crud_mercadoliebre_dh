const { red } = require('color-name');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		res.render('index', {products : products})
	},
	search: (req, res) => {
		let searchResult = req.query.keywords;
		res.send(searchResult);
	},
};

module.exports = controller;
