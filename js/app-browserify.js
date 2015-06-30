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

//Profile View:
import {frontOfCoin} from './frontOfCoin'

Parse.$ = $
Parse.initialize(`sR0yX3XlZSVU0nt7eFPKSITMJT3uwRJVnl3HMKMT`, `sv8ImqvJytt5B3lMyf2NwURN1iQUz54Gg2rGDbuF`)

var qs = (selector) => document.querySelector(selector) 

const stories = new PostStoryList()

class Toolbar extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(<div className="toolbar">
			<div>
				<svgIcon />
				<p>Milieu</p>
			</div>
			
			<form>
				<input type="text" ref="searchMilieu" placeholder="Search for a story." />
			<button> Avatar </button>
			<button onClick={() => Parse.User.logOut()}>Logout</button>
			</form>
		</div>)
	}
}

class NewStory extends Component {
	constructor(props){
		super(props)
		this.rerender = () => {
            this.props.newBlogPostModel.save()
            this.forceUpdate()
        }
	}
	// componentDidMount(){
 //        this.props.newBlogPostModel.on('change', this.rerender)
 //    }
 //    componentDidUnmount(){
 //        this.props.newBlogPostModel.off('change', this.rerender)
 //    }

	
	_publish(e){
		// var imgSrc = React.findDOMNode(this.refs.imgsrc).innerHTML
		// this.props.newBlogPostModel.set('src', imgSrc)
		var content = React.findDOMNode(this.refs.storyContent).innerText
        this.props.newBlogPostModel.set('content', content)
        var keywords = React.findDOMNode(this.refs.keywords).value
       	this.props.newBlogPostModel.set('tags', keywords)
	}

	render(){
		var model = this.props.newBlogPostModel
		if(!this.props.title){
			return (<div></div>)
		} else{
			return (<div>
				<h3 contentEditable>{this.props.title}</h3>
				<label for = 'src'> Share a picture with your story. </label>
				<input type = 'url' name='src' ref='imgsrc' placeholder='Image Url'/> 
				<textarea ref='storyContent' placeholder="Share your story."></textarea>
				<label for = 'keywords'> Enter 3 story tags. </label>
				<input type ='text' name='keywords' ref='keywords' placehloder='Tags' />
				<label for='isPrivate'> Make Story Private </label>
				<input type = 'checkbox' name='isPrivate' ref='isPrivate'/>
				<button onClick={(e) => this._publish(e)}> Publish </button>
			</div>
			)
		}
	}
}

class ProfileView extends Component {
	constructor(props){
		super(props)
		this.state = {
			title: null,
			workingModel: null
		}
		this.rerender = () => this.forceUpdate()
	}

    componentDidMount(){
        this.props.storedPosts.on('update sync', this.rerender)
    }

    componentDidUnmount(){
        this.props.storedPosts.off('update sync', this.rerender)
    }

	_newStory(e){
		e.preventDefault()
		var title = React.findDOMNode(this.refs.newTitle)
		this.setState({title: title.value})
		var model = new PostStory({title: this.state.title})
		this.setState({workingModel : model})
		this.props.storedPosts.create(model)
		title.value = ""
		
	}

	render() { 
		return (<div>
			<Toolbar />
			<form> 
				<label for = 'title'> Write your Title. </label>
				<input type='text' name='title' ref='newTitle' placeholder='New Story'/>
				<button onClick={(e) => this._newStory(e)}> + </button> 
			</form>
			<ul className="savedStory">
			{<NewStory newBlogPostModel={this.state.workingModel} title={this.state.title} />}
			</ul>
			<hr />
			<h3>Your previous stories.</h3>
		</div>)
	}
}

class PostView extends Component{
	constructor(props){
		super(props)
	}

	render(){
		var model = this.props.storedPost
		// var timestamp = model.get('timestamp')
		return(
			<div>
				<li className="post">
				<h3 contenteditable ref='title'> {model.get('title')} </h3>
				<h2 ref='author'> {model.get('username')} </h2>
				<img ref='src' src={model.get('src')}/>
				<p contenteditable ref='content'>{model.get('content')}</p>
				<p ref='tags'> {model.get('tags')} </p>
				<p ref='timestamp'> {model.get('timestamp')} </p>
				<button ref='recommend'> Recommend </button>
				</li>
			</div>
		)
	}
}

class PostListView extends Component{
	constructor(props){
		super(props)
		this.rerender = () => {
			this.props.storedPosts.save()
			this.forceUpdate()
		}
	}

	componentDidMount() {
		this.props.storedPosts.on('change', this.rerender)
	}

	componentDidUnMount() {
		this.props.storedPosts.off('change', this.rerender)
	}

	render(){
		return(<div className='homescreen'> 
			<ul> 
				{this.props.storedPosts.map((model)=> <PostView storedPost={model} />)}
			</ul>
		</div>)
	}
}

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
		signup.then(()=> {
			alert("Welcome to Milieu")
			window.location.hash = '/profile'
		})
		signup.fail(() => {
			alert('Sign Up failed')
		})
	}

	_signIn(e) {
		e.preventDefault()
		var username = React.findDOMNode(this.refs.username).value,
			password = React.findDOMNode(this.refs.password).value

		var login = Parse.User.logIn(username, password, {
			success: (login) => {
				window.location.hash = '/profile'
			},
			error: (login) => {
				this.setState({error: this.state.error + 1})
				alert('try that again buddy')
			}
		})
	}

	render(){
		return(<div>
			<div className="rotationContainer">
				<frontOfCoin />
			</div>
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
				<button onClick={(e) => this._registerUser(e)}>Join the Charge</button>
			</form>
		</div>
		)
	}
}

var ParseRouter = Parse.Router.extend({
	routes: {
		'home':'home',
		'profile': 'profile',
		'story': 'story',
		'*default': 'login'
	}, 

	login: () => {
		if(Parse.User.current()){
			window.location.hash = '/profile'
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
		React.render(<PostListView storedPosts={stories} />, qs('.container'))
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
		stories.fetch()
		React.render(<ProfileView storedPosts={stories}/>, qs('.container'))
	},

	initialize: () => {
		Parse.history.start()
	}
})

var router = new ParseRouter() 

