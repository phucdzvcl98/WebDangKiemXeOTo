import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import DichVu from './Section/DichVu';
import KhuVuc from './Section/KhuVuc';
import TrungTamDangKiem from './Section/TrungTamDangKiem';
import CamNang from './Section/CamNang';
import About from './Section/About';
import HomeFooter from './HomeFooter';
import './HomePage.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { after } from 'lodash';

class HomePage extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <DichVu settings={settings} />
                <KhuVuc settings={settings} />
                <TrungTamDangKiem settings={settings} />
                <CamNang settings={settings} />
                <About />
                <HomeFooter />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
