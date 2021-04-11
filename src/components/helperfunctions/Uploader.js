import React, { Component, useState } from 'react'
import ReactS3 from 'react-s3'
import { Credentials } from "./Credentials.js"
import { CloudUploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const config = Credentials

export default class Uploader extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      file: {},
      uploaded: false
    };

    this.setFile = this.setFile.bind(this);
    this.upload = this.upload.bind(this);
  };

  upload() {
    // console.log(e.target.files[0])
    ReactS3.uploadFile(this.state.file, config)
    .then( (data) => {
      // console.log(data);
      // console.log(data.location)
      this.props.setFileLocation(data.location)
      toast.success(' Image Uploaded !', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    })
    .catch( (err) => {
      alert(err)
    })
  }

  setFile(e) {
    this.setState({
      file: e.target.files[0],
      uploaded: true
    }
    , () => {
      // console.log(this.state.file)
    })
  }

  render() {
    return (
      <div>
        <span>
          <input  type="file" onChange={ this.setFile }></input>
        </span>
        
        <div style={{ paddingTop: "5px"}} >
          <Button type="primary" disabled={ !this.state.uploaded }
          onChange={ this.setFile } 
          onClick= { this.upload }> <CloudUploadOutlined/> Upload</Button>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
      </div>
    )
  }
}
