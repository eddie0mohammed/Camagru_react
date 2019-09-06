import React from 'react'
import {AppBar, Toolbar, Typography} from '@material-ui/core';

const styles = {
	Footer: {
		top: 'auto',
		bottom: 0,
		position: 'absolute'
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#333'
	}
}


export default function Footer() {
	return (
		<AppBar color="default" style={styles.Footer}>
			<Toolbar style={styles.toolbar}>
				<Typography variant="h6" style={{color: 'white'}}>
						camagru&copy;2019 
				</Typography>
			</Toolbar>
		</AppBar>
	)
}
