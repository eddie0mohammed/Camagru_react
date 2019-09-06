import React from 'react'
import {AppBar, Toolbar, IconButton, Typography, Button} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToApp from '@material-ui/icons/ExitToApp';
import {Link} from 'react-router-dom';
import axios from 'axios';

const styles = {
	Menu: {
		marginLeft: -12,
		marginRight: 20,
		
	},
	Name: {
		flexGrow: 1
	},
	Container: {
		flexGrow: 1,
		
	},
	Links: {
		color: "inherit",
		textDecoration: "none"
	}
}


const LogOut = (authentificate) => {
	localStorage.removeItem('camagru-access');
	authentificate(false);
}

export default class Header extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nickname: '',
			auth: false
		}
	}

	async componentDidMount() {
		const user = await axios.get("http://localhost:6357/api/user");
		const {data: {success, data}} = user;
		if (success) {
			const {nickname} = data;
			this.setState({nickname});			
		} else {LogOut(this.props.authentificate)};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.auth !== state.auth) {
			return {auth: props.auth}
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (prevProps.auth !== this.props.auth) {
			const user = await axios.get("http://localhost:6357/api/user");
			const {data: {success, data}} = user;
			if (success) {
				const {nickname} = data;
				this.setState({auth: this.props.auth, nickname});
			} else LogOut(this.props.authentificate);
		}
	}

	render() {	
		const {auth, authentificate} = this.props;
		return (
			<div style={styles.Container}>
				<AppBar position="static" style={{background: '#333'}}>
					<Toolbar>
						<IconButton  color="inherit" aria-label="Menu" style={styles.Menu} component={Link} to="/profile">
							<MenuIcon />
						</IconButton>
							<Typography variant="h6" color="inherit"  style={styles.Name}>
								<Link to="/" style={{textDecoration:"none"}}><Button style={{color: 'white'}}>Take a picture</Button></Link>
							</Typography>
							
							<Typography variant="h6" color="inherit"  style={styles.Name}>
								CAMAGRU
							</Typography>
							
							{auth ?
								<React.Fragment>
									<Typography variant="h6" color="inherit">
										{this.state.nickname}
									</Typography>
									<IconButton color="inherit" component={Link} to="/" onClick={() => {this.setState({nickname: ''}); return LogOut(authentificate)}}>
										<ExitToApp />
									</IconButton>
								</React.Fragment>
							:
								<React.Fragment>
										<Button color="inherit" component={Link} to="/">		
												Login
										</Button>
										<Button color="inherit" component={Link} to="/registration">	
												Register
										</Button>
								</React.Fragment>
							}
					</Toolbar>
				</AppBar>
			</div>
		)
	}
}