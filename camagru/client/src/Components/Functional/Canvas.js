import React, { Component } from 'react'
import axios from 'axios';

export default class Canvas extends Component {


	constructor(props) {
		super(props);
		this.state = {
			stickers: [],
			saveToggle: false
		}
	}	

	async componentDidUpdate(prevProps) {
		if (prevProps.save !== this.props.save){
			const {save, feedback} = this.props;
			console.log('save = ', save);
			const DataURL = this.canvas.toDataURL();
			const result = await axios.post("http://localhost:6357/api/addPicture", {base64: DataURL});
			console.log('result = ', result);
			this.setState({saveToggle: true}, feedback);
		}
	}	

	componentDidMount() {
		this.setState({saveToggle: false});
		this.canvas = this.refs.canvas;
		this.ctx =  this.canvas.getContext("2d");
		const background = this.refs.background;
		background.onload = () => {
			const height = background.width / background.naturalWidth * background.naturalHeight
			this.fitToContainer(height, background.width);
			this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
		}
		this.Redraw = setInterval(() => this.redraw(), 100);
	}

	fitToContainer(height, width) {
		this.canvas.width=width;
		this.canvas.height=height;
	}

	redraw() {
		const {stickers} = this.state;
		for (let i = 0; i< stickers.length; i++) {
				stickers[i].image =  new Image();
				stickers[i].image.src=stickers[i].path;
				stickers[i].image.onload = () => {
					this.ctx.drawImage(stickers[i].image, stickers[i].pos.x - 50,stickers[i].pos.y-50, 100, 100);
				}
		}
	}

	getMousePos(e) {
		const rect = this.canvas.getBoundingClientRect();

		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;

		const width = rect.right - rect.left;
		if (this.canvas.width !== width) {
			const height = rect.bottom  - rect.top;
			x = x*(this.canvas.width / width);
			y = y * (this.canvas.height / height);
		}
		return {
			x, y
		}
	}


	handleClick(e) {
		const stickerContainer = document.querySelector('#sticker>div');
		if (!stickerContainer)
			return ;
		const stickerPath =stickerContainer.dataset.name;
		
		const pos = this.getMousePos(e);
		const img = new Image();
		img.src = stickerPath;
		const sticker = {
			path: stickerPath,
			pos,
		}
		this.props.cleanSelection();
		this.setState(prevState => ({stickers: [...prevState.stickers, {...sticker}]}), () => console.log('this.state = ', this.state));
	}


	render() {
		const {image} = this.props;
		return (
			<div className="canvasWrapper">
				<canvas ref="canvas" width="calc(100%)" height="calc(100%)"  onClick={this.handleClick.bind(this)}/>
				<img ref="background" src={image} alt="background"  style={{display:'none'}}/>
			</div>
		)
	}
}
