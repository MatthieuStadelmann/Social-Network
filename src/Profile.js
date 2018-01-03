import React from 'react';
import { App } from './App';
import { Link } from 'react-router';
import { Profilepic } from './Profilepic';
import { Editbio } from './Editbio';

export class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bioIsVisible: false
    }
    this.handleBio = this.handleBio.bind(this)

  }

  handleBio(e) {
    this.setState(prevState => ({
      bioIsVisible: !prevState.bioIsVisible
    }));
  }
  render() {

    const {
      first,
      last,
      email,
      imgurl,
      handleBio,
      bio
    } = this.props;

    return (<div className="profile">
      <h1>YOUR PROFILE</h1>
      <div className="infos">
        <div className="myinfos">
        <p>{first}
          {last}</p>
        <p>{email}</p>
        <p>
          {bio}
        </p>
        <span onClick={this.handleBio}>Add bio</span>
        {this.state.bioIsVisible && <Editbio/>}
      </div>
        <div className="myprofilepic">
          <img src={imgurl}/>
        </div>
      </div>
    </div>)
  }
}
