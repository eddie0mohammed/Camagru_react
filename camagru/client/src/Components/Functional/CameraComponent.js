import React, { Component } from 'react'
import Webcam from 'react-webcam';
import Canvas from './Canvas';
import Fab from '@material-ui/core/Fab';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Check from '@material-ui/icons/Check';
import "../../styles/Camera.css";

export default class CameraComponent extends Component {

	constructor() {
		super();

		this.state = {
			isWebCam: true,
			image: '',
			save: false
		}

	}

	capture = () => {
		const imageSrc = this.webcam.getScreenshot();
		this.setState(prevState => (
			{
				isWebCam: !prevState.isWebCam,
				image: imageSrc
			}));
	}


	save = () => {
		console.log('ready to save somehow! ', this.props);
		this.setState({save: true})
	}

	saveFeedBack = () => this.setState({save: false, isWebCam: true}, () => console.log('saveFeedback played'));

	setRef = webcam => { this.webcam = webcam;  };

	render() {
		const videoConstraints = {
			width: 1280,
			height: 720,
			facingMode: "user"
		};
		const {isWebCam, image} = this.state;
		return (
			<div className="screenWrapper">
			{isWebCam ? 
			<React.Fragment>
					<Webcam 
						videoConstraints={videoConstraints}
						screenshotQuality={1}
						width={'90%'}
						height={'100%'}
						ref={this.setRef}
						screenshotFormat="image/jpeg"
					/>
					<Fab size="small" color="secondary" aria-label="Add" className="cameraButton" onClick={this.capture}>
						<PhotoCamera fontSize={"small"}/>
					</Fab>
			</React.Fragment>
			:
			<React.Fragment>
					<Canvas 
						image={image}
						cleanSelection={this.props.cleanSelection}
						save={this.state.save}
						feedback = {this.saveFeedBack}
					/> 
					<Fab size="small" color="inherit" aria-label="Add" className="saveButton" onClick={this.save}>
						<Check fontSize={"small"}/>
					</Fab>
			</React.Fragment> }
			</div>			
		)
	}
}
