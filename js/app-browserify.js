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

// class HomeScreenView extends Component{
// 	constructor(props){
// 		super(props)
// 	}

// 	render(){
// 		return(<div>
// 			<ul>

// 			</ul>
// 		</div>
// 		)
// 	}
// }
class LoginView extends Component{
	constructor(props){
		super(props)
		this.state = {
			error: 0
		}
	}

	_signIn(e) {
		e.preventDefault()

		var login = user.logIn()
		login.then((e)=> window.location.hash = '#home')
		login.fail() => {
			this.setState({error: this.state.error + 1})
		}
	}

	_registerUser(e){
		e.preventDefault()

	var user = new Parse.User(),
		firstName = React.findDOMNode(this.refs.fistname).value,
		lastName = React.findDOMNode(this.refs.lastname).value,
		email = React.findDOMNode(this.refs.email).value,
		password = React.findDOMNode(this.refs.password).value,
		username = React.findDOMNode(this.refs.username).value

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
			// this.setState({error: this.state.error +1})
			alert('NO!')
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
				Fist Name: <input type="text" ref="firstname" />
				Last Name: <input type="text" ref="lastname" />
				Email: <input type="email" ref="email" />
				Username: <input type="text" ref="username" />
				Password: <input type="password" ref="password" />
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


class PostView extends Component({
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div>
				<h3>{this.props.data.title}</h3>
				<p>{this.props.data.content}</p>
			</div>
		)
	}
})

class PostListView extends Component({
	constructor(props){
		super(props)
	}

	render(){
		return(

		)
	}
})

var ParseRouter = Parse.Router.extend({
	routes: {
		'home':'home',
		'profile': 'profile',
		'story': 'story',
		'*default': 'login'
	}, 

	login: () => {
		if(Parse.User.current()){
			window.location.hash = '#home'
			return
		}
		React.render(<LoginView />, qs('.container'))
	},

	'home': () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
		stories.fetch()
		React.render(<PostView stories={data} />, qs('.container'))
	},

	'story': () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
	}

	initialize: () => {
		Parse.history.start()
	}
})


window.test = new PostStory({title: `Michael's quest to find self meaning`, content: `i was born in a river to a family of wolves`})
React.render(<PostView data={test.toJSON()} />, qs('.container'))

test.save()