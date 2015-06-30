import React, {Component} from 'react'

class SvgLogin extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div className="icon">
				<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M65.768,26.221v6.836h-5.18l6.107,36.226c0,0-13.58,11.996-14.393,26.85   c0.211,0.379,0.33,0.813,0.33,1.275c0,1.291-0.928,2.363-2.153,2.59V69.512c1.43-0.23,2.522-1.469,2.522-2.963   c0-1.658-1.344-3.002-3.001-3.002c-1.658,0-3.003,1.344-3.003,3.002c0,1.498,1.099,2.74,2.535,2.965V100   c-1.231-0.221-2.166-1.297-2.166-2.592c0-0.463,0.12-0.896,0.33-1.275c-0.812-14.854-14.393-26.85-14.393-26.85l6.108-36.226h-5.18   v-6.836h2.412L33.782,0h21.361l-0.596,24.202h4.213L60.146,0h6.072l-2.863,26.221H65.768z M59.094,26.469h-6.156v6.213h6.156   V26.469z M54.641,35.157l2.635,43.284c0,0,1.207-1.83,2.617-3.672c1.314-1.717,2.84-3.453,2.84-3.453l-3.865-36.166L54.641,35.157z"></path></g></svg>
			</div>
		)
	}
}

class SvgPen extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div className="pen">
				<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><path fill="#000000" d="M41.701,74.275c-0.15,0.1-1.099,2.795-2.701,6.855c-1.271,3.217-2.674,3.85-6.044,4.514  c-3.015,0.596-4.669,2-5.239,2.441c-0.572,0.441-1.23,0.244-0.732-0.43c0.717-0.967,5.098-5.205,6.766-6.844  c0.193,0.033,0.399-0.012,0.562-0.146c0.295-0.246,0.335-0.684,0.09-0.979c-0.189-0.227-0.607-0.348-0.865-0.115  c-0.258,0.234-4.186,4.004-4.566,4.371c4.468-5.439,6.579-7.963,10.072-12.111L41.701,74.275z M97.355,12.308  C65.999,42.119,57.771,49.649,39.66,71.1l2.655,2.49c2.396-0.82,4.759,1.457,8.397-0.969c5.046-3.363,47.943-57.366,48.795-58.449  C100.855,12.458,99.186,10.553,97.355,12.308z M4.502,85.102C4.25,85.309,3.578,85.59,3.49,85.641  c-1.68,0.912-1.771,1.699-1.741,2.078c0.108,1.043,1.585,1.902,6.952,1.578c2.217-0.186,4.369-0.576,6.373-0.906  c2.004-0.338,4.494-0.648,5.447-0.648c2.904,0,3.135,0.822,5.322,0.822c0.197,0,0.344-0.045,0.344-0.26  c0-0.217-0.213-0.258-0.332-0.262c-1.848,0-2.312-1.193-5.344-1.186c-1.66-0.014-2.185-0.043-6.725,0.592  c-4.541,0.637-9.954,0.904-9.954-0.02c0-0.531,3.751-1.525,3.751-3.057c0-0.816-1.035-1.979-6.51-1  C0.589,83.465-0.04,83.775,0,84.473c0.035,0.629,0.547,1.135,1.472,0.885c0.341-0.082,2.278-0.428,2.92-0.432  C4.52,84.926,4.563,85.051,4.502,85.102z"></path></svg>
			</div>
		)
	}
}

class frontOfCoin extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div className="frontOfCoin">
				<div>
					<h1>Mi・lieu</h1>
					<span>noun</span>
				</div>
				<span className="def">a social setting in which something occurs or develops.</span>
				<SvgLogin />
			</div>
		)
	}
}

class backOfCoin extends Component{
	constructor(props){
		super(props)
		// this.state = {
		// 	error: 0
		// }
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
		return(<div className="backOfCoin">
				<div className="login">
					<h4>Login</h4>
					<form>
						<div>
							<input type="text" ref="username" placeholder="Enter username"/>
							<input type="password" ref="password" placeholder="Enter password"/>
						</div>
						<button onClick={(e)=> this._signIn(e)}>Sign In</button>
					</form>
				</div>
				<div className="signup">
					<h4>Sign Up</h4>
					<form>
						<div>
							<span><input type="text" ref="firstname" placeholder="First Name"/>
							<input type="text" ref="lastname" placeholder="Last Name"/></span>
						</div>
						<div>
							<span><input type="email" ref="email" placeholder="Email"/>
							<input type="text" ref="newUsername" placeholder="Username"/></span>
						</div>
						<div><input type="password" ref="newPassword" placeholder="Password"/></div>
						<button onClick={(e) => this._registerUser(e)}>Join the Charge</button>
					</form>
				</div>
			</div>
		)
	}
}

export class LoginView extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return(
			<div className="rotationContainer">
				<frontOfCoin />
				<backOfCoin />
			</div>
		)
	}
}

class LoginView2 extends Component{
	constructor(props){
		super(props)
		// this.state = {
		// 	error: 0
		// }
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
		return(
			<div className="rotationContainer">
				<div className="frontOfCoin">
					<div>
						<h1>Mi・lieu</h1>
						<span>noun</span>
					</div>
					<span className="def">a social setting in which something occurs or develops.</span>
					<SvgLogin />
				</div>
			</div>
		)
	}
}