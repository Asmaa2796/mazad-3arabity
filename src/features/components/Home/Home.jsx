import Auctions from '../Auctions/Auctions';
import Brands from '../Brands/brands';
import Features from '../Features/Features';
import Hero from './../Hero/Hero';

const Home = () => {
    return (
        <>
            <Hero/>
            <Brands/>
            <Auctions/>
            <Features/>
        </>
    );
}

export default Home;
