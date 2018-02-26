import React from 'react';
import axios from './axios'
import { Profilepic } from './Profilepic';
import Logo from './logo';
import { UploadProfilepic } from './uploadProfilepic';
import { Profile } from './Profile';
import { Otherprofiles } from './Otherprofiles';
import { Link } from 'react-router';
import { getSocket } from './socket';


export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state={}:
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    console.log()
    axios.get('/logout/')
    location.replace('/')
  }

  componentDidMount() {
    getSocket();
    axios.get('/user/').then(({data}) => {
      this.setState({
        first: data.first,
        last: data.last,
        email: data.email,
        id: data.id,
        bio: data.bio,
        imgurl: data.imgurl || '/images/default_profile_pic.png'
      })
    })
  }

  // What we actually render on the page =========================================
  render() {
    const {
      first,
      last,
      email,
      imgurl,
      handleBio,
      bio
    } = this.state;
    
    const children = React.cloneElement(this.props.children, {
      first,
      last,
      email,
      imgurl,
      handleBio,
      bio
    })

    const setImage = (imgurl) => {
      this.setState({imgurl: imgurl})
    }

    if (!this.state.id) {
      return (<div>
        <p>Loading...</p>
      </div>)
    }
    return (<div className="profilepage">
      <div className="logoandpic">
        <Logo/>
        <Link to='/friends/'>FRIENDS</Link>
        <Link to='/chat/'>CHAT</Link>
        <Link to='/online/'>ONLINE NOW</Link>
        <Link to='/'>YOUR PROFILE</Link>
        <Link to='/logout/' onClick={this.handleClick}>LOG OUT</Link>
        <div className="profilepic">
          <Profilepic imgurl={this.state.imgurl} first={this.state.first} showUploader={() => this.setState({
              uploaderIsVisible: !this.state.uploaderIsVisible
            })}/>
        </div>
      </div>
      {this.state.uploaderIsVisible && <UploadProfilepic setImage={setImage}/>}
      {children}
    </div>)
  }

}
