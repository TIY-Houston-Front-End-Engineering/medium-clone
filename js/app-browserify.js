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
import {LoginView} from './login'

Parse.$ = $
Parse.initialize(`sR0yX3XlZSVU0nt7eFPKSITMJT3uwRJVnl3HMKMT`, `sv8ImqvJytt5B3lMyf2NwURN1iQUz54Gg2rGDbuF`)

var qs = (selector) => document.querySelector(selector) 

const stories = new PostStoryList()

class Toolbar extends Component{
	constructor(props){
		super(props)
	}
// _blockSubmit(e) {
// 	e.preventDefault()

// }

_logOut (e) {
	e.preventDefault()
	Parse.User.logOut()
	window.location.hash = '#login'
}
	

	render(){
		return(<div id="wrapper">
        <div className="header">
            <div className="logo">Milieu</div>
            <form >
            <button id="button-right" onClick={(e) => this._logOut(e) }> Logout </button>
            <button id="button-right">Write a story</button>
            <input id="search-input" type="text" ref="searchMilieu" placeholder="Search Milieu" />
            <button id="search-icon"><img src="./images/magnifying47.png"/></button>
           	
			</form>
            
        </div>
        <div className="subheader"><img src="./images/expand38.png"/></div>
			<div>
				<svgIcon />
			</div>
			
			
			

		</div>)
	}
}

class NewStory extends Component {
	constructor(props){
		super(props)
		this.rerender = () => this.forceUpdate()
	}

	componentDidMount(){
		var model = this.props.newBlogPostModel
        model && model.on('change', (e) => { this.rerender() } )
    }

	_publish(e){
		var currentUser = Parse.User.current().toJSON()
		var title = React.findDOMNode(this.refs.title).innerText
		this.props.newBlogPostModel.set('title', title)
		this.props.newBlogPostModel.set('author', `${currentUser.firstname} ${currentUser.lastname}`)
		var imgSrc = React.findDOMNode(this.refs.imgsrc).innerHTML
		this.props.newBlogPostModel.set('src', imgSrc)
		console.log('publishing !!!!	')
		var content = React.findDOMNode(this.refs.storyContent).value
        this.props.newBlogPostModel.set('content', content)
        var keywords = React.findDOMNode(this.refs.keywords).value
       	this.props.newBlogPostModel.set('tags', keywords)

       	this.props.newBlogPostModel.save()
	}

	render(){
		console.log(this.props.newBlogPostModel)
		if(!this.props.newBlogPostModel){
			return (<span></span>)
		} else{
			return (<div>
				<h3  ref="title" contentEditable>{this.props.title}</h3>
				<label for = 'src'> Share a picture with your story. </label>
				<input type = 'url' name='src' ref='imgsrc' placeholder='Image Url'/> 
				<input type="text" ref='storyContent' placeholder="Share your story."/>
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

		if (this.state.title){
			var model = new PostStory({title: this.state.title})
			this.setState({workingModel : model})
			this.props.storedPosts.create(model)
			title.value = ''
		}

	}

	render() { 
		console.log(this.state.workingModel)

		var postedStories = this.props.storedPosts
		console.log(postedStories)
		console.log(postedStories.map((model) => model.toJSON()))
		return (<div>
			<Toolbar />

			<div id="new-story">
			<form onSubmit={(e) => this._newStory(e)}> 
				<label id="new-story-label" for = 'title'> Write your Title </label>
				<input id="new-story-title" type='text' name='title' ref='newTitle' placeholder='New Story'/>
				<button id="post-new-story" onClick={(e) => this._newStory(e)}> + </button>
			</form>

			</div>
				<NewStory newBlogPostModel={this.state.workingModel} title={this.state.title} />

			<h3 id="story-title">Your Previous Stories</h3>
             <hr />
			<ul>
				{postedStories.map((model) => <PostView existingStories={model} />)}
			</ul>	


		</div>)
	}
}

class PostView extends Component{
	constructor(props){
		super(props)
	}

	render(){
		var model = this.props.existingStories
		console.log(model)
		console.log('here in postview')
		var user = model.get('author')
		console.log(user)
		// var timestamp = model.get('timestamp')
		return (
			<div className="left_box">
			<li className="post">
				<img id="user-img" src="http://www.darelicious.com/theme/Darelicious/img/placeholder-avatar.png"/>
				<p id="user-name" ref = 'user'> {model.get('author')} </p>
				<p id="time-stamp">1 day ago</p>
			    <p ref='timestamp'> {model.get('timestamp')} </p>
			    <button id="like" ref='recommend'><img src="./images/like80.png"/></button>
			    <img id="story-img" src="http://ingridwu.dmmdmcfatter.com/wp-content/uploads/2015/01/placeholder.png"/>
				<div id="story-img"><img ref='src' src={model.get('src')}/></div>
				<h4 id="title" contenteditable ref='title'> {model.get('title')} </h4>
				<p id="description" contenteditable ref='content'>{model.get('content')}</p>
				<p id="read-more">Continue reading</p>
				<p ref='tags'> {model.get('tags')} </p>
				
			</li>
			<div className="floating-logo"><p>M</p></div>
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

var ParseRouter = Parse.Router.extend({
	routes: {
		'home':'home',
		'profile': 'profile',
		'story': 'story',
		'*default': 'login'
	}, 

	login: () => {
		if(Parse.User.current()){
			window.location.hash = '#profile'
			return
		}
		React.render(<LoginView />, qs('.container'))
	},

	home: () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
		stories.fetch()
		// React.render(<frontOfCoin />, qs('.container'))
		React.render(<PostListView storedPosts={stories} />, qs('.container'))
	},

	story: () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
			return
		}
		React.render(<PostView />, qs('.container'))
	},

	profile: () => {
		if(!Parse.User.current()){
			window.location.hash = '#login'
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

