import React from 'react';
import {App} from './App'

export class Profilepic extends React.Component {

  constructor(props) {
  super(props);
  this.state = {
    first: '',
    last: '',
    imgurl: '',
  }
};

  render() {


    return (
      <div>
        <img onClick={this.props.showUploader} className="Profilepic" src={this.props.imgurl} alt={this.props.first}/>
      </div>
    )
  }
}
