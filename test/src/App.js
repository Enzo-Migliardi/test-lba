import React, { Component } from 'react';
import './App.css';
import Product from './Product.js';
import axios from 'axios';
import { Button, Container, Fab, TextField} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Modal from 'react-awesome-modal';

class App extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			email_login: "",
			password_login: "",
			email_register: "",
			password_register: "",
			connected: false,
			log: true,
			products: [],
			visibility: true,
			email: null,
			visibilityAdd: false,

			nom: null,
			type: null,
			prix: null,
			note: null,
			garantie: null,
			available: null,
		};
	}

	onLogin() {
		let Component = this;
		axios.post('http://localhost:3001/login', {
			email: this.state.email_login,
			password: this.state.password_login,
        }).then(function (response) {
			if (!response.data.error) {
				localStorage.setItem('token', response.data.token);
				Component.setState({email: response.data.email});
				Component.setState({connected: true});
			}
			alert(response.data.message);
		});
	}

	onRegister() {
		let Component = this;
		axios.post('http://localhost:3001/register', {
			email: this.state.email_register,
			password: this.state.password_register,
		}).then(function (response) {
			if (!response.data.error) {
				Component.setState({log: true})
			}
			alert(response.data.message)
		});
	}

	getProduct() {
		if (this.state.connected === true) {
			let currentComponent = this;
			axios.get('http://localhost:3001/getProducts').then(function (response) {
				if (!response.data.error) {
					currentComponent.setState({products: response.data.products});
				} else {
					alert(response.data.message);
				}
			});
		}
	}

	async checkCurrentToken() {
		let currentComponent = this;
		await axios.post('http://localhost:3001/checkCurrentToken').then(function (response) {
			if (!response.data.error) {
				currentComponent.setState({connected: true});
			} else {
				currentComponent.setState({
					connected: false,
					email: null,
					log: true,
				});
			}
		});
	}

	async componentDidMount() {
		axios.defaults.headers.common['authorization'] = "bearer " + localStorage.getItem("token");
		await this.checkCurrentToken();
		this.getProduct();
	}

	deleteProduct(el) {
		let currentComponent = this;
		axios.delete('http://localhost:3001/deleteProduct/'+el._id)
		.then(function (response) {
			currentComponent.setState({products: response.data.products});
		});
	}

	openModalAdd() {
		this.setState({visibilityAdd: true})
	}
	closeModalAdd() {
		this.setState({visibilityAdd: false})
	}

	addProduct() {
		let currentComponent = this;
		axios.post('http://localhost:3001/createProduct/', {
			name: this.state.nom,
			type: this.state.type,
			price: this.state.prix,
			rating: this.state.note,
			warranty_years: this.state.garantie,
			available: this.state.available,	
		}).then(function (response) {
			if (!response.data.error) {
				currentComponent.closeModalAdd();
				currentComponent.setState({products: response.data.products});
			}
			alert(response.data.message);
		});
	}

	render() {
    	return (
		<div id="main">
			<header id="main_header">
				<img src="https://www.lesbonsartisans.fr/wp-content/themes/lesbonsartisans/images/logo.svg" alt="LesBonsArtisans"></img>
			</header>
			<Container maxWidth="sm" style={{backgroundColor: 'rgba(0, 0, 0, .05)'}}>
				{ (!this.state.connected) ? 
					(!this.state.log) ? 
						<div id="register">
							<div style={{textAlign: "center"}}>
								<h1 style={{textAlign: "center", fontSize: 30, fontWeight: "bold", color: "#535ba0", textDecoration: "underline", marginBottom: 10}}>S'inscrire</h1>
								<div>
									<p style={{textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#535ba0", textDecoration: "underline", marginTop: 20, marginBottom: 21}}>Email:</p>
									<form><input style={{textAlign: "center", fontSize: 15, height: "33px", width: "225px"}} type="text" value={this.state.email} onChange={(e) => this.setState({email_register: e.target.value})}/></form>
									<p style={{textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#535ba0", textDecoration: "underline", marginTop: 20, marginBottom: 21}}>Mot de passe:</p>
									<form><input style={{textAlign: "center", fontSize: 15, height: "33px", width: "225px"}} type="password" value={this.state.password} onChange={(e) => this.setState({password_register: e.target.value})}/></form>
									<Button style={{marginTop: "1%", marginBottom: "1%"}}variant="contained" color="primary" onClick={(e) => { this.onRegister(e) }}>S'inscrire</Button>
									<p style={{marginBottom: "1%"}}><Button variant="contained" color="secondary" size="small" onClick={(e) => {this.setState({log: true})}}>Déja inscrit ? Se connecter </Button></p>
								</div>
							</div>
						</div>
						:
						<div id="login">
						<div style={{textAlign: "center"}}>
							<h1 style={{textAlign: "center", fontSize: 30, fontWeight: "bold", color: "#535ba0", textDecoration: "underline", marginBottom: 10}}>Connexion</h1>
							<div>
								<p style={{textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#535ba0", textDecoration: "underline", marginTop: 20, marginBottom: 21}}>Email:</p>
								<form><input style={{textAlign: "center", fontSize: 15, height: "33px", width: "225px"}} type="text" value={this.state.email} onChange={(e) => this.setState({email_login: e.target.value})}/></form>
								<p style={{textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#535ba0", textDecoration: "underline", marginTop: 20, marginBottom: 21}}>Mot de passe:</p>
								<form><input style={{textAlign: "center", fontSize: 15, height: "33px", width: "225px"}} type="password" value={this.state.password} onChange={(e) => this.setState({password_login: e.target.value})}/></form>
								<Button style={{marginTop: "1%", marginBottom: "1%"}}variant="contained" color="primary" onClick={(e) => { this.onLogin(e) }}> Se connecter </Button>
								<p style={{marginBottom: "1%"}}><Button variant="contained" color="secondary" size="small" onClick={(e) => {this.setState({log: false})}}>Pas de compte ? S'inscrire</Button></p>
							</div>
						</div>
					</div>
					:
					<div>
						{
							this.state.products.map((el) => (
								<Product el={el} parent={this} deleteProd={this.deleteProduct.bind(this, el)} getProd={this.getProduct.bind(this)}/>
							))
						}
					</div>
				}
				<div style={{width: "100%", textAlign: "center"}}>
					<Fab color="secondary" aria-label="Add" onClick={() => this.openModalAdd()}>
						<AddIcon/>
					</Fab>
				</div>
				<Modal effect="fadeInUp" visible={this.state.visibilityAdd} onClickAway={() => this.closeModalAdd()}>
				<form noValidate autoComplete="off">
							<TextField
								required
								id="standard-name"
								label="Nom du produit"
								onChange={(e) => this.setState({nom: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-type"
								label="Catégorie"
								onChange={(e) => this.setState({type: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-price"
								label="Prix (€)"
								onChange={(e) => this.setState({prix: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-rating"
								label="Note"
								onChange={(e) => this.setState({note: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-warranty"
								label="Durée Garantie"
								onChange={(e) => this.setState({garantie: e.target.value})}
								margin="normal"
							/>
							<br></br>
							<select value={this.state.age} onChange={(e) => this.setState({available: (e.target.value === 'true')})}>
								<option value={true}>Disponible</option>
								<option value={false}>Non</option>
							</select>
							<br></br>
							<Button variant="contained" size="small" color="primary" onClick={() => { this.addProduct()}}>Ajouter produit</Button>
						</form>
				</Modal>
			</Container>
		</div>
		);
	}
}

export default App;