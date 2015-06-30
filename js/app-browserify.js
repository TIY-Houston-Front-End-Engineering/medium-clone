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

class svgIcon extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<span><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M65.768,26.221v6.836h-5.18l6.107,36.226c0,0-13.58,11.996-14.393,26.85   c0.211,0.379,0.33,0.813,0.33,1.275c0,1.291-0.928,2.363-2.153,2.59V69.512c1.43-0.23,2.522-1.469,2.522-2.963   c0-1.658-1.344-3.002-3.001-3.002c-1.658,0-3.003,1.344-3.003,3.002c0,1.498,1.099,2.74,2.535,2.965V100   c-1.231-0.221-2.166-1.297-2.166-2.592c0-0.463,0.12-0.896,0.33-1.275c-0.812-14.854-14.393-26.85-14.393-26.85l6.108-36.226h-5.18   v-6.836h2.412L33.782,0h21.361l-0.596,24.202h4.213L60.146,0h6.072l-2.863,26.221H65.768z M59.094,26.469h-6.156v6.213h6.156   V26.469z M54.641,35.157l2.635,43.284c0,0,1.207-1.83,2.617-3.672c1.314-1.717,2.84-3.453,2.84-3.453l-3.865-36.166L54.641,35.157z   "></path></g></svg></span>
		)
	}
}

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
			<div className="titleLogin">
				<h1>Mi・lieu</h1>
				<p>Def: a social setting in which something occurs or develops</p>
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
