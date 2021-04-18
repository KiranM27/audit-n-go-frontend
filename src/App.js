import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login'
import Navigator from './components/Navigator'
import Dashboard from './components/dashboard/Dashboard'
import About from './components/about/About'
import InstitutionView from './components/institutionview/InstitutionView'
import Outlets from './components/outlets/Outlets.js'
import AuditView from './components/auditview/AuditView'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Cookies from 'js-cookie';
import { composeWithDevTools } from "redux-devtools-extension";
import AuditInitialView from './components/auditform/AuditInitialView'
import AuditForm from './components/auditform/AuditForm'
import ForgotPassword from './components/login/ForgotPassword';
import ChangePassword from './components/login/changePassword';
import AddOutlet from './components/ManageObjects/addOutlet';
import DeleteOutlet from './components/ManageObjects/deleteOutlet';
// import AddInstitution from './components/ManageObjects/addInstitution';

// Initialise Global State Here. Add in other gloal states below
let initialState = {}
try {
  initialState = {
    auditFormData: [[ null ], [ null ], [ null ]],
    deadline: new Date(),
    forgotPasswordEmail: '',
    loggedInUser: JSON.parse(Cookies.get('loggedInUser')) || {
      userId: 0,
      isAdmin: false,
      username: ''
    },
    noNotifications: 0,
    noMessages: 0
  }
} catch (e) {
  initialState = {
    auditFormData: [[ null ], [ null ], [ null ]],
    deadline: new Date(),
    forgotPasswordEmail: '',
    loggedInUser: {
      userId: 0,
      isAdmin: false,
      username: ''
    },
    noNotifications: 0,
    noMessages: 0
  }
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case "setAuditFormData":
        return {
          ...state, 
          auditFormData: action.auditFormData
        }
    case "setDeadline":
      return {
        ...state,
        deadline: action.deadline
      }
    case "setForgotPasswordEmail":
      return {
        ...state,
        forgotPasswordEmail: action.forgotPasswordEmail
      }
    case "setLoggedInUser":
      return {
        ...state,
        loggedInUser: action.loggedInUser
      }
    case "setNoNotifications":
      console.log("YAYYY I am being called ")
      return {
        ...state,
        noNotifications: action.noNotifications
      }
    case "setNoMessages":
      return {
        ...state,
        noMessages: action.noMessages
      }
    default:
      return(state)
  }
}

const store = createStore(reducer, composeWithDevTools());

/* 
The above initializes React Redux Store. Need to follow the following to allow for global states for components 
If the function is called AuditForm, do the foll:

import { connect } from 'react-redux';

-- The below is at the bottom of the file
const mapStateToProps = function(state) {
return {
    auditFormData: state.auditFormData
}
}
export default connect(mapStateToProps)(AuditForm);

-- Can use the below to dispatch
props.dispatch({ type: "setAuditFormData", auditFormData: auditData })

-- Accessing ststes 
props.auditFormData
*/

function App(){
  return (
    <Provider store = { store }>
      <Router>
        <Switch>
          <Route exact path='/' component={ Login } />
          <Route path='/forgotPassword' component={ ForgotPassword } />
          <Route path='/changePassword/:token' component={ ChangePassword } />
          <div>
            <div style={{paddingBottom:25}}><Navigator/></div>
            <Route path="/dashboard" component={ Dashboard } />
            <Route path="/about" component={ About } />
            <Route path="/auditDetail/:audit_id" component={ AuditView } />
            <Route path="/auditInitialise" component={AuditInitialView}/>
            <Route path='/auditForm/:iid/:oid/:at' component={ AuditForm } />
            <Route path='/institutions' component={ InstitutionView } />
            <Route path='/addOutlet' component={AddOutlet} />
            <Route path='/deleteOutlet' component={DeleteOutlet} />
            {/* <Route path='/addInstitution' component={AddInstitution} /> */}
          </div>
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;
