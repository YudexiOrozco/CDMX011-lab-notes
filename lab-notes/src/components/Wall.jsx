import React from 'react'
import {auth, db} from '../firebase'
import {withRouter} from 'react-router-dom'

const Wall = (props) => {

  const [user, setUser] = React.useState(null)
  const cerrarSesion = () => {
      auth.signOut()
        .then(() => {
          props.history.push('/')
        })
    }

  React.useEffect(() => {
    const getData = async () => {
      try {
        const data = await db.collection('tareas').get()
        console.log(data.docs)
      } catch (error) {
        console.log(error)
      }
    }
    getData();
  })

  React.useEffect(() => {
    if(auth.currentUser){
      console.log('Existe un usuario')
      setUser(auth.currentUser)
    }else{
      console.log('No existe el usuario')
      props.history.push('/')
    }
  }, [props.history])

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
