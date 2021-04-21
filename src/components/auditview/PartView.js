import React, { useState, useEffect } from "react";
import SubPartView from "./SubPartView";

export default function PartView(props) {
  if (props.checklist.length === 0) {
    return(<div style = {{ alignContent: "center"}}>
      <img src="https://audit-n-go-bucket.s3-ap-southeast-1.amazonaws.com/checklist-item-pics/nodata-found.png" 
      alt="No Records Found"></img>
    </div>)
  }
  return (
    <div>
      {props.checklist.map((item) => (
        <SubPartView
          item={item}
          checklistResults={props.checklistResults}
          setChecklistResults={props.setChecklistResults}
          auditType={props.auditType}
        />
      ))}
    </div>
  );
}
