import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import {Paper} from '@material-ui/core';


class Sticker extends Component {
	constructor(props) {
		super(props);
		this.home = document.querySelector('#sticker');
		this.state  = {
			image: props.image,
			render: true
		}
	}


	componentDidUpdate(nextProps) {
		if (nextProps.image !== this.state.image) {
			this.elemRef = React.createElement('img', 
			{
				src: nextProps.image,
				key:"sticker",
			});
			this.container = React.createElement('div', {"data-name":nextProps.image}, [this.elemRef]);
			this.setState({image: nextProps.image, render: true});
		}
		
		if (nextProps.cleanSelection && nextProps.cleanSelection === this.state.render) {
			this.cleanout(nextProps.feedback);	
		}
	}

	componentDidMount() {
		const {image} = this.props;
		this.elemRef = React.createElement('img', 
			{
				src: image,
				key:"sticker",
			});

		this.container = React.createElement('div', {"data-name": image}, [this.elemRef]);
	}

	cleanout(feedback) {
		feedback();
		this.props.parentfix();
		this.setState({image: undefined});
	}

	render() {
		return ReactDOM.createPortal(this.container, this.home);
	}

}

export default class Stickers extends Component {
	
	constructor() {
		super();

		const stickersPath = [
			'/stickers/sticker1.png',
			// '/stickers/sticker2.png',
			'/stickers/sticker3.png',
			'/stickers/sticker4.png',
			'/stickers/sticker5.png',
			'/stickers/sticker6.png',
		];
		const stickerElems = stickersPath.map((sticker, index) => 
		<div
				className="sticker"
				key={index}
				onClick={() => this.selectSticker(sticker)}
		>
			<img src={sticker} alt="sticker" style={{height: '200px', margin: '10px'}}/>
		</div>
		)

		this.state = {
			stickers: stickerElems,
		}
	}

	selectSticker = (sticker) => {
		this.setState({selectedSticker: sticker});
	}

	unmountSticker = () => this.setState({selectedSticker: undefined})

	render() {
		const {stickers, selectedSticker} = this.state;
		const {cleanSelection, feedback} = this.props;
		return (
			<Paper className="stickerWrapper">	
					{stickers}
					{selectedSticker ? 
					<Sticker image={selectedSticker} cleanSelection={cleanSelection} feedback={feedback} parentfix={this.unmountSticker}/> : null }
			</Paper>			
		)
	}
}
