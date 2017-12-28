import React from 'react';
import Logo from './logo'
import {Link} from 'react-router'

export class Welcome extends React.Component {

  constructor(props) {

    super(props);
    console.log("this.props", this.props)
    this.state = {};
  }

  render() {
    console.log("something")
    return (
      <div className="welcome">
        <Logo/>
        <div>
          {this.props.children}
        </div>
      </div>);
  }
}
