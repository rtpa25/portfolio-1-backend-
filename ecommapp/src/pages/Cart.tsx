/** @format */
import { Add, Remove } from '@material-ui/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import { axiosInstance } from '../config';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  deleteCartItem,
  fetchCart,
  updateCart,
} from '../store/thunks/cartThunks';

interface TopButtonProps {
  bod: 'outlined' | 'filled';
}

const TopButton = styled.button<TopButtonProps>`
  padding: 0.625rem;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) =>
      props.bod === 'outlined' ? 'black' : 'white'};
    border: ${(props) =>
      props.bod === 'filled' ? '1px solid rgba(16, 185, 129, 1)' : 'none'};
    color: ${(props) =>
      props.bod === 'filled' ? 'black' : 'rgba(16, 185, 129, 1)'};
  }
  @media only screen and (max-width: 500px) {
    margin: 1rem 0;
    width: 70%;
  }
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 685px) {
    flex-direction: column;
  }
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 15rem;
`;

const Details = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media only screen and (max-width: 685px) {
    flex-direction: row;
    justify-content: space-evenly;
  }
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProductAmount = styled.div`
  font-size: 1.5rem;
  margin: 5px;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 200;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 0.625rem;
  padding: 1.25rem;
  height: 50vh;
`;

const SummaryItem = styled.div`
  margin: 1.875rem 0;
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  @media only screen and (max-width: 925px) {
    flex-direction: column;
  }
`;

const QuantityButtonInc = styled(Add)`
  cursor: pointer;
  background-color: green;
  border-radius: 50%;
  color: white;
`;
const QuantityButtonDec = styled(Remove)`
  cursor: pointer;
  background-color: red;
  border-radius: 50%;
  color: white;
`;

const TopButtons = styled.div`
  @media only screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

const Cart = () => {
  const cart = useAppSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const dispatch = useAppDispatch();
  const KEY =
    'pk_test_51Jy8ycSFA8z2kwZwnxQXmFjttu133U1uIjZ5gAXbIKvbvuRBoYShBfdH5aSEDtMdHv0zhLF7gvytN4UHiTFh5hCt00bRFTYcf7';
  const navigate = useNavigate();
  const onToken = (token: any) => {
    setStripeToken(token);
  };

  const updateCartHandler = async (
    cartItemId: string,
    productId: string,
    currentQuantity: number,
    type: 'inc' | 'dec'
  ) => {
    let currentQuantityPrototype = currentQuantity;
    if (type === 'inc') {
      currentQuantityPrototype++;
    } else {
      if (currentQuantityPrototype > 1) {
        currentQuantityPrototype--;
      } else {
        await deleteCartItem(dispatch, cartItemId);
      }
    }
    await updateCart(dispatch, cartItemId, productId, currentQuantityPrototype);
    await fetchCart(dispatch);
  };

  const paymentHandler = async () => {
    try {
      let res = await axiosInstance.post(`/captureStripePayment`, {
        amount: cart.total * 100,
      });
      console.log(res);

      stripeToken && cart.total >= 10 && navigate('sucess');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=''>
      <Navbar />
      <Announcement />
      <div className='p-5 text-gray-700'>
        <h1 className='text-4xl font-light text-center'>YOUR BAG</h1>
        <TopButtons className='flex items-center justify-between p-5'>
          <Link to={'/products'}>
            <TopButton
              bod='outlined'
              className='border border-green-500 border-solid '>
              CONTINUE SHOPPING
            </TopButton>
          </Link>

          <StripeCheckout
            name='NYKA'
            image='https://cdn.gadgets360.com/kostprice/assets/store/1493096224_nykaa.png'
            billingAddress
            shippingAddress
            description={`Your total is $${cart.total}`}
            amount={cart.total * 100}
            token={onToken}
            stripeKey={KEY as string}>
            <TopButton
              bod='filled'
              className='text-green-500 bg-black '
              onClick={paymentHandler}>
              CHECKOUT NOW
            </TopButton>
          </StripeCheckout>
        </TopButtons>
        <Wrapper className='flex justify-between'>
          <Info className=''>
            {cart.products.map((product) => {
              return (
                <Product key={product.product._id}>
                  <ProductDetail>
                    <Image src={product.product.img.secure_url} />
                    <Details>
                      <span>
                        <b>Product:</b> {product.product.name}
                      </span>
                      <span>
                        <b>ID:</b> {product.product._id}
                      </span>
                    </Details>
                  </ProductDetail>
                  <PriceDetail>
                    <ProductAmountContainer>
                      <QuantityButtonInc
                        onClick={() =>
                          updateCartHandler(
                            product._id,
                            product.product._id,
                            product.quantity,
                            'inc'
                          )
                        }
                      />
                      <ProductAmount>{product.quantity}</ProductAmount>
                      <QuantityButtonDec
                        onClick={() =>
                          updateCartHandler(
                            product._id,
                            product.product._id,
                            product.quantity,
                            'dec'
                          )
                        }
                      />
                    </ProductAmountContainer>
                    <ProductPrice>
                      {' '}
                      $ {product.product.price * product.quantity}
                    </ProductPrice>
                  </PriceDetail>
                </Product>
              );
            })}

            <hr />
          </Info>
          <Summary className=''>
            <h1 className='text-4xl font-extralight'>ORDER SUMMARY</h1>
            <SummaryItem>
              <span>Subtotal</span>
              <span>$ {cart.total}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Estimated Shipping</span>
              <span>$ 5.90</span>
            </SummaryItem>
            <SummaryItem>
              <span>Shipping Discount</span>
              <span>$ -5.90</span>
            </SummaryItem>
            <SummaryItem className='text-xl font-semibold'>
              <span>Total</span>
              <span>$ {cart.total}</span>
            </SummaryItem>
            <StripeCheckout
              name='NYKA'
              image='https://cdn.gadgets360.com/kostprice/assets/store/1493096224_nykaa.png'
              billingAddress
              shippingAddress
              description={`Your total is $${cart.total}`}
              amount={cart.total * 100}
              token={onToken}
              stripeKey={KEY as string}>
              <TopButton
                bod='outlined'
                onClick={paymentHandler}
                className='border border-green-500 border-solid '>
                CHECKOUT NOW
              </TopButton>
            </StripeCheckout>
          </Summary>
        </Wrapper>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Cart;
