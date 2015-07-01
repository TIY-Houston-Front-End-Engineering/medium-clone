import React, {Component} from 'react'
import {PostStory, PostStoryList} from './post'
var qs = (selector) => document.querySelector(selector)

class Toolbar extends Component{
	constructor(props){
		super(props)
	}

	_logOut (e) {
		e.preventDefault()
		Parse.User.logOut()
		window.location.hash = '#login'
	}
		
	render(){
		return(<div className="toolbar">
			<div>
				<svgIcon />
				<p>Milieu</p>
			</div>
			
			<form >
				<input type="text" ref="searchMilieu" placeholder="Search for a story." />
			<button> Avatar </button>
			<button onClick={(e) => this._logOut(e) }> Logout </button>
			</form>
		</div>)
	}
}

class NewStory extends Component {
	constructor(props){
		super(props)
		console.log('new model')
		this.state={
			newPost: this.props.newBlogPostModel
		}
		this.rerender = () => this.forceUpdate()
	}

	componentDidMount(){
		console.log('mount')
		var model = this.props.newBlogPostModel
        model && model.on('change', (e) => { this.rerender() } )
    }
    componentDidUnMount() {
    	console.log('unmount')
    	var model = this.props.newBlogPostModel
    	model.on('change', (e) => {this.rerender()})
    }

	_publish(e){
		var currentUser = Parse.User.current().toJSON()
		var title = React.findDOMNode(this.refs.title)
		this.props.newBlogPostModel.set('title', title.innerText)
		this.props.newBlogPostModel.set('author', `${currentUser.firstname} ${currentUser.lastname}`)
		var imgSrc = React.findDOMNode(this.refs.imgsrc)
		this.props.newBlogPostModel.set('src', imgSrc.innerHTML)
		console.log('publishing !!!!	')
		var content = React.findDOMNode(this.refs.storyContent)
        this.props.newBlogPostModel.set('content', content.value)
        var keywords = React.findDOMNode(this.refs.keywords)
       	this.props.newBlogPostModel.set('tags', keywords.value)

       	this.props.newBlogPostModel.save().then(()=> { 
       		this.props.newBlogPostModel.fetch()
       		var story = React.findDOMNode(this.refs.story)
       		// story.innerText = ''
       	

       	})
	}

	render(){
		console.log(this)
		debugger
		if(!this.props.newBlogPostModel){
		console.log(1)
			return (<span>blank</span>)
		} else{
		console.log(2)
			return (<div className ="EnterStory" ref='story'>
				<form>
				<h3  ref="title" contentEditable>{this.props.title}</h3>
				<label for = 'src'> Share a picture with your story. </label>
				<input type = 'url' name='src' ref='imgsrc' placeholder='Image Url'/> 
				<input type="text" ref='storyContent' placeholder="Share your story."/>
				<label for = 'keywords'> Enter 3 story tags. </label>
				<input type ='text' name='keywords' ref='keywords' placehloder='Tags' />
				<label for='isPrivate'> Make Story Private </label>
				<input type = 'checkbox' name='isPrivate' ref='isPrivate'/>
				<button onClick={(e) => this._publish(e)}> Publish </button>
				</form>
			</div>
			)
		}
	}
}

export class ProfileView extends Component {
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
		e.stopPropagation()
		console.log('clicked')
		var title = React.findDOMNode(this.refs.newTitle)
		this.setState({title: title.value})

		if (this.state.title){
			var model = new PostStory({title: this.state.title})
			this.setState({workingModel: model})
			this.props.storedPosts.create(model)
			title.value = ''
		}

	}

	render() { 
		console.log('make model next')
		console.log(this.state)
		var postedStories = this.props.storedPosts
		return (<div>
			<Toolbar />
			<form onSubmit={(e) => this._newStory(e)}> 
				<label for = 'title'> Write your Title. </label>
				<input type='text' name='title' ref='newTitle' placeholder='New Story'/>
				<button> + </button> 
			</form>
				<NewStory newBlogPostModel={this.state.workingModel} title={this.state.title} />
			<hr />
			<h3>Your previous stories.</h3>
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
		var user = model.get('author')
		// var timestamp = model.get('timestamp')
		return (
			<li className="post">
				<h3 contenteditable ref='title'> {model.get('title')} </h3>
				<h6 ref = 'user'> {model.get('author')} </h6>
				<img ref='src' src={model.get('src')}/>
				<p contenteditable ref='content'>{model.get('content')}</p>
				<p ref='tags'> {model.get('tags')} </p>
				<p ref='timestamp'> {model.get('timestamp')} </p>
				<button ref='recommend'> Recommend </button>
			</li>
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

