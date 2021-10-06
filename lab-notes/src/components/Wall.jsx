import React from 'react'
import {auth} from '../firebase'
import {withRouter} from 'react-router-dom'

const Wall = (props) => {

  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    if(auth.currentUser){
      console.log('Existe un usuario')
      setUser(auth.currentUser)
    }else{
      console.log('No existe el usuario')
      props.history.push('/')
    }
  }, [props.history])

  const cerrarSesion = () => {
    auth.signOut()
      .then(() => {
        props.history.push('/')
      })
  }


  return (
    <div>
      <h2>Este es el wall</h2>
      <button onClick={() => cerrarSesion()}>Cerrar sesión</button>
      {
        user && (
          <h3>{user.email}</h3>
        )
      }
    </div>
  )
}

export default withRouter(Wall)
