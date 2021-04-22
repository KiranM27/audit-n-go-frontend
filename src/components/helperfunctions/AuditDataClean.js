function sortFullAuditData(fullData) {
  fullData.sort(function(a, b) {
    return b.audit_id - a.audit_id;
  });
  return fullData;
}

function getLocalDate(datetimeStr) {
  var localDate = new Date(datetimeStr);
  return localDate.toDateString().slice(4);
}

function getAuditType(auditType) {
  if (auditType == "cv") {
    return "COVID-19";
  } else if (auditType == "fb") {
    return "F&B";
  } else {
    return "Non F&B";
  }
}

function getOutletAndInstitute(id, instData, outletData) {
  var tenantName = "";
  var instName = "";
  for (var i = 0; i < outletData.length; i++) {
    if (id == outletData[i]["outlet_id"]) {
      tenantName = outletData[i]["username"];
      for (var j = 0; j < instData.length; j++) {
        if (outletData[i]["institution_id"] == instData[j]["institution_id"]) {
          instName = instData[j]["name"];
        }
      }
    }
  }
  return [tenantName, instName];
}

function processAuditData(fullData) {
  var processed = fullData.map((audit) => ({
    id: audit.audit_id,
    type: getAuditType(audit.audit_type),
    checklist: audit.checklist_results,
    deadline: getLocalDate(audit.deadline),
    outlet_id: audit.outlet_id,
    score: audit.score,
    date: getLocalDate(audit.start_date),
  }));

  return processed;
}

module.exports = { sortFullAuditData, getOutletAndInstitute, processAuditData };
