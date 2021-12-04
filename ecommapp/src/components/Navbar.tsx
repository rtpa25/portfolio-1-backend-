/** @format */

import { Badge } from '@material-ui/core';
import { ShoppingCartOutlined } from '@material-ui/icons';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';

const Container = styled.div`
  @media only screen and (max-width: 890px) {
    height: 4rem;
  }
`;

const Right = styled.div`
  @media only screen and (max-width: 890px) {
    justify-content: flex-start;
  }
  @media only screen and (max-width: 420px) {
    font-size: 1rem;
  }
`;

const Heading = styled.h1`
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: teal;
  }
  @media only screen and (max-width: 420px) {
    font-size: 1.5rem;
  }
`;

const Navbar = () => {
  const cartQuantity = useAppSelector((state) => state.cart.quantity);
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const signOutHandler = () => {
    Cookies.remove('token');
    navigate('/');
  };
  return (
    <Container className='h-24'>
      <div className='flex justify-between px-4 py-4'>
        <Link to={token ? '/products' : '/'}>
          <div className='text-center'>
            <Heading className='text-4xl font-semibold'>NYKA.</Heading>
          </div>
        </Link>

        <Right className='flex items-center justify-end '>
          {!token && (
            <Link to={'/register'}>
              <div className='right-btn'>REGISTER</div>
            </Link>
          )}

          {!token && (
            <Link to={'/login'}>
              <div className='right-btn'>SIGNIN</div>
            </Link>
          )}

          {token && (
            <div className='right-btn' onClick={signOutHandler}>
              SIGNOUT
            </div>
          )}

          {token && (
            <Link to={'/cart'}>
              <div className='right-btn'>
                <Badge badgeContent={cartQuantity} color='primary'>
                  <ShoppingCartOutlined />
                </Badge>
              </div>
            </Link>
          )}
        </Right>
      </div>
    </Container>
  );
};

export default Navbar;
