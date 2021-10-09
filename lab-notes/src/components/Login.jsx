import React from 'react'
import logo from '../images/logo.png'
import cook from '../images/cooking.jpg'
import { auth, db } from '../firebase'
import {withRouter} from 'react-router-dom'

const Login = (props) => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const [registro, setRegistro] = React.useState(false)

  const procesarDatos = (e) =>{
    e.preventDefault()
    if(!email.trim()){
      // console.log('Ingrese Email')
      setError('Ingrese Email')
      return
    }
    if(!password.trim()){
      // console.log('Ingrese Password')
      setError('Ingrese Password')
      return
    }
    if(password.length < 6){
      // console.log('Password mayor a 6 caracteres')
      setError('Password mayor a 6 caracteres')
    }
    setError(null)
    console.log('Pasando todas las validaciones!')

    if(registro){
      registrar()
    }else{
      login()
    }
  }

  const login = React.useCallback(async() => {
    try {
      await auth.signInWithEmailAndPassword(email, password)
      // console.log(res.user)
      setEmail('')
      setPassword('')
      setError(null)
      props.history.push('/wall')
    } catch (error) {
      console.log(error)
      if(error.code === 'auth/user-not-found'){
        setError('Email not registered...')
      }
      if(error.code === 'auth/wrong-password'){
        setError('The password is invalid')
      }
    }

  }, [email, password, props.history])

  const registrar =React.useCallback(async() => {

    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      // console.log(res.user)
      await db.collection('usuarios').doc(res.user.email).set({
        email: res.user.email,
        uid: res.user.uid
      })
      setEmail('')
      setPassword('')
      setError(null)
      props.history.push('/wall')
    } catch (error) {
      console.log(error)
      if(error.code === 'auth/invalid-email'){
        setError('The email address is incorrect')
      }
      if(error.code === 'auth/email-already-in-use'){
        setError('The email is already in use')
      }
    }

  }, [email, password, props.history])

  return (
    <div className='container-login'>
      <img className='logo' src={logo} alt='logo app foodpad'/>
      <img className='cook' src={cook} alt='cooking'/>
      <h3 className='slogan'>Manage, organize and save your favorite recipes</h3>
      <h4 className='text-register'>
        {
          registro ? 'Registro de usuarios' : 'Login de acceso'
        }
      </h4>
      <div className='container'>
        <div className='container-form'>
          <form onSubmit={procesarDatos}>
            {
              error && (
                <div>{error}</div>
              )
            }
            <input 
              type = 'email' 
              className = 'inputs'
              placeholder = 'Ingrese un email'
              onChange = {e => setEmail(e.target.value)}
              value = {email}
            />
            <input 
              type = 'password' 
              className = 'inputs'
              placeholder = 'Ingrese una contraseña'
              onChange = {e => setPassword(e.target.value)}
              value = {password}
            />
            <button className='btn-login' type='submit'>
              {
                registro ? 'Registrarse' : 'Acceder'
              }
            </button>
            <button 
              className='btn-login' 
              onClick={() => setRegistro(!registro)}
              type='button'
            >
             {
               registro ? '¿Ya estas registrado?' : '¿No tienes cuenta?'
             }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Login)
