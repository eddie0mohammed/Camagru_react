
const checkStatus = ({success, history}) => {
	if (success)
		return history.push('/main');

	history.push('/');
}

module.exports = checkStatus;