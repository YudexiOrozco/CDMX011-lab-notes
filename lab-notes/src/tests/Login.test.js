import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { shallow } from "enzyme";
import Login from '../components/Login';

describe('Pruebas en el <Login />', () => {
  let wrapper = shallow(  <Login />  );
 
  beforeEach( () => {
    
    wrapper = shallow(  <Login />  );
    
  });

  test( 'Sobre etiqueta span dentro de label', () => {
    render(<Login />)
    const contentEmail = screen.getByText('Email')
    expect(contentEmail).toBeInTheDocument()
  });

  test('Debe de mostrar el componente <Login /> correctamente', () => {

    expect( wrapper ).toMatchSnapshot();

  })

  test('Mostrar error si se envia el formulario con los inputs vacios', () => {
  
    wrapper.find('form').simulate('submit', { preventDefault(){} });
    const text = wrapper.find('p').text();

    expect( text ).toBe('Ingrese Email');
  })
  
  test('Mostrar error si se envia el formulario con el password vacio', () => {
  
    let input = wrapper.find('input').at(0);
    input.simulate('change', { target: { value: 'test@test.com' }});

    wrapper.find('form').simulate('submit', { preventDefault(){} });
    const text = wrapper.find('p').text();

    expect( text ).toBe('Ingrese Password');
  })

  test('El texto de botones debe cambiar cuando se hace click en New Account', () => {
  
    wrapper.find('button').at(1).simulate('click');

    let inputs = wrapper.find('span');

    expect(inputs.at(0).text() ).toBe('Email');
    expect(inputs.at(1).text() ).toBe('Password');

    expect(wrapper.find('input').length).toBe(2)

    const buttons =  wrapper.find('button')

    expect(buttons.at(0).text() ).toBe('Sign Up');
    expect(buttons.at(1).text() ).toBe('You already sign up?');
  })

  test('El texto de botones debe cambiar cuando se hace click en You already sign up?', () => {
  
    wrapper.find('button').at(1).simulate('click'); // New Account
    wrapper.find('button').at(1).simulate('click'); // You already sign up?'

    let inputs = wrapper.find('span');

    expect(inputs.at(0).text() ).toBe('Email');
    expect(inputs.at(1).text() ).toBe('Password');

    expect(wrapper.find('input').length).toBe(2)

    const buttons =  wrapper.find('button');

    expect(buttons.at(0).text() ).toBe('Log In');
    expect(buttons.at(1).text() ).toBe('New account');
  })
})
