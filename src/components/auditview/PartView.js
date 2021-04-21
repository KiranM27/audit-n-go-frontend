import React, { useState, useEffect } from "react";
import SubPartView from "./SubPartView";

export default function PartView(props) {
  return (
    <div>
      {props.checklist.map((item) => (
        <SubPartView item={item} checklistResults = { props.checklistResults } setChecklistResults = { props.setChecklistResults } 
          auditType = { props.auditType } />
      ))}
    </div>
  );
}
