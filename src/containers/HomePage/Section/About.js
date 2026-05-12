import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class About extends Component {
    render() {
        return (
            <div className=" section-share section-about">
                <div className='section-about-header'>
                    Video đăng kiểm xe ô tô nhanh gọn tại trung tâm đăng kiểm xe
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/t1wJiQLsc50" title="Mẹo đăng kiểm xe ô tô nhanh gọn tại trung tâm đăng kiểm xe An Giang/ngày nào ít xe nhất bạn nên xem" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Video mô phỏng quy trình đăng kiểm thực tế từ tiếp nhận hồ sơ,
                            kiểm tra kỹ thuật đến hoàn tất đăng kiểm. Giúp người dùng
                            hiểu rõ các bước kiểm định xe ô tô nhanh chóng và chính xác.</p>
                    </div>
                </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(About);
