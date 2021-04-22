import React, {useState, useEffect} from 'react'
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios'
import { withRouter } from 'react-router-dom';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'type', headerName: 'Type', width: 110 },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 130,
  },
  {
    field: 'deadline',
    headerName: 'Deadline',
    type: 'date',
    width: 130,
  },
  {
    field: 'numberNC',
    headerName: 'NCs',
    type: 'number',
    width: 110,
  },
  {
    field: 'score',
    headerName: 'Score',
    type: 'number',
    width: 110,
  },
];

const rows = [
    { id: 1, type: 'No data', numberNC:0, score:0 },
];

function DataTable(props) {
    const { history } = props;
    const [outletAudits, setOutletAudits] = useState(rows);
    const [localOutlet, setLocalOutlet] = useState(props.selectedOutlet)

    useEffect(() => {
        retrieveOutlets();
    }, [props.selectedOutlet]); 

    // setOutletAudits(rows);

    const retrieveOutlets = async () => {
        try {
            const data = await axios
                .get(`/audits/${props.selectedOutlet}`)
                .then(res => {
                    console.log(res.data);
                    setOutletAudits(getAudits(res.data));
                });
        }catch(e){
            setOutletAudits(rows);
        }
    };

    try {
        return (
            <div style={{ width: '100%' }}>
                <DataGrid 
                    autoHeight={true} 
                    rows={outletAudits} 
                    columns={columns} 
                    pageSize={10} 
                    onRowClick={(e) => history.push({
                        pathname: '/auditDetail/' + e['id']
                    })}
                    disableSelectionOnClick={true}
                    disableExtendRowFullWidth={false}/>
            </div>
        );

    }catch(error){
        return (
            <div style={{ width: '100%' }}>
                <DataGrid 
                    autoHeight={true} 
                    rows={rows} 
                    columns={columns} 
                    pageSize={10} 
                    onRowClick={(e) => console.log(e)}
                    disableSelectionOnClick={true}
                    disableExtendRowFullWidth={false}/>
            </div>
        );
    }    
}

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

        var deadline_str = input[i]["deadline"].slice(0,10)
        dict['deadline'] = deadline_str;

        var date_str = input[i]["start_date"].slice(0,10);
        dict['date'] = date_str;
        dict['checklist'] = input[i]["checklist_results"]

        var status_vec = countNCs(input[i]["checklist_results"])
        
        dict['numberNC'] = status_vec[1];

        dict['score'] = status_vec[0]*5;

        output.push(dict);
    }
    console.log(output);
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

export default withRouter(DataTable);
