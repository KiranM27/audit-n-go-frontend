import React from 'react'
import ChecklisItemCard from './ChecklistItemCard'
import { connect } from 'react-redux';


function RenderListItems(props) {

    try { 
        return(
        props.auditFormData[props.index].map( item => <ChecklisItemCard item = { item } />) )
    } catch (e) {
        return(
            <p> No Checklist Items ! Please check back later </p>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        auditFormData: state.auditFormData,
    }
}
export default connect(mapStateToProps)(RenderListItems);

