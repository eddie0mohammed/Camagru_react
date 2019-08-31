import React, { Component } from 'react';
import {Header, Footer} from './Components/Layouts';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Components/Routes';

class App extends Component {

	constructor() {
		super();

		this.state = {
			auth: false,
		}
	}

	componentDidMount() {
		const {auth} = this.props;
		if (auth) {
			return this.setState({auth: true});
		}
	}

	authentificate = (auth) => this.setState({auth});

	render() {
		const {auth} = this.state;
		return (
			<div className="app">
				<Router>
					<Header auth={auth} authentificate={this.authentificate}/>
						<Routes auth={auth} authentificate={this.authentificate}/>
					<Footer />
				</Router>
			</div>
		);
	}
}

export default App;