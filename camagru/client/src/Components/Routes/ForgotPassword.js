import React, { Component } from 'react'
import {Grid, TextField, Typography, Button} from '@material-ui/core';

import axios from "axios";

const styles= {
	Grid: {
		marginTop: 20
	},
	textField: {
		width: 200
	}
}

export default class ForgotPassword extends Component {

	constructor() {
		super();

		this.state = { 
			email: '',
			password: '',
			repassword: '',
		}
	}

	handleChange = (e)  => this.setState({[e.target.name]: e.target.value});

	handleSend = async () => {
		const {email, password} = this.state;
		const response = await axios.post("http://localhost:6357/auth/forgot-password", {email, password});
		console.log('response ', response);
		const {data: {success, err}} = response;
		if (success)
			this.props.history.push('/');
	}

	render() {
		return (
			<Grid container alignItems="center" direction="column" style={styles.Grid}>
			<Grid item>
				<Typography variant="display1" >
					Remind who are you?
				</Typography>
			</Grid>
			<Grid item>
				<TextField
					id="standard-textarea"
					label="Email"
					placeholder="email"
					style={styles.textField}
					margin="normal"
					value={this.state.email}
					name="email"
					onChange={this.handleChange}
				/>
			</Grid>
			<Grid item>
						<TextField
							error = {this.state.password !== this.state.repassword && this.state.repassword!==''}
							id="standard-password-input"
							label="New password"
							style={styles.textField}
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
							autoComplete="current-password"
							margin="normal"
						/>
					</Grid>
					<Grid item>
						<TextField
							error = {this.state.password !== this.state.repassword}
							label="Repeat-password"
							style={styles.textField}
							name="repassword"
							value={this.state.repassword}
							onChange={this.handleChange}
							type="password"
							autoComplete="current-password"
							margin="normal"
						/>
					</Grid>
			<Grid item>
				<Button color="primary" onClick={this.handleSend}>
					Send
				</Button>
			</Grid>
		</Grid>
		)
	}
}
