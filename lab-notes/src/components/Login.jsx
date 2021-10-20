import React, {useState} from 'react'
import logo from '../images/logo.png'
import cook from '../images/cooking.png'
import google from '../images/google.png'
import vector from '../images/vector.png'
import { auth, db } from '../firebase'
import {withRouter} from 'react-router-dom'

const Login = (props) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [registro, setRegistro] = useState(false)

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
      return
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


  const focus = (e) => {
    e.currentTarget.previousElementSibling.classList.add('top')
    e.currentTarget.previousElementSibling.classList.add('focus');
    e.currentTarget.parentNode.classList.add('focus');
  }

  const blur = (e) => {
    e.currentTarget.value = e.currentTarget.value.trim();
    if(e.currentTarget.value.trim().length === 0 ){
       e.currentTarget.previousElementSibling.classList.remove('top');
    }
   
    e.currentTarget.previousElementSibling.classList.remove('focus');
    e.currentTarget.parentNode.classList.remove('focus');
  }

  return (
    <div className='container-login'>
      <img className='logo-login' src={logo} alt='logo app foodpad'/>
      <img className='cook' src={cook} alt='cooking'/>
      <h3 className='slogan'>Manage, organize and save your favorite recipes.</h3>
      {/* <h4 className='text-register'>
        {
          registro ? 'Create an account' : 'Login registered user'
        }
      </h4> */}
      <div className='container'>
        <div className='container-form'>
          <form onSubmit={procesarDatos}>
            {
              error && (
                <div>{error}</div>
              )
            }
            <div className='div-input'> 
              <label className='inputs'>
                <span className='span-email'>Email</span>
                <input 
                  type = 'email' 
                  className = 'input-email'
                  onChange = {e => setEmail(e.target.value)}
                  onFocus={ (e) => { focus(e)} }
                  onBlur={ (e) => { blur(e)} }
                  value = {email}
                />
              </label>
           
            <label className='inputs'>
            <span className='span-email'>Password</span>
            <input 
              type = 'password' 
              className = 'input-email'
              onChange = {e => setPassword(e.target.value)}
              onFocus={ (e) => { focus(e)} }
              onBlur={ (e) => { blur(e)} }
              value = {password}
            />
             </label> 
            </div>
            <button className='btn-login' type='submit'>
              {
                registro ? 'Sign Up' : 'Log In'
              }
            </button>
            <button className='btn-google' ><img  src={google} alt='btn-google'/>With Google</button>
            <button 
              className='btn-new' 
              onClick={() => setRegistro(!registro)}
              type='button'
            >
             {
               registro ? 'You already sign up?' : 'New account'
             }
            </button>
          </form>
        </div>
      </div>
      <img className='vector' src={vector} alt='vector'/>
    </div>
  )
}

export default withRouter(Login)
