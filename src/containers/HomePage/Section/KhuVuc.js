import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class KhuVuc extends Component {
    render() {
        return (
            <div className=" section-share section-khu-vuc">
                <div className="section-container">
                    <div className="section-header">
                        <span className='title-section'>Khu Vực Nổi Bật</span>
                        <button className="btn-section">Xem thêm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="bg-image section-khu-vuc hanoi" />
                                <div className='text-center'>Hà Nội</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-khu-vuc tphcm   " />
                                <div className='text-center'>TP.HCM</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-khu-vuc danang" />
                                <div className='text-center'>Đà Nẵng</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-khu-vuc haiphong   " />
                                <div className='text-center'>Hải Phòng</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-khu-vuc cantho" />
                                <div className='text-center'>Cần Thơ</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-khu-vuc binhduong" />
                                <div className='text-center'>Bình Dương</div>
                            </div>
                        </Slider>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(KhuVuc);
