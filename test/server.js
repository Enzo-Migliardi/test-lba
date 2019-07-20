const express = require("express");
const morgan = require('morgan');
const Joi = require('joi');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express();

let products = require('./Products.json');

mysql_co = mysql.createConnection({
	host: 'localhost',
    user: 'root',
	database: 'test'
});

app.use(cors()) 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));

app.listen(3001, () => {
	console.log("Serveur allumé sur le port 3001");
});

app.post("/register", (req, res) => {
    const schema = {
		email: Joi.string().email().min(5).max(100).required(),
		password: Joi.string().min(5).max(100).required(),
    };
	const result = Joi.validate(req.body, schema);
	if (result.error)
		return res.json({error: true, message: result.error.details[0].message});
		
	mysql_co.query("SELECT * FROM users WHERE email = ?", [req.body.email], (errA, rowsA, fieldsA) => {
		if (errA) throw errA;
				
		if (rowsA[0] != null)
			return res.json({error: true, message: "Email déjà prise"});
		
		bcrypt.genSalt(10, function(errB, salt) {
			if (errB) throw errB;
			bcrypt.hash(req.body.password, salt, function(errC, hash) {
				if (errC) throw errC;
				const user = {
					email: req.body.email,
					password: hash,
				};
				mysql_co.query("INSERT INTO users SET ?", [user], (errD, rowsD, fieldsD) => {
					if (errD) throw errD;
					res.json({error: false, message:"Inscription validée"});
				});
			});
		});
	});
});

app.post("/login", (req, res) => {
	const schema = {
		email: Joi.string().email().min(5).max(100).required(),
		password: Joi.string().min(5).max(100).required(),
	};
	const result = Joi.validate(req.body, schema);
	if (result.error)
		return res.json({error: true, message: result.error.details[0].message});

	mysql_co.query("SELECT * FROM users WHERE email = ?", [req.body.email], (errA, rowsA, fieldsA) => {
		if (errA) throw errA;
		let user = rowsA[0];

		if (rowsA.length == 0)
			return res.json({error: true, message: "Email inexistante"});

		bcrypt.compare(req.body.password, user.password, function(errB, resB) {
			if (errB) throw erB;
			if (resB) {
				jwt.sign({id: user.id}, 'privatekey', (errC, token) => {
					if (errC) throw errC;
					user.access_token = token;

					mysql_co.query("UPDATE users SET access_token = ? WHERE id = ?;", [token, user.id], (errD, rowsD, fieldD) => {
						if (errD) throw errD;
						return res.json({token: token, email: user.email, error: false, message: "Connexion réussie"});
					})
				});
			} else if (!resB)
					return res.json({error: true, message: "Mot de passe incorrect"});
		});
	});
});

app.get("/getProducts", verifyToken, (req, res) => {
    res.json({error: false, products: products});
});

app.delete("/deleteProduct/:id", verifyToken, (req, res) => {
    for (let i = 0; i < products.length; i++) {
        if (products[i]._id == req.params.id) {
            products.splice(i, 1);
            break;
        }
    }
    res.json({products: products});
});

app.post("/updateProduct/:id", verifyToken, (req, res) => {
    const product = {
		_id: req.params.id,
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        rating: req.body.rating,
        warranty_years: req.body.warranty_years,
        available: req.body.available,
    };
    for (let i = 0; i < products.length; i++) {
        if (products[i]._id == req.params.id)
            products.splice(i, 1, product);
    }
    res.json({error: false, message: "produit " + req.params.id + " modifié"})
});

app.post("/createProduct", verifyToken, (req, res) => {
    let lastid = 0;
    const product = {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        rating: req.body.rating,
        warranty_years: req.body.warranty_years,
        available: req.body.available,
    };

    for (let i = 0; i < products.length; i++) {
        if (products[i]._id > lastid)
			lastid = products[i]._id;
    }
	product._id = lastid+1;
    products.push(product);
    res.json({error: false, message: "produit " + (lastid+1) + " crée", products: products});
});

app.post("/checkCurrentToken", verifyToken, (req, res) => {
	res.json({error: false});
});

function getAuthorization(req)
{
	if(typeof req.headers['authorization'] !== 'undefined')
		return req.headers['authorization'].split(' ')[1];
	else
		return 0;
}

function verifyToken(req, res, next) 
{
	let authorization = getAuthorization(req);
	if (authorization == 0)
		res.json({error: true, message: "pas d'access_token"});
	else {
		mysql_co.query("SELECT * FROM users WHERE access_token = ?", [authorization], (err, rows) => {
			if (err) throw err;
			if (rows[0] == null)
				res.json({error: true, message: "access_token non renseigné"});
			else if (rows[0].access_token === authorization)
				next();
			else 
				res.json({error: true, message: "access_token incorrect"});
		});
	}
}