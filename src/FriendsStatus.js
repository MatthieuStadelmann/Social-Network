import React from 'react';
import axios from './axios';
import { Otherprofiles } from './Otherprofiles';
import { App } from './App';

export class FriendsStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      status: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    var id = this.props.userid;
    if (this.state.status === 'Send a Friend Request') {

      axios.post('/pending', {status: 1,otherid: id}).then((resp) => {
        location.replace('/');
      })
    } else if (this.state.status === 'Cancel Friend Request') {
        axios.post('/cancel', {status: 2, otherid: id }).then((resp) => {
          location.replace('/');
        })
    } else if (this.state.status === 'Accept Friend Request') {
      axios.post('/accept', {status: 3, otherid: id }).then((resp) => {
        location.replace('/');
      })
    } else if (this.state.status === 'Terminate Friend Request') {
      axios.post('/terminate', {status:4, otherid: id}).then((resp) => {
        console.log("inside post terminate")
        location.replace('/');

      })
    };
}

componentDidMount() {

  var id = this.props.userid;
  axios.get('/getstatus/' + id).then((resp) => {

      this.setState({status: resp.data.availableStatus})
    }).catch((err) => {

      console.log(err)
    })
}
render() {


  return (<div className="button">
    <button href={(button) => this.button = button} onClick={(e) => {
        this.handleSubmit(e)
      }}>
      {this.state.status}
    </button>
  </div>)

}
}
