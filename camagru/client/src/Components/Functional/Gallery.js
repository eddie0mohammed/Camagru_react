import React, { Component } from 'react'
import { Paper } from '@material-ui/core';
import Gallery from "react-photo-gallery";
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import "../../styles/Gallery.css";

class ShowCase extends Component {
	
	constructor(){
		super();

		this.state = {
			images: {}
		}
	}

	async componentDidMount() {
		this.updateInterval = setInterval(this.update.bind(this), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.updateInterval);
	}

	async update() {
		const response = await axios('http://localhost:6357/api/gallery');
		const {data:{data, success}} = response;
		const {images} = this.state;
		if (success) {
			data.forEach(im => {
				const img = im._doc;
				if (!images[img.imagePath])  {
				let imgObj = new Image();
				imgObj.src = img.imagePath;
				imgObj.onload = () => {
					const data= {
						width:imgObj.width,
						height:imgObj.height,
						src: img.imagePath,
						date: img.createdAt,
						id: img._id,
						"data-owned": im.owned
					}
					this.setState(prevState => ({
							images: Object.assign({}, prevState.images, {[img.imagePath]:data})					
					}), () => console.log('new update ', this.state.images[img.imagePath]))
				}
			}
		})
		}
	}

	handlePictureClick = (e, obj) => {
		console.log('clicked on ', obj);
		console.log('this.props ', this.props);
		this.props.history.push(`/picture/${obj.photo.id}`)
	}

	render() {
		const {images} = this.state;
		const pictures = Object.values(images).sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();
			return dateB - dateA;
		});

		return (
			<Paper className="galleryWrapper" style={{background: 'lightgrey'}}>
				<div>
					{pictures.length !== 0 ? 
						<Gallery photos={pictures} onClick={this.handlePictureClick}/>
						: null }
				</div>
			</Paper>
		)
	}
}

export default withRouter(ShowCase);