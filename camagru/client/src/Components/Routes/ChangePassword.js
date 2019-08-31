import React, { Component } from 'react'
import axios from 'axios';
import {Grid, TextField, Typography, Button} from '@material-ui/core';

const styles= {
	Grid: {
		marginTop: 20
	},
	textField: {
		width: 200
	}
}

export default class ChangePassword extends Component {

	constructor(props) {
		super(props);

		this.state = {
			password: '',
			repassword: ''
		}
	}

	handleChange = (e)  => this.setState({[e.target.name]: e.target.value});

	handleSend = async () => {
		const {password} = this.state;
		const {match: {params: {token}}} = this.props;
		const response = await axios.post(`http://localhost:6357/auth/forgot-password/${token}`, {password});
		console.log('response ', response);
		const {data: {success}} = response;
		if (success)
			this.props.history.push('/');
	}

	render() {
		return (
			<Grid container alignItems="center" direction="column" style={styles.Grid}>
			<Grid item>
				<Typography variant="display1" >
					Change you passphrase bellow
				</Typography>
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
