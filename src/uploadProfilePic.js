import React from 'react';
import { App } from './App'
import { Profilepic } from './Profilepic'
import axios from './axios'
export class UploadProfilepic extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}

  }
  // GET THE FILE THAT THE USER SPECIFIED IN THE FORM =============================
  uploadPic(e) {
    var file = e.target.files[0];
    var formData = new FormData();
    formData.append('file', file);

    //AJAX REQUEST =================================================================
    axios.post('/upload', formData).then((resp) => {
      this.props.setImage(resp.data.imgurl)
    })
  }
  render() {
    return (<div className="modal">
      <h4>UPLOAD A PROFILE PICTURE</h4>

      <input className="uploaderinput" name="file" type="file" onChange={(e) => this.uploadPic(e)} />
    </div>)
  }
}
