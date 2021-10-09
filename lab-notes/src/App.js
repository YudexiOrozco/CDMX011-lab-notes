import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import Login from './components/Login'
import Register from './components/Register'
import Wall from './components/Wall'
import {auth} from './firebase'

function App() {

  const [firebaseUser, setFirebaseUser] = React.useState(false)

  React.useEffect(() => {
    auth.onAuthStateChanged(user => {
      // console.log(user)
      if(user){
        setFirebaseUser(user)
      }else{
        setFirebaseUser(null)
      }
    })
  }, [])

  return firebaseUser !== false ? (
    <Router>
      <div className="container">
        {/* <div className='btn-group'>
          <Link to = '/register'>
            Registro
          </Link>
        </div> */}
        <Switch>
          <Route path='/' exact>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
            <NavLink to = '/wall' activeClassName='active'>
            Wall
            </NavLink>
            <hr />
            <Link to = '/'>
            Log in
            </Link>
          </Route>
          <Route path='/wall'>
            <Wall />
          </Route>
        </Switch>
      </div>
    </Router>
  ) : (
    <p>Loading...</p>
  )
}

export default App;
