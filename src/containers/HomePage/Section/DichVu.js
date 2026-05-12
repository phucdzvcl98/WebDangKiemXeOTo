import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';


class DichVu extends Component {
    render() {

        return (
            <div className=" section-share section-dich-vu">
                <div className="section-container">
                    <div className="section-header">
                        <span className='title-section'><dich vu /></span>
                        <button className="btn-section">Xem them</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="bg-image section-dich-vu an-toan" />
                                <div className='text-center'>Kiểm định an toàn kỹ thuật</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-dich-vu khi-thai" />
                                <div className='text-center'>Kiểm định khí thải</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-dich-vu online" />
                                <div className='text-center'>Đặt lịch đăng kiểm online</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-dich-vu tai-nha" />
                                <div className='text-center'>Đăng kiểm tại nhà</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-dich-vu ktra-xe" />
                                <div className='text-center'>Kiểm tra xe trước đăng kiểm </div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-dich-vu tu-van" />
                                <div className='text-center'>Tư vấn & nhắc lịch đăng kiểm</div>
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
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DichVu);


