function getAudits(input){
  var output = [];
  for (var i = 0; i < input.length; ++i){
      var dict = {};
      dict['id'] = input[i]["audit_id"];

      var type_str = "COVID-19";
      if (input[i]["audit_type"] == "fb"){
          type_str = "F&B";
      }else if (input[i]["audit_type"] == "nf"){
          type_str = "Non F&B";
      }
      dict['type'] = type_str;

      // var deadline_str = input[i]["deadline"].slice(0,10)
      var local_deadline = new Date(input[i]["deadline"])
      dict['deadline'] = local_deadline.toDateString().slice(4,);

      // var date_str = input[i]["start_date"].slice(0,10);
      var local_date = new Date(input[i]["start_date"])
      dict['date'] = local_date.toDateString().slice(4,);

      dict['checklist'] = input[i]["checklist_results"]

      var status_vec = countNCs(input[i]["checklist_results"])
      
      dict['numberNC'] = status_vec[1];

      dict['score'] = status_vec[0]*5;

      if (type_str != "COVID-19"){
        dict['score'] = tallyScores(dict['checklist'])
      }

      dict['outlet_id'] = input[i]['outlet_id']

      output.push(dict);
  }
  return output;
}

function countNCs(input){
  var no_complied = 0;
  var no_notcomplied = 0;
  var no_tbd = 0;
  for (var i = 0; i < input.length; ++i){
      for (var j = 0; j < input[i].length; ++j){
          var status_str = input[i][j]["status"]
          if (status_str == "Complied"){
              no_complied++;
          } else if (status_str == "Not Complied"){
              no_notcomplied++;
          }else{
              no_tbd++;
          }
      }
  }
  return [no_complied, no_notcomplied, no_tbd]
}

function tallyScores(checklist){
  var totalScore = 0;
  for (var i = 0; i < checklist.length; i++){
    for (var j = 0; j < checklist[i].length; j ++){
      totalScore += checklist[i][j].score
    }
  }
  return totalScore
}

function makeData(id, date, type, tenant, institution, NC, score){
  return {id, date, type, tenant, institution, NC, score};
}

function getOutletAndInstitute(id, instData, outletData){
  var tenantName = "";
  var instName = "";
  for (var i = 0; i < outletData.length; i++) {
    if (id == outletData[i]["outlet_id"]){
      tenantName = outletData[i]["username"];
      for (var j = 0; j < instData.length; j++){
        if (outletData[i]["institution_id"] == instData[j]["institution_id"]){
          instName = instData[j]["name"]
        }
      }
    }
  }
  return [tenantName, instName]
}

function sortAudits(fullAuditList){
  var output = [];
  for (var i=0; i<fullAuditList.length; ++i){
    output.push(
      {
        "id":fullAuditList[i]['id'], 
        "type":fullAuditList[i]['type'], 
        "date":fullAuditList[i]['date'], 
        "NC":fullAuditList[i]['numberNC'], 
        "score":fullAuditList[i]['score'],
        "outlet_id":fullAuditList[i]['outlet_id']
      }
    );
  }
  output.sort(function(a,b){
    return b.id - a.id
  })
  // console.log(output)
  return output
}

// export {getAudits, makeData, getOutletAndInstitute, sortAudits}
module.exports = {getAudits, makeData, getOutletAndInstitute, sortAudits}