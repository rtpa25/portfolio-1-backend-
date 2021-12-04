/** @format */

import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { signup } from '../store/thunks/userThunk';

const Container = styled.div`
  background: linear-gradient(rgba(0, 78, 14, 0.5), rgba(209, 209, 209, 0.5)),
    url('https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')
      center;
  background-size: cover;
`;

const Input = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.5);
  flex: 1;
  min-width: 40%;
  margin: 1.25rem 0.625rem 0 0;
  padding: 0.625rem;
`;

const Button = styled.button`
  transition: all 0.3s ease;
  &:hover {
    background-color: #000;
    color: #00d8d8;
  }
`;

const Wrapper = styled.div`
  @media only screen and (max-width: 900px) {
    width: 75%;
  }
  @media only screen and (max-width: 600px) {
    width: 85%;
  }
`;

const Form = styled.form`
  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const Error = styled.a`
  margin-top: 0.725rem;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
  color: #810000;
  &:hover {
    color: #ff0000;
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isFetching, error } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const signupHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let res = await signup(dispatch, {
      email: email,
      username: username,
      password: confirmPassword,
    });
    if (error === false && isFetching === false) {
      Cookies.remove('token');
      Cookies.set('token', res?.data.token);
      navigate('/products');
    }
  };

  return (
    <Container className='flex items-center justify-center w-screen h-screen'>
      <Wrapper className='w-5/12 bg-white p-7'>
        <h1 className='text-4xl font-light text-gray-700'>CREATE AN ACCOUNT</h1>
        <Form className='flex flex-wrap'>
          <Input
            placeholder='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder='email'
            type={'email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder='confirm password'
            type='password'
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
          {error && <Error>Something went wrong...</Error>}

          <span className='w-full mx-0 my-5 text-sm text-gray-500'>
            <Link to={'/login'}>
              {' '}
              Already a user <b>SIGN IN</b>{' '}
            </Link>
          </span>

          <Button
            disabled={isFetching}
            className='w-5/12 p-3 text-white bg-green-700'
            onClick={signupHandler}>
            CREATE
          </Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
