import React from 'react';
import { App } from './App';
import { Profile } from './Profile';
import axios from './axios'

export class Editbio extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      bio: this.textarea.value
    })
    console.log(this.state)
  }

  handleSubmit(e) {

    axios.post('/submit', {bio: this.state.bio}).then((resp) => {
    if (resp.data.success) {
      location.replace('/')
    } else {
      console.log(err)
    }
    }).catch((err) => {
      console.log(err)
    })
  }
  render() {
    return (<div>
      <textarea ref={(textarea) => this.textarea=textarea} onChange={this.handleChange}/>
      <button onClick={(e)=>{this.handleSubmit(e)}}>Submit</button>
    </div>)
  }
}
