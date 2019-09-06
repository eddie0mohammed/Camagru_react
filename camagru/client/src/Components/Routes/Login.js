import React, { Component } from 'react'
import {Typography, Grid, TextField, Button} from '@material-ui/core';
import {Link} from 'react-router-dom';
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

export default class Login extends Component {

	constructor() {
		super();

		this.state = {
			login: '',
			password: ''
		}
	}

	handleChange = (e) => this.setState({[e.target.name]: e.target.value});
	
	handleLogin = async (e) => {
		e.preventDefault();
		const {login, password} = this.state;
		const response = await axios.post("http://localhost:6357/auth/login", {email:login, password});
		const {data: {accessToken, success}} = await response;
		if (success && accessToken) {
			localStorage.setItem('camagru-access', accessToken);
			//attach authorization headers 
			axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
			this.props.authentificate(true);
			this.props.history.push('/main');
		} else {
			localStorage.deleteItem()
		}
	}

	render() {
		return (
		<Grid container alignItems="center" direction="column" style={styles.Grid}>
			<Grid item>
				<Typography variant="headline" style={{fontSize: '2em', padding: '20px', textTransform: 'capitalize'}}>
					Welcome!
				</Typography>
			</Grid>
			<Grid item>
				<TextField
					label="Login"
					placeholder="email"
					style={styles.textField}
					margin="normal"
					value={this.state.login}
					name="login"
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
				<Link to="/forgot" style={{textDecoration: "none"}}>
					<Typography variant="subheading" style={{margin: '20px'}}>
						<Button style={{textTransform: 'capitalize', color: "grey"}}>Forgot Password?</Button>
					</Typography>
				</Link>
			</Grid>
			<Grid item>
				<Button color="primary" onClick={this.handleLogin} style={{marginBottom: '30px'}}>
					Login
				</Button>
			</Grid>
		</Grid>
	)
  }
}
