import React from 'react'
import { Button } from '@material-ui/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
import ReactS3 from 'react-s3'
import { Credentials } from "./Credentials.js";
import Alert from '@material-ui/lab/Alert';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var CryptoJS = require("crypto-js");
const config = Credentials

export const ExportCSV = ({csvData}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    function upload( file ) {
        config.dirName = new Date().getTime().toString()
        ReactS3.uploadFile(file , config)
        .then( (data) => {
            axios.post("https://www.audit-n-go-backend.technopanther.com/sendAuditMail/",{csvLink:data.location,email:CryptoJS.AES.decrypt(localStorage.username, 'ElementsOfSoftwareConstruction').toString(CryptoJS.enc.Utf8)})
            .then((res) => {
                })
        })
        .catch( (err) => {
            alert(err)
        })
      }

    const exportToCSV = (csvData) => {
        for(var len =0;len<csvData.length;len++){
            csvData[len].images = csvData[len].images.toString()
        }
        const fileName = new Date().getTime().toString()
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        upload(data,config)
        alert("An email has been sent to your inbox!")
        // FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button variant="contained" color="primary" size="medium" style = {{ textTransform: "none"}} 
        onClick={(e) => exportToCSV(csvData)}>Export as CSV</Button>
    )
}
