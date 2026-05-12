import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class CamNang extends Component {
    render() {
        return (
            <div className=" section-share section-cam-nang">
                <div className="section-container">
                    <div className="section-header">
                        <span className='title-section'>Cam Nang</span>
                        <button className="btn-section">Xem tat ca</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="bg-image section-cam-nang giayto" />
                                <div className='text-center'>Kiểm tra giấy tờ</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-cam-nang xe   " />
                                <div className='text-center'>Kiểm tra tình trạng xe</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-cam-nang trungtam" />
                                <div className='text-center'>Đến trung tâm đăng kiểm</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-cam-nang dangkiem     " />
                                <div className='text-center'>Quy trình kiểm định</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-cam-nang kq" />
                                <div className='text-center'>Nhận kết quả</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-cam-nang luuy" />
                                <div className='text-center'>Lưu ý sau đăng kiểm</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CamNang);
