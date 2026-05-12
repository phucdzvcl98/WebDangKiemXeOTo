import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class HomeFooter extends Component {
    render() {
        return (
            <div className=" home-footer">
                <p>&copy; 2026 Phuc, More information, please visit my youtube channel.<a target='_blank' href="https://youtu.be/Zx9nmLXmiaI?si=LSFzyUGPJ2Kucqkx"> &#8594; Click here &#8592; </a></p>
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
