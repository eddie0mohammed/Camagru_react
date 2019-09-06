import React, { Component } from 'react'
import {Grid, TextField, Typography, Button} from '@material-ui/core';

import axios from "axios";

const styles= {
	Grid: {
		margin: '150px auto',
		// border: '1px solid black',
		boxShadow: '1px 3px 20px -5px rgba(0,0,0,0.75)',
		width: "50%",
	},
	textField: {
		width: 300
	}
}

export default class ForgotPassword extends Component {

	constructor() {
		super();

		this.state = { 
			email: '',
	
		}
	}

	handleChange = (e)  => this.setState({[e.target.name]: e.target.value});

	handleSend = async () => {
		const {email} = this.state;
		const response = await axios.post("http://localhost:6357/auth/forgot-password", {email});
		console.log('response ', response);
		const {data: {success, err}} = response;
		if (success)
			this.props.history.push('/');
		else
			console.log(err);
	}

	render() {
		return (
			<Grid container alignItems="center" direction="column" style={styles.Grid}>
			<Grid item>
				<Typography variant="h6" style={{marginTop: '20px', padding: '10px 40px', color:'grey'}}>
					We'll send you a link to reset your password
				</Typography>
			</Grid>
			<Grid item >
				<TextField
					label="Email"
					placeholder="email"
					style={styles.textField}
					margin="normal"
					value={this.state.email}
					name="email"
					onChange={this.handleChange}
				/>
			</Grid>
			
			<Grid item style={{margin: '20px'}}>
				<Button color="primary" onClick={this.handleSend}>
					Send
				</Button>
			</Grid>
		</Grid>
		)
	}
}
