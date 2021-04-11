import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react'
import Uploader from '../helperfunctions/Uploader'
import { connect } from 'react-redux';
import './formstyle.css'

import { ExpandOutlined, CheckCircleTwoTone, CloseCircleTwoTone, LoginOutlined } from '@ant-design/icons'
import { Card, Avatar } from 'antd';

import { Modal, Button } from 'antd';

const { Meta } = Card;
const size = "large"

function ChecklistItemCard(props) {

    const [status, setStatus] = useState("Status TBD")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileLocation, setFileLocation] = useState('')

    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    useEffect(() => {
        var localAuditFormData = props.auditFormData
        for (var i = 0; i < localAuditFormData.length; i ++) {
            for (var j = 0; j < localAuditFormData[i].length; j ++) {
                try {
                    if (
                        // localAuditFormData[i][j] === props.item 
                        localAuditFormData[i][j].part === props.item.part && 
                        localAuditFormData[i][j].SNo === props.item.SNo
                        ) {
                        localAuditFormData[i][j].status = status
                    }
                } catch (e) {
                }
            }
        }
        props.dispatch({ type: "setAuditFormData", auditFormData: localAuditFormData })
    }, [status])

    useEffect(() => {
        var localAuditFormData = props.auditFormData
        if (fileLocation === null || fileLocation === '' || fileLocation === "" || fileLocation === " "){
        }
        else {
            for (var i = 0; i < localAuditFormData.length; i ++) {
                for (var j = 0; j < localAuditFormData[i].length; j ++) {
                    if (
                        // localAuditFormData[i][j] === props.item 
                        localAuditFormData[i][j].part === props.item.part && 
                        localAuditFormData[i][j].SNo === props.item.SNo
                        ) {
                        localAuditFormData[i][j].images.push(fileLocation)
                    }
                }
            }
        }
        // Cookies.set("auditFormData", localAuditFormData) // Removed due to redux store
        props.dispatch({ type: "setAuditFormData", auditFormData: localAuditFormData })
    }, [fileLocation])

    try {
        return (
            <div className = 'center'>
                <Card
                    style={{ width: '100%' }}
    
                    actions={[
                        <ExpandOutlined onClick={showModal}/>,
                        <CheckCircleTwoTone twoToneColor="#52c41a" onClick = {() => { setStatus("Complied")}} />,
                        <CloseCircleTwoTone twoToneColor="#e42f3b" onClick = {() => { setStatus("Not Complied")}}/>
                    ]}
                >
                    <Meta
                    title={`${props.item.part}.${props.item.SNo}: ${ status } `}
                    description= { props.item.checklist_item }
                    />
    
                </Card>
                
                
                {/* Modal Code */}
                <Modal title="Upload Non compliance Image" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <div 
                    class = "center-noflex" 
                    // style = {{paddingLeft: '13vw'}}
                     >
                        <Uploader fileLocation = { fileLocation }  setFileLocation = { setFileLocation }/>
                    </div>
                </Modal>
            </div>
        )
    } catch (e) {
        return ( <p> No Items Found </p> )
    }
}

const mapStateToProps = function(state) {
    return {
        auditFormData: state.auditFormData
    }
}

export default connect(mapStateToProps)(ChecklistItemCard);