import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions';

class HomeHeader extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }
    render() {

        let language = this.props.language;
        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fa-solid fa-bars"></i>
                            <div className="header-logo"></div>
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <div><b><FormattedMessage id="homeheader.registration-center" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.find-a-vehicle-inspection-center" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="homeheader.schedule-registration" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.choose-a-suitable-date-and-time" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="homeheader.area" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.find-area" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="homeheader.general-package" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.fast-and-reliable" /></div>
                            </div>
                        </div>

                        <div className="right-content">
                            <div className="support">
                                <i className="fa-solid fa-question"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className="home-header-banner">
                        <div className="content-up">
                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>
                            <div className="search">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type="text" placeholder={this.props.language === 'vi' ? "Tìm kiếm trung tâm đăng kiểm..." : "Search for vehicle inspection center..."} />
                            </div>
                        </div>
                        <div className="content-down">
                            <div className="options">
                                <div className="options-child">
                                    <div className="icon-child">🛠️</div>
                                    <div className="text-child"><FormattedMessage id="banner.option1" /></div>
                                </div>
                                <div className="options-child">
                                    <div className="icon-child">📅</div>
                                    <div className="text-child"><FormattedMessage id="banner.option2" /></div>
                                </div>
                                <div className="options-child">
                                    <div className="icon-child">🚗</div>
                                    <div className="text-child"><FormattedMessage id="banner.option3" /></div>
                                </div>
                                <div className="options-child">
                                    <div className="icon-child">🌿</div>
                                    <div className="text-child"><FormattedMessage id="banner.option4" /></div>
                                </div>
                                <div className="options-child">
                                    <div className="icon-child">🛡️</div>
                                    <div className="text-child"><FormattedMessage id="banner.option5" /></div>
                                </div>
                                <div className="options-child">
                                    <div className="icon-child">🚨</div>
                                    <div className="text-child"><FormattedMessage id="banner.option6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
