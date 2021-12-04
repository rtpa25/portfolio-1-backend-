/** @format */

import Announcement from '../components/Announcement';
import Categories from '../components/Categories';
import DummyProducts from '../components/DummyProducts';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Slider from '../components/Slider';

const Home = () => {
  return (
    <div>
      <Announcement />
      <Navbar />
      <Slider />
      <Categories />
      <DummyProducts />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
