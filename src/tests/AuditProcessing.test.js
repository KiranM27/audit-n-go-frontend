const { getAudits, makeData, getOutletAndInstitute, sortAudits } = require('../components/helperfunctions/AuditProcessing.js')


const fullAuditData = [
    {
        "audit_id": 15, 
        "start_date": "2021-03-21T16:00:00.000Z", 
        "deadline": "2021-03-23T16:00:00.000Z", 
        "audit_type": "cv", 
        "outlet_id": 2,
        "checklist_results":[
            {
                "part": 1, 
                "checklist_item": "SafeEntry", 
                "status": "Complied", 
                "images": [], 
                "SNo": 1}
        ],
    },
    {
        "audit_id": 1, 
        "start_date": "2021-03-22T16:00:00.000Z", 
        "deadline": "2021-03-23T16:00:00.000Z", 
        "audit_type": "cv", 
        "outlet_id": 1,
        "checklist_results":[
            {
                "part": 1, 
                "checklist_item": "SafeEntry", 
                "status": "Complied", 
                "images": [], 
                "SNo": 1}
        ],
    },

]

const processedAuditData = [
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
      numberNC: 0,
      score: 0,
      outlet_id: 2
    }
]

const makeDataTest = {
    "id": 1,
    "date": "2021/03/25",
    "tenant": "Starbucks",
    "institution": "NUH",
    "NC": 3,
    "score": 10
}

const sortedAudits = [
    {
      id: 1,
      type: 'COVID-19',
      date: 1616371200000,
      NC: 0,
      score: 0,
      outlet_id: 1
    },
    {
      id: 15,
      type: 'COVID-19',
      date: 1616284800000,
      NC: 0,
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

test('Get processed full audit data', () => {
    var expected = JSON.stringify(getAudits(fullAuditData)[0])
    var actual = JSON.stringify(processedAuditData[0])
    // console.log(expected);
    // console.log(actual);
    expect(expected).toBe(actual);
});

test('Get makeData', () => {
    var expected = JSON.stringify(makeData(1, "2021/03/25", "Starbucks", "NUH", 3, 10));
    var actual = JSON.stringify(makeDataTest)
    // console.log(expected);
    // console.log(actual);
    expect(expected).toBe(actual);
})

test('Get sorted audits (by date, latest first)', () => {
    var sorted = sortAudits(getAudits(fullAuditData))
    var expected0 = JSON.stringify(sorted[0])
    var actual0 = JSON.stringify(sortedAudits[0])
    var expected1 = JSON.stringify(sorted[1])
    var actual1 = JSON.stringify(sortedAudits[1])

    console.log(getOutletAndInstitute(2, institutionData, outletData))

    expect(expected0).toBe(actual0)
    expect(expected1).toBe(actual1)
})

test('Get outlet name and institution name by outlet_id', () => {
    var expected = getOutletAndInstitute(2, institutionData, outletData);
    var actual = ['DStar Bistro', 'SUTD']

    expect(expected[0]).toBe(actual[0]);
    expect(expected[1]).toBe(actual[1]);
})