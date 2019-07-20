import React, { Component } from 'react';
import './App.css';
import { Button , Box, Table, TableBody, TableCell, TableHead, TableRow, TextField} from '@material-ui/core';
import Modal from 'react-awesome-modal';
import axios from 'axios';

class Product extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visibility: false,
			visibilityModif: false,

			id: this.props.el._id,
			nom: this.props.el.name,
			type: this.props.el.type,
			prix: this.props.el.price,
			note: this.props.el.rating,
			garantie: this.props.el.warranty_years,
			available: this.props.el.available,
		};
	}

	toggleOnModal() {
		this.setState({visibility: true});
	}
	toggleOffModal() {
		this.setState({visibility: false});
	}
	toggleOnModalMod() {
		this.setState({visibilityModif: true});
	}
	toggleOffModalMod() {
		this.setState({visibilityModif: false});
	}

	handleDelete() {
		this.toggleOffModal();
		this.props.deleteProd();
	}

	updateProduct() {
		let currentComponent = this;
		axios.post('http://localhost:3001/updateProduct/'+this.state.id, {
			name: this.state.nom,
			type: this.state.type,
			price: this.state.prix,
			rating: this.state.note,
			warranty_years: this.state.garantie,
			available: this.state.available,	
		}).then(function (response) {
			if (!response.data.error) {
				currentComponent.toggleOffModalMod();
				currentComponent.props.getProd();
			}
			alert(response.data.message);
		});
	}

	render() {
		return (
			<div style={{marginBottom: "1%"}}>
				<Box border={1}>
					<p style={{textAlign: "center", textDecoration: "underline", fontWeight: "bold"}}>{this.props.el.name} # {this.props.el._id}</p>
					<p style={{textAlign: "center", marginTop:"-2%", color:"red"}}>{this.props.el.price} €</p>
					<Button style={{width:"100%"}} variant="contained" size="small" color="primary" onClick={(e) => { this.toggleOnModal(e) }}>Plus d'infos</Button>
					<Modal effect="fadeInUp" visible={this.state.visibility} onClickAway={() => this.toggleOffModal()}>
						<svg onClick={() => this.toggleOffModal()} style={{width:"24px", height: "24px", right: "100%"}} viewBox="0 0 24 24">
							<path fill="#000000" d="M10.5,7A6.5,6.5 0 0,0 4,13.5A6.5,6.5 0 0,0 10.5,20H14V18H10.5C8,18 6,16 6,13.5C6,11 8,9 10.5,9H16.17L13.09,12.09L14.5,13.5L20,8L14.5,2.5L13.08,3.91L16.17,7H10.5M18,18H16V20H18V18Z" />
						</svg>
						<svg onClick={() => this.toggleOnModalMod()} style={{width: "24px", height:"24px"}} viewBox="0 0 24 24">
							<path fill="#000000" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
						</svg>
						<svg onClick={() => this.handleDelete()} style={{width: "24px", height: "24px"}} viewBox="0 0 24 24">
							<path fill="#000000" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
						</svg>
						<Table width="100%">
							<TableHead>
								<TableRow>
									<TableCell>Nom du produit</TableCell>
									<TableCell>Catégorie</TableCell>
									<TableCell>Prix</TableCell>
									<TableCell>Note</TableCell>
									<TableCell>Durée Garantie</TableCell>
									<TableCell>Disponibilité</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell component="th" scope="row" style={{textAlign: "center"}}>{this.props.el.name}</TableCell>
									<TableCell style={{textAlign: "center"}}>{this.props.el.type}</TableCell>
									<TableCell style={{textAlign: "center"}}>{this.props.el.price} €</TableCell>
									<TableCell style={{textAlign: "center"}}>{this.props.el.rating} / 5</TableCell>
									<TableCell style={{textAlign: "center"}}>{this.props.el.warranty_years} an(s)</TableCell>
									<TableCell style={{textAlign: "center"}}>
									{ (this.props.el.available) ?
										<svg style={{width: "24px", height: "24px"}} viewBox="0 0 24 24">
											<path fill="#000000" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
										</svg>
										:
										<svg style={{width:"24px", height:"24px"}} viewBox="0 0 24 24">
											<path fill="#000000" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
										</svg>
									}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Modal>
					<Modal effect="fadeInUp" visible={this.state.visibilityModif} onClickAway={() => this.toggleOffModalMod()}>
						<form noValidate autoComplete="off">
							<TextField
								required
								id="standard-name"
								label="Nom du produit"
								defaultValue={this.props.el.name}
								onChange={(e) => this.setState({nom: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-type"
								label="Catégorie"
								defaultValue={this.props.el.type}
								onChange={(e) => this.setState({type: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-price"
								label="Prix (€)"
								defaultValue={this.props.el.price}
								onChange={(e) => this.setState({prix: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-rating"
								label="Note"
								defaultValue={this.props.el.rating}
								onChange={(e) => this.setState({note: e.target.value})}
								margin="normal"
							/>
							<TextField
								required
								id="standard-warranty"
								label="Durée Garantie"
								defaultValue={this.props.el.warranty_years}
								onChange={(e) => this.setState({garantie: e.target.value})}
								margin="normal"
							/>
							<br></br>
							<select value={this.state.age} onChange={(e) => this.setState({available: (e.target.value === 'true')})}>
								<option value={true}>Disponible</option>
								<option value={false}>Non</option>
							</select>
							<br></br>
							<Button variant="contained" size="small" color="primary" onClick={() => { this.updateProduct()}}>Enregistrer modifications</Button>
						</form>
					</Modal>
				</Box>
			</div>
		)};
}

export default Product;