import React, { useState, useEffect } from 'react';
import SubPartView from './SubPartView';

export default function PartView(props) {
    console.log(props)
    return (
        <div>
            { props.checklist.map( item => <SubPartView item = { item }/>) }
        </div>
    )
}
