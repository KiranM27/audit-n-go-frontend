function genDataforPieChart(auditData, instData, outletData){
    var NCbyOutlets = auditData.map(audit => ({numberNC:audit.numberNC, outlet_id:audit.outlet_id}));
    var outlet_id_inst_id = outletData.map(outlet => ({outlet_id:outlet.outlet_id, institution_id:outlet.institution_id}));

    var TempNCbyInstitutions = [];
    var NCbyInstitutions = [];

    for (var i = 0; i < instData.length; i++){
        NCbyInstitutions.push({name:instData[i].name, institution_id:instData[i].institution_id, numberNC:0})
    }

    for (var i = 0; i < NCbyOutlets.length; i++){
        for (var j = 0; j < outlet_id_inst_id.length; j++){
            if (NCbyOutlets[i].outlet_id == outlet_id_inst_id[j].outlet_id){
                TempNCbyInstitutions.push({institution_id:outlet_id_inst_id[j].institution_id, numberNC:NCbyOutlets[i].numberNC})
            }
        }
    }

    for (var i = 0; i < TempNCbyInstitutions.length; i++){
        for (var j = 0; j <  NCbyInstitutions.length; j++){
            if (TempNCbyInstitutions[i].institution_id == NCbyInstitutions[j].institution_id){
                NCbyInstitutions[j].numberNC = NCbyInstitutions[j].numberNC + TempNCbyInstitutions[i].numberNC;
            }
        }
    }
    
    var data = NCbyInstitutions.map(ele => ({name:ele.name, value:ele.numberNC}));
    return data;
}

function genDataforRadialChart(auditData, instData, outletData, pieSelection){
    var institution_id_radial = 0;

    for (var i = 0; i < instData.length; i++){
        if (instData[i].name == pieSelection){
            institution_id_radial = instData[i].institution_id;
        }
    }

    var NCbyOutlets = auditData.map(audit => ({numberNC:audit.numberNC, outlet_id:audit.outlet_id}));
    var outlet_id_inst_id = outletData.map(outlet => ({outlet_id:outlet.outlet_id, outlet_name:outlet.username, institution_id:outlet.institution_id}));
    var outlets_radial = outlet_id_inst_id.filter(child => (child.institution_id == institution_id_radial));

    var data_radial = [];

    for (var i = 0; i < outlets_radial.length; i++) {
        data_radial.push({tenant:outlets_radial[i].outlet_name, outlet_id:outlets_radial[i].outlet_id, numberNC:0})
    }

    for (var i = 0; i < NCbyOutlets.length; i++){
        for (var j = 0; j < data_radial.length; j++){
            if (NCbyOutlets[i].outlet_id == data_radial[j].outlet_id){
                data_radial[j].numberNC = data_radial[j].numberNC + NCbyOutlets[i].numberNC;
            }
        }
    }

    return data_radial;
}

module.exports = {genDataforPieChart, genDataforRadialChart}