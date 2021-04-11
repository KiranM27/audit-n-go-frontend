const { genDataforPieChart, genDataforRadialChart } = require('../components/helperfunctions/DashboardChartFuncs.js');

const auditData = [
    {
      id: 15,
      type: 'COVID-19',
      deadline: '2021-03-23',
      date: '2021-03-21',
      checklist: [
          {
              "part":1,
              "checklist_item":"SafeEntry",
              "status":"Complied",
              "images":[],
              "SNo":1
          }
      ],
      numberNC: 5,
      score: 0,
      outlet_id: 2
    }
]

const institutionData = [
    {
        "institution_id": 1, 
        "name": "SUTD", 
        "outlet_number": 13
    },
    {
        "institution_id": 2, 
        "name": "CGH", 
        "outlet_number": 5
    },
]

const outletData = [
    {
        "outlet_id": 2, 
        "username": "DStar Bistro", 
        "password": "password", 
        "email": "dstar@gmail.com", 
        "institution_id": 1
    },
    {
        "outlet_id": 3, 
        "username": "Gomgom", 
        "password": "password", 
        "email": "gomgom@gmail.com", 
        "institution_id": 1
    }
]

const actualPieData = [
    {
        name: "SUTD",
        value: 5
    }
]

const actualRadialData = [
    {
        tenant: "DStar Bistro",
        outlet_id: 2,
        numberNC: 5,
    }
]

test('Get data for pie chart', () => {
    var expected = JSON.stringify(genDataforPieChart(auditData, institutionData, outletData)[0])
    var actual = JSON.stringify(actualPieData[0])
    // console.log(expected);
    // console.log(actual);
    expect(expected).toBe(actual);
});

test('Get data for radial chart', () => {
    var expected = JSON.stringify(genDataforRadialChart(auditData, institutionData, outletData, "SUTD")[0])
    var actual = JSON.stringify(actualRadialData[0])
    // console.log(expected);
    // console.log(actual);
    expect(expected).toBe(actual);
})