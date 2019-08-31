import React from 'react'
import {AppBar, Toolbar, Typography} from '@material-ui/core';

const styles = {
	Footer: {
		top: 'auto',
		bottom: 0,
		position: 'relative'
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
}


export default function Footer() {
	return (
		<AppBar color="default" style={styles.Footer}>
			<Toolbar style={styles.toolbar}>
				<Typography variant="h6">
						Copyright 2019 &copy;
				</Typography>
			</Toolbar>
		</AppBar>
	)
}
