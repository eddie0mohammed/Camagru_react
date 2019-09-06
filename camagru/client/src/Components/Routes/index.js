import React from 'react'
import Login from './Login';
import {Route, Switch} from 'react-router-dom';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import Main from './Main';
import ChangePassword from './ChangePassword';
import ProfileSettings from './ProfileSettings';
import Picture from './Picture';

const CheckAuth = ({auth, authentificate, PassC,  ...rest}) => {
	if (auth) 
		return <Route {...rest} render={props => <PassC {...props}/> }/>;
	return <Route {...rest} render={props => <Login {...props} authentificate={authentificate}/> } />;
}

export default function Routes({auth, authentificate}) {
	return (
		<React.Fragment>
			<Switch>
				<Route exact path="/registration" component={Registration} />
				{auth ? <Route exact path ="/" component={Main} authentificate={authentificate} /> 
					: <Route exact path="/" render={props => <Login {...props} authentificate={authentificate}/>} />
				}
				<CheckAuth   auth={auth} PassC={Main} authentificate={authentificate} exact path="/main"/>
				<Route exact path="/forgot" component={ForgotPassword} />
				<Route exact path="/changePass/:token" component={ChangePassword} />
				<CheckAuth auth={auth} PassC={ProfileSettings} authentificate={authentificate} exact path="/profile/"/>
				<CheckAuth auth={auth} PassC={Picture} authentificate={authentificate} exact path="/picture/:id" />
			</Switch>
		</React.Fragment>
	);
} 