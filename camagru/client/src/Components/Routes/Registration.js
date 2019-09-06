import React from 'react'
import {Grid, Typography, Button, TextField} from '@material-ui/core';
import axios from 'axios';

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

export default class Registration extends React.Component {

	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			repassword: '',
			nickname: '',
			disabled: true	
		}
	}


	handleChange = e => {

		this.setState({[e.target.name]: e.target.value});
	}


	handleSubmit = (e) => {
	
		e.preventDefault();

		const {email, password, nickname} = this.state;
		
		axios.post('http://localhost:6357/auth/reg', {email, password, nickname});
		return this.props.history.push('/');
		
		// console.log('clicked');
	}

	
	render() {

		return (
				
				<Grid container alignItems="center" direction="column" style={styles.Grid}>
					<Grid item>
						<Typography variant="headline" style={{fontSize: '2em', padding: '20px', textTransform: 'uppercase'}}>
							Register
						</Typography>
					</Grid>
					<Grid item>
						<TextField
							label="Nickname"
							name="nickname"
							value={this.state.nickname}
							onChange={this.handleChange}
							style={styles.textField}
							margin="normal"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							type="email"
							label="Email"
							name="email"
							value={this.state.email}
							onChange={this.handleChange}
							style={styles.textField}
							margin="normal"
							required
						/>
					</Grid>
					<Grid item>
						<TextField
							error = {this.state.password !== this.state.repassword && this.state.repassword!==''}
							label="Password"
							style={styles.textField}
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
							autoComplete="current-password"
							margin="normal"
							required
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
							required
						/>
					</Grid>
					<Grid item>
						<Button color="primary" onClick={this.handleSubmit	} style={{margin: '20px', padding: '10px'}}>
							Register
						</Button>
					</Grid>
				</Grid>
				
			)
		}
}
 