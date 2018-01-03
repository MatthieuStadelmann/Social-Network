import React from 'react';
import axios from './axios';
import { Link } from 'react-router';


//Create LOGIN with default state===============================================

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  // On change, set state to user inputs========================================

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      console.log("the new state is: ", this.state)
    })
  }
  // On submit, grab user inputs & post them throug axios ======================
  handleSubmit(e) {
    e.preventDefault()
    const {email, password} = this.state //destructuration.
    const data = {
      email,
      password
    }

    axios.post('/login', data).then(resp => {

      if (resp.data) {
        location.replace('/')

      } else {

        this.setState({error: true})
      }
    })
  }

  render() {
    return (<div>
      { this.state.error && <div>YOU MESSED UP BRO</div> }
      <form className="registrationForm">
        <input onChange={this.handleChange} name="email" placeholder="email" className="registration"/>
        <input onChange={this.handleChange} type="password" name="password" placeholder="password" className="registration"/>
        <button className="button" onClick={this.handleSubmit}>Login</button>
        <p><Link to='/'>Not a member yet? Sign up now</Link></p>
      </form>
    </div>)
  }
}
