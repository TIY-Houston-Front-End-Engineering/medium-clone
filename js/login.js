import React, {Component} from 'react'
var qs = (selector) => document.querySelector(selector)

class SvgLogin extends Component{
	constructor(props){
		super(props)
	}

	_rotateLogin(){
		console.log('yesss')
		qs('.frontOfCoin').classList.add("frontHidden");
		qs('.backOfCoin').classList.add("backVisible");
	}	

	render(){
		return(
			<span className="icon" onClick={() => this._rotateLogin()}>
				<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M65.768,26.221v6.836h-5.18l6.107,36.226c0,0-13.58,11.996-14.393,26.85   c0.211,0.379,0.33,0.813,0.33,1.275c0,1.291-0.928,2.363-2.153,2.59V69.512c1.43-0.23,2.522-1.469,2.522-2.963   c0-1.658-1.344-3.002-3.001-3.002c-1.658,0-3.003,1.344-3.003,3.002c0,1.498,1.099,2.74,2.535,2.965V100   c-1.231-0.221-2.166-1.297-2.166-2.592c0-0.463,0.12-0.896,0.33-1.275c-0.812-14.854-14.393-26.85-14.393-26.85l6.108-36.226h-5.18   v-6.836h2.412L33.782,0h21.361l-0.596,24.202h4.213L60.146,0h6.072l-2.863,26.221H65.768z M59.094,26.469h-6.156v6.213h6.156   V26.469z M54.641,35.157l2.635,43.284c0,0,1.207-1.83,2.617-3.672c1.314-1.717,2.84-3.453,2.84-3.453l-3.865-36.166L54.641,35.157z"></path></g></svg>
				<span>Log In or Sign-Up</span>
			</span>
		)
	}
}

class SvgBack extends Component{
	constructor(props){
		super(props)
	}

	_rotateLogin(){
		console.log('yesss')
		qs('.frontOfCoin').classList.remove("frontHidden");
		qs('.backOfCoin').classList.remove("backVisible");
	}	

	render(){
		return(
			<span className="back" onClick={() => this._rotateLogin()}>
				<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M65.768,26.221v6.836h-5.18l6.107,36.226c0,0-13.58,11.996-14.393,26.85   c0.211,0.379,0.33,0.813,0.33,1.275c0,1.291-0.928,2.363-2.153,2.59V69.512c1.43-0.23,2.522-1.469,2.522-2.963   c0-1.658-1.344-3.002-3.001-3.002c-1.658,0-3.003,1.344-3.003,3.002c0,1.498,1.099,2.74,2.535,2.965V100   c-1.231-0.221-2.166-1.297-2.166-2.592c0-0.463,0.12-0.896,0.33-1.275c-0.812-14.854-14.393-26.85-14.393-26.85l6.108-36.226h-5.18   v-6.836h2.412L33.782,0h21.361l-0.596,24.202h4.213L60.146,0h6.072l-2.863,26.221H65.768z M59.094,26.469h-6.156v6.213h6.156   V26.469z M54.641,35.157l2.635,43.284c0,0,1.207-1.83,2.617-3.672c1.314-1.717,2.84-3.453,2.84-3.453l-3.865-36.166L54.641,35.157z"></path></g></svg>
				<span>Go back</span>
			</span>
		)
	}
}

class CoinFront extends Component{
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

class CoinBack extends Component{
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
			<div className="backOfCoin">
				<SvgBack />
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
				<CoinFront />
				<CoinBack />
			</div>
		)
	}
}