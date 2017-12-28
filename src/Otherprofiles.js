import React from 'react';
import {App} from './App';
import {Profile} from './Profile';
import {Profilepic} from './Profilepic';
import axios from './axios'
import {browserHistory} from 'react-router';
import {FriendsStatus} from './FriendsStatus';
import {Link} from 'react-router';

export class Otherprofiles extends React.Component {

  constructor(props) {
    super(props)
    this.state = {};
  }
  //GET INFOS OF THE OTHER USER THANKS TO HIS ID==================================
  componentDidMount() {

    var id = this.props.params.userid;
    axios.get('/getuser/' + id).then(({data}) => {
      if (!data.success) {
        browserHistory.push('/');
      } else {
        this.setState(data.data)
      }
    })
    axios.get('/mutualfriends/' + id).then(({data}) => {
      this.setState(data)
      console.log("mutualFriends", data)

    })
  };

  render() {

    if (!this.state.id) {
      return (<div>
        <p>Loading...</p>
      </div>)
    }
    const {mutualFriends} = this.state

    return (<div className="otherprofiletherealcontainer">
      <div className="otherprofilecontainer">
        <div className="otherprofile">
          <h2>PROFILE</h2>
          <img src={this.state.imgurl}/>
          <p>
            {this.state.first}
            {this.state.last}
          </p>
          <p>
            {this.state.email}
          </p>
          <p>
            {this.state.bio}
          </p>
          <FriendsStatus userid={this.props.params.userid}/>
        </div>
        <div className="mutualFriends">
          <h2>MUTUAL FRIENDS</h2>
          {
            mutualFriends && mutualFriends.map((mutualFriends, index) => <div key={index}>
              <div className="nameandpicture">
                <Link to={`/users/${mutualFriends.id}`}>
                  <img src={mutualFriends.imgurl}/>
                </Link>
                <p>{mutualFriends.first}
                  {mutualFriends.last}</p>
              </div>
            </div>)
          }
        </div>
      </div>
    </div>)
  }
}
