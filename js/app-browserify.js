"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

import {Promise} from 'es6-promise'
import Backbone from 'backbone'
import $ from 'jquery'
import React, {Component} from 'react'
var Parse = window.Parse
import {PostStory, PostStoryList} from './post'

Parse.$ = $
Parse.initialize(`sR0yX3XlZSVU0nt7eFPKSITMJT3uwRJVnl3HMKMT`, `sv8ImqvJytt5B3lMyf2NwURN1iQUz54Gg2rGDbuF`)

var qs = (selector) => document.querySelector(selector) 

const stories = new PostStoryList()

// class NewPostView extends Component ({
// constructor(props){
// 		super(props)
// 		this.rerender = () => {
// 			this.props.data.save()
// 			this.forceUpdate()
// 		}
// 	}
// 	render() {
// 		return ( <div> 
// 				<label for 'title'> Write your Title. </label>
// 				<input type='text' name='title'ref='newtitle' placeholder='New Story'/>
// 				<label for 'src'> Share a picture with your story. </label>
// 				<input type ='text' name='src' ref='imgsrc' placeholder='Image Url'/>
// 				<textarea> Write Story Here. </textarea>
// 				<label for 'keywords'> Enter 3 story tags. </label>
// 				<input type ='text' name='keywords' ref='keywords' placehloder='Tags' required />
// 				<input type = 'checkbox' name='isPrivate' ref='isPrivate'checked={model.get('isPrivate')===true}>
// 				 <span> Make Story Private </span>
// 				</input>
// 				<button> Publish </button>
// 			</div>)
// 	}
// })

// class PostView extends Component({
// 	constructor(props){
// 		super(props)
// 		this.rerender = () => {
// 			this.props.storedPosts.save()
// 			this.forceUpdate()
// 		}
// 	}

// 	componentDidMount() {
// 		this.props.data.on('change', this.rerender)
// 	}
// 	componentDidUnMount() {
// 		this.props.data.off('change', this.rerender)
// 	}

// 	render(){
// 		var model = this.props.data
// 		var timestamp = model.get('timestamp')
// 		var 
// 		return(
// 			<div>
// 				<li className="post">
// 				<h3 contenteditable ref='title'> {model.get('title')} </h3>
// 				<h2 ref='author'> {model.get('username')} </h2>
// 				<img ref='src' src={model.get('src')}/>
// 				<p contenteditable ref='content'>{model.get('content')}</p>
// 				<p ref='tags'> {model.get('tags')} </p>
// 				<p ref='timestamp'> {model.get('timestamp')} </p>
// 				<button ref='recommend'> Recommend </button>
// 				</li>
// 			</div>
// 		)
// 	}
// })


// class PostListView extends Component{
// 	constructor(props){
// 		super(props)
// 		this.rerender = () => {
// 			this.props.storedPosts.save()
// 			this.forceUpdate()
// 		}
// 	}

// 	componentDidMount() {
// 		this.props.data.on('change', this.rerender)
// 	}

// 	componentDidUnMount() {
// 		this.props.data.off('change', this.rerender)
// 	}

// 	render(){
// 		return(<div className='homescreen'> 
// 			<ul> 
// 				{this.props.data.map((model)=> <PostView data={model} />)}
// 			</ul>
// 		</div>)
// 	}
// }


class LoginView extends Component{
	constructor(props){
		super(props)
		this.state = {
			error: 0
		}
	}

	_registerUser(e){
		e.preventDefault()
		var user = new Parse.User(),
			firstName = React.findDOMNode(this.refs.firstname).value,
			lastName = React.findDOMNode(this.refs.lastname).value,
			email = React.findDOMNode(this.refs.email).value,
			password = React.findDOMNode(this.refs.newPassword).value,
			username = React.findDOMNode(this.refs.newUsername).value

		user.set ({
			firstname: firstName,
			lastname: lastName,
			email: email,
			password: password,
			username: username
		})

		var signup = user.signUp()
		signup.then(()=> window.location.hash = '#home')
		signup.fail(() => {
			alert('Sign Up failed')
		})
	}

	_signIn(e) {
		e.preventDefault()
		var login = Parse.User.logIn(this.username, this.password, {
			success: (login) => {
				window.location.hash = '#home'
			},
			error: (login) => {
				this.setState({error: this.state.error + 1})
				alert('happy friday')
			}
		})
	}

	render(){
		return(<div>
			<h3>Login Here</h3>
			<form>
				Enter Username: <input type="text" ref="username" />
				Enter Password: <input type="password" ref="password" />
				<button onClick={(e)=> this._signIn(e)}>Sign In</button>
			</form>

			<h3>Sign Up</h3>
			<form>
				First Name: <input type="text" ref="firstname" />
				Last Name: <input type="text" ref="lastname" />
				Email: <input type="email" ref="email" />
				Username: <input type="text" ref="newUsername" />
				Password: <input type="password" ref="newPassword" />
				<button onClick={(e) => this._registerUser(e)} >Join the Charge</button>
			</form>
		</div>
		)
	}
}

// class Toolbar extends Component{
// 	constructor(props){
// 		super(props)
// 	}

// 	render(){
// 		return(
// 		<div>
// 			<h1>Milieu</h1>
// 		</div>
// 	)

// 	}
// }




var ParseRouter = Parse.Router.extend({
	routes: {
		'home':'home',
		'profile': 'profile',
		'story': 'story',
		'*default': 'login'
	}, 

	login: () => {
		if(Parse.User.current()){
			window.location.hash = '/home'
			return
		}
		React.render(<LoginView />, qs('.container'))
	},

	home: () => {
		if(!Parse.User.current()){
			window.location.hash = '/login'
			return
		}
		stories.fetch()
		React.render(<PostListView stories={storedPosts} />, qs('.container'))
	},

	story: () => {
		if(!Parse.User.current()){
			window.location.hash = '/login'
			return
		}
		React.render(<PostView />, qs('.container'))
	},

	profile: () => {
		if(!Parse.User.current()){
			window.location.hash = '/login'
			return
		}
		React.render(<ProfileView />, qs('.container'))
	},

	initialize: () => {
		Parse.history.start()
	}
})

var router = new ParseRouter() 