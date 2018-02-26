import React from 'react';
import axios from './axios';
import { Link } from 'react-router';


//Create registration with default state========================================
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      last: '',
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
    })
  }
  // On submit, grab user inputs & post them throug axios ? ====================
  handleSubmit(e) {
    e.preventDefault()

    const {first, last, email, password} = this.state
    
    const data = {
      first,
      last,
      email,
      password
    }
    axios.post('/register', data).then(resp => {
      if (resp.data.success) {
        location.replace('/'); //
      } else {
        this.setState({error: true})
      }
    })
  }
  // Create the actual input Form ==============================================
  render() {
    return (<div>
      {this.state.error && <div>YOU MESSED UP</div>}
      <form className="registrationForm">
        <input onChange={this.handleChange} type="text" name="first" placeholder="first name" className="registration"/>
        <input onChange={this.handleChange} type="text" name="last" placeholder="last name" className="registration"/>
        <input onChange={this.handleChange} name="email" placeholder="email" className="registration"/>
        <input onChange={this.handleChange} type="password" name="password" placeholder="password" className="registration"/>
        <button className="button" onClick={this.handleSubmit}>Register now</button>
        <p><Link to='/login'>Already a member? Login to our site</Link></p>
      </form>
    </div>)
  }
}
