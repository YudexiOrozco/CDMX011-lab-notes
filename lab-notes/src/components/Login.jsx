import React from 'react'
import logo from '../images/logo.png'
import { auth } from '../firebase'

const Login = () => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const [registro, setRegistro] = React.useState(true)

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
    }
  }

  const registrar =React.useCallback(async() => {

    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      console.log(res)
    } catch (error) {
      console.log(error)
    }

  }, [email, password])

  return (
    <div className='container-login'>
      <img className='logo' src={logo} alt='logo app foodpad'/>
      <h3>Manage, organize and save your favorite recipes</h3>
      <h4>
        {
          registro ? 'Registro de usuarios' : 'Login de acceso'
        }
      </h4>
      <div className='container-form'>
        <div>
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
            <button type='submit'>
              {
                registro ? 'Registrarse' : 'Acceder'
              }
            </button>
            <button 
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

export default Login
