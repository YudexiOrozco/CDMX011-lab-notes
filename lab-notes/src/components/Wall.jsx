import React from 'react'
import {auth, db} from '../firebase'
import {withRouter} from 'react-router-dom'

const Wall = (props) => {

  const [user, setUser] = React.useState(null)
  const [tareas, setTareas] = React.useState([])
  const [tarea, setTarea] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')

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
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        // console.log(arrayData)
        setTareas(arrayData)
      } catch (error) {
        console.log(error)
      }
    }
    getData();
  }, [])

  React.useEffect(() => {
    if(auth.currentUser){
      // console.log('Existe un usuario')
      setUser(auth.currentUser)
    }else{
      console.log('No existe el usuario')
      props.history.push('/')
    }
  }, [props.history])

  const agregar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('Esta vacio')
      return
    }
    try {
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      }
      const data = await db.collection('tareas').add(nuevaTarea)

      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ])

      setTarea('')
    } catch (error) {
      console.log(error)
    }
   
  }

  const eliminar = async (id) => {
    try {
      await db.collection('tareas').doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('vacio')
      return
    }
    try {
      await db.collection('tareas').doc(id).update({
         name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div>
      <h2>Lista de Recetas</h2>
      <button onClick={() => cerrarSesion()}>Cerrar sesión</button>
      {
        user && (
          <h3>{user.email}</h3>
        )
      }
      <div className='container-tareas'>
        <div>
          <ul>
            {
              tareas.map(item => (
                <li key={item.id}>
                  {item.name}
                  <button onClick={() => eliminar(item.id)}>
                    Delete
                  </button>
                  <button
                   onClick={() => activarEdicion(item)}
                  >
                    Edit
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className='formulario'>
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
          <input
            type='text'
            placeholder='Ingrese Receta'
            className='form-input'
            onChange={e => setTarea(e.target.value)}
            value={tarea}
          />
          <button 
            type='submit'
          >
            {
              modoEdicion ? 'Editar' : 'Agregar'
            }
          </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Wall)
