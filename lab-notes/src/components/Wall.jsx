import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { withRouter } from 'react-router-dom'
import icon from '../images/icon-wall.png'
import logo from '../images/logo.png'
import close from '../images/close.png'
import styled from 'styled-components'

const Wall = (props) => {

  const [user, setUser] = useState(null)
  const [tareas, setTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [content, setContent] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState('')
  const [modal, setModal] = useState(false);

  const cerrarSesion = () => {
      auth.signOut()
        .then(() => {
          props.history.push('/')
        })
    }

  React.useEffect(() => {
    const getData = async () => {
      try {
        const data = await db.collection('tareas').doc(auth.currentUser.email).collection('recipes').orderBy("fecha", "desc").get()
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
    if(!content.trim()){
      console.log('Esta vacio')
      return
    }
    try {
      const nuevaTarea = {
        name: tarea,
        description: content,
        fecha: Date.now(), // new Date("October 5, 2021 13:30:00")
      }

      const data = await db.collection('tareas').doc(user.email).collection('recipes').add(nuevaTarea)

      setTareas([
        {...nuevaTarea, id: data.id}, ...tareas,
      ])

      setTarea('')
      setContent('')
      setModal(false)
    } catch (error) {
      console.log(error)
    }
   
  }

  const eliminar = async (id) => {
    try {
      await db.collection('tareas').doc(user.email).collection('recipes').doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setContent(item.description)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('vacio')
      return
    }
    if(!content.trim()){
      console.log('vacio')
      return
    }
    try {
      await db.collection('tareas').doc(user.email).collection('recipes').doc(id).update({
         name: tarea,
         description: content,
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea, description: content} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setContent('')
      setId('')
      setModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='first-div'>
     <div className='encabezado'>
       <img className='logo' src={logo} alt='logo-foodpad'/> 
        {
          user && (
            <h3 className='welcome'>Welcome {user.email}</h3>
          )
        }
        <button className='btn-logout' onClick={() => cerrarSesion()}>Sign out</button>
      </div>
      <div className='container-tareas'>
            {
              tareas.map(item => (
                <div className='div-recipes' key={item.id}>
                  <b>{item.name}</b> <hr/>
                   <div
                    onClick={() => {activarEdicion(item); setModal(!modal)}}
                  
                  >{item.description}</div>
                  <div className='btn-tareas'>
                  <button className = 'btns' onClick={() => eliminar(item.id)}>
                    Delete
                  </button>
                  <button
                  className = 'btns'
                  onClick={() => {activarEdicion(item); setModal(!modal)}}
                  >
                    Edit
                  </button>
                  <h3>{new Date(item.fecha).toDateString() }</h3>
                  </div>
                </div>
              ))
            }
        
      </div>
        <button 
          className='icon-plus'
          onClick={() => setModal(!modal)}
          ><img src={icon} alt='plus'/></button>
      
      <div className='formulario'>
              {modal && 
              <ContenedorModal>
                <Contenido>
                <h3 className='title-modal'>
                {
                  modoEdicion ? 'Edit recipe' : 'Add recipe'
                }
                </h3>
                  <form onSubmit={modoEdicion ? editar : agregar}>
                    <input
                      type='text'
                      placeholder = 'Add a title'
                      className = 'input-title'
                      onChange = {e => setTarea(e.target.value)}
                      value = {tarea}
                    />
                    <textarea
                      className = 'input-pass'
                      type = 'text'
                      placeholder='Content...'
                      onChange = {e => setContent(e.target.value)}
                      value = {content}
                    ></textarea>
                    <button 
                      className='btn-submit'
                      type = 'submit'
                    >
                      {
                        modoEdicion ? 'Edit' : 'Add'
                      }
                    </button>
                  </form>
                </Contenido>
                <BotonCerrar 
                  className='btn-close'
                  onClick={() => setModal(false)}
                  ><img src={close} alt='close'/></BotonCerrar>
              </ContenedorModal>
              }
      </div>
    </div>
  )
}

export default withRouter(Wall)




const ContenedorModal = styled.div`
  width: 300px;
  min-height: 200px;
  background: #fff;
  position: relative;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  
  padding: 20px;
  left: 90px;
`;

const BotonCerrar = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  transition: .3s ease all;
  border-radius: 5px;
  font-weight: bold;
  font-size: 25px;

  &:hover {
    background: #f2f2f2;
  }
`;

const Contenido = styled.div`
 
`;