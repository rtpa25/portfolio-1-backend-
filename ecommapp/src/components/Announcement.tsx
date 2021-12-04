/** @format */

import styled from 'styled-components';

const Container = styled.div`
  @media only screen and (max-width: 450px) {
    display: none;
  }
`;

const Announcement = () => {
  return (
    <Container className='announcement-banner'>
      Super Deal! Free Shipping on Order Over $50
    </Container>
  );
};

export default Announcement;
