import React, { Component } from 'react'
import axios from 'axios';


import {Grid, TextField, Button, Typography} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
const styles = {
	Grid: {
		margin: '150px auto',
		// border: '1px solid black',
		boxShadow: '1px 3px 20px -5px rgba(0,0,0,0.75)',
		width: "50%",
	}
}

export default class ProfileSettings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			nickname: '',
			email: '',
			password: '',
			isChecked: false
		}
	}

	handleChange = (e) => this.setState({[e.target.name]: e.target.value});

	handleCheckBox = (e) => this.setState(prevState => ({isChecked: !prevState.isChecked}));

	handleEdit = async () => {
		const {nickname, email, password, isChecked} = this.state;
		const response = await axios.post("http://localhost:6357/api/editProfile", {nickname, email, password, sendNotification: isChecked});
		if (email !== '')
			return this.props.history.push('/');
		window.location.reload();
		console.log(response);
	}

	render() {
		return (
			
				<Grid container alignItems="center" direction="column" style={styles.Grid}>
				<Grid item>
					<Typography variant="h6" style={{marginTop: '20px', padding: '10px 40px', color:'grey'}}>
						Profile Settings
					</Typography>
				</Grid>
					<Grid item>
						<TextField
						label="nickname"
						placeholder="nickname"
						style={styles.textField}
						margin="normal"
						value={this.state.nickname}
						name="nickname"
						onChange={this.handleChange}
						/>
					</Grid>	
					<Grid item>
						<TextField
						label="email"
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
							label="Password"
							placeholder="password"
							style={styles.textField}
							type="password"
							autoComplete="current-password"
							margin="normal"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
						/>
					</Grid>
					<Grid item>
						<Typography variant="body1" style={{margin: '10px'}}><Checkbox checked={this.state.isChecked} onChange={this.handleCheckBox}/>Enable notifications via email</Typography>
					</Grid>
					<Grid item>
						<Button color="primary" onClick={this.handleEdit} size="large" style={{margin: '20px'}}>
							Update
						</Button>
					</Grid>
				</Grid>
		)
	}
}
