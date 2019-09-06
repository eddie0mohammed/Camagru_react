import React, { Component } from 'react'
import axios from 'axios';
import {Grid, TextField, Typography, Button} from '@material-ui/core';

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
				<Typography variant="h6" style={{marginTop: '20px', padding: '10px 40px', color:'grey'}}>
					Enter your new password
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
				<Button color="primary" onClick={this.handleSend} style={{margin: '20px'}}>
					Send
				</Button>
			</Grid>
		</Grid>
		)
	}
}
