import React, { Component } from 'react'
import axios from 'axios';
import checkStatus from '../../helpers';
import CameraComponent from '../Functional/CameraComponent';
import Stickers from '../Functional/Stickers';
import ShowCase from '../Functional/Gallery';

export default class Main extends Component {

	constructor() {
		super();

		this.state = {
			x: 0,
			y: 0,
			cleanSelection: false,
			updateGallery: false
		};

	}

	async componentDidMount() {
		const response = await axios('http://localhost:6357/auth/checkAuth');
		const {data: {success}} = await response;
		const options = {success, history: this.props.history};
		// check auth
		checkStatus(options);	
		this.selectedSticker = document.querySelector("#sticker");
	}

	_onMouseMove(e) {
		const {pageX, pageY} = e.nativeEvent;
		if (this.selectedSticker)
			this.selectedSticker.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
		this.setState({x:pageX, y: pageY})
	}

	_onTouchMove(e) {
		const x = e.nativeEvent.pageX;
		const y = e.nativeEvent.pageY;
		if (this.selectedSticker)
			this.selectedSticker.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		this.setState({x, y});
	}

	updateGallery = () => this.setState({updateGallery: true});
	updateGalleryFeedback = () => this.setState({updateGallery: false});

	cleanSelection = () => this.setState({cleanSelection: true}, () => console.log('clean selection from main ', this.state.cleanSelection));

	cleanSelectionFeedback = () => this.setState({cleanSelection: false}, () => console.log('selection feedback fired'));

	render() {
		return (
				<div 
					onMouseMove={this._onMouseMove.bind(this)} 
					onTouchMove={this._onTouchMove.bind(this)}
				>
					<CameraComponent 
						cleanSelection={this.cleanSelection}
						gallery= {{update: this.updateGallery, feedback: this.updateGalleryFeedback}}
					/>
					<Stickers cleanSelection={this.state.cleanSelection} feedback={this.cleanSelectionFeedback}/>
					<ShowCase update={this.state.updateGallery}/>
				</div>
		)
	}
}
