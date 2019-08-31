import React, { Component } from 'react'
import axios from 'axios';

import { Paper, TextField, Fab, Typography } from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';

import "../../styles/Picture.css";

const styles= {
	Grid: {
		marginTop: 20
	},
	textField: {
	}
}


export default class Picture extends Component {

	constructor(props) {
		super(props);

		this.state = {
			image: {},
			comment: '',
			comments: [],
		}
	}

	async componentDidMount() {
		const {id} = this.props.match.params;
		const response = await axios(`http://localhost:6357/api/picture/${id}`);
		console.log('response = ', response);
		if (response.data.success) {
			this.setState({...response.data.data});
		}

		const canDeleteResponse = await axios(`http://localhost:6357/api/picture/${id}/can-delete`);
		if (canDeleteResponse.data.success)
			this.setState({owned: true});
	}

	handleChange = (e) => this.setState({[e.target.name]: e.target.value});

	handleCom = async (e) => {
		console.log('adding this comment ', this.state.comment, this.props);
		const {match: {params: {id}}} = this.props;
		const {comments} = this.state;
		const response = await axios.post(`http://localhost:6357/api/add-comment/${id}`, {
			text: this.state.comment
		});
		console.log('response = ', response);
		const cmt = response.data.data;
		comments.push(cmt);
		this.setState({comment: '', comments});
	}

	handleLike = async (e, obj, index) => {
		console.log('clicked here ', obj);
		const {_id} = obj;
		const {comments} = this.state;
		const response = await axios(`http://localhost:6357/api/like/${_id}`);
		console.log(response);
		if (response.data.success) {
			const comment = comments.splice(index, 1);
			comment[0].likes += 1;
			comments.push(comment[0]);
			console.log('comments = ', comments);
			this.setState({comments});
		}
	}

	sort = (a, b) => {
		const dateA = new Date(a.createdAt).getTime();
		const dateB = new Date(b.createdAt).getTime();
		return dateB - dateA;
	}

	async delete(e) {
		const response = await axios.delete('http://localhost:6357/api/deletePicture', {data: {pictureID: this.state.image._id}});
		const {success, err} = await response.data;
		if (success) {
			return this.props.history.push('/');
		}
		else 
			this.setState({errMessage: err});
	}

	render() {
		const {comments} = this.state;
		return (
			<React.Fragment>
				<Paper className="picture">
					<img src={this.state.image.imagePath} alt="img" />
					<Clear className="delete" fontSize="large" onClick={this.delete.bind(this)}/>
				</Paper>
					<Paper className="picture">
								<TextField
									id="standard-textarea"
									label="Commentary"
									style={styles.textField}
									margin="normal"
									value={this.state.comment}
									name="comment"
									multiline
									fullWidth
									onChange={this.handleChange}
								/>
								<Fab color="primary" aria-label="Add"  sm={4} onClick={this.handleCom}>
									<AddIcon />
								</Fab>
					</Paper>
					{comments.sort(this.sort).map((comment,  index) => (
						<Paper className="disput" key={index} onDoubleClick={(e) => this.handleLike(e, comment, index)}>
							<Typography variant="body1">
								{comment.text}
							</Typography>
							<Typography variant="caption" className="author">
									by {comment.author.nickname}
							</Typography>
							<Typography variant="caption" className="likes">
									likes: {comment.likes}
							</Typography>
						</Paper>
					))}
				
			</React.Fragment>
		)
  	}
}
