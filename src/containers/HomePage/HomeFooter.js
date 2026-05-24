import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeFooter.scss';

class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer">

                <div className='footer-container'>

                    <div className='footer-left'>
                        <h3>Web Đăng Kiểm Xe Ô Tô</h3>
                        <p>
                            Hệ thống hỗ trợ đặt lịch đăng kiểm xe ô tô online nhanh chóng,
                            tiện lợi và hiện đại.
                        </p>
                    </div>

                    <div className='footer-center'>
                        <h4>Thông tin liên hệ</h4>

                        <p>Email: dangphuc09082003@gmail.com</p>
                        <p>Phone: 0123456789</p>
                        <p>Hà Nội, Việt Nam</p>
                    </div>

                    <div className='footer-right'>
                        <h4>Liên kết</h4>

                        <a
                            target='_blank'
                            rel="noreferrer"
                            href="https://www.facebook.com/PhucDaNg2003/"
                        >
                            Facebook on me
                        </a>
                    </div>

                </div>

                <div className='footer-bottom'>
                    © 2026 Developed by Phúc
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

export default connect(mapStateToProps)(HomeFooter);