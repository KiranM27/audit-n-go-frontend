import React, { useState, useEffect } from "react";
import SubPartView from "./SubPartViewTenant";

export default function PartView(props) {
  if (props.checklist.length === 0) {
    return (
      <div
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          paddingTop: 20,
        }}
      >
        <img
          src="https://audit-n-go-bucket.s3-ap-southeast-1.amazonaws.com/checklist-item-pics/like.png"
          alt="No Records Found"
          width="100"
          height="100"
          style={{ opacity: 0.5 }}
        ></img>
      </div>
    );
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
