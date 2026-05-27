import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
import './Center.scss';
class Center extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrCenters: [],
            keyword: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topCentersRedux !== this.props.topCentersRedux) {
            this.setState({
                arrCenters: this.props.topCentersRedux
            })
        }
    }
    componentDidMount() {
        this.props.loadTopCenters();
    }
    handleViewDetailCenter = (center) => {
        if (this.props.history) {
            this.props.history.push(`/detail-center/${center.id}`)
        }
    }
    render() {
        let { arrCenters, keyword } = this.state;
        let { language } = this.props;

        let textSearch = keyword ? keyword.toLowerCase() : '';

        let filterCenters = arrCenters.filter(item => {
            let name = item.fullName ? item.fullName.toLowerCase() : '';
            let address = item.address ? item.address.toLowerCase() : '';

            return name.includes(textSearch) || address.includes(textSearch);
        });
        return (
            <div className=" section-share section-center">
                <div className="section-container">
                    <div className="section-header">
                        <div className='search-center-home'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Tìm trung tâm theo xã, phường, khu vực...'
                                value={this.state.keyword}
                                onChange={(event) => this.setState({ keyword: event.target.value })}
                            />
                        </div>
                        <span className='title-section'><FormattedMessage id="homepage.outstanding-vehicle-inspection-center" /></span>
                        <button className="btn-section"><FormattedMessage id="homepage.more-infor" /></button>
                    </div>
                    <div className="section-body">
                        {textSearch ? (
                            <div className="center-search-result">
                                {filterCenters && filterCenters.length > 0 &&
                                    filterCenters.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        }

                                        let nameVi = `${item.positionData.valueVi}, ${item.fullName}`;
                                        let nameEn = `${item.positionData.valueEn}, ${item.fullName}`;

                                        return (
                                            <div
                                                className="section-customize"
                                                key={index}
                                                onClick={() => this.handleViewDetailCenter(item)}
                                            >
                                                <div className='customize-border'>
                                                    <div className='outer-bg'>
                                                        <div
                                                            className="bg-image section-center"
                                                            style={{ backgroundImage: `url(${imageBase64})` }}
                                                        />
                                                    </div>

                                                    <div className='position text-center'>
                                                        <div className='center-name'>
                                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                                        </div>
                                                        <div className='center-address'>
                                                            {item.address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            <Slider {...this.props.settings}>
                                {filterCenters && filterCenters.length > 0 &&
                                    filterCenters.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        }

                                        let nameVi = `${item.positionData.valueVi}, ${item.fullName}`;
                                        let nameEn = `${item.positionData.valueEn}, ${item.fullName}`;

                                        return (
                                            <div
                                                className="section-customize"
                                                key={index}
                                                onClick={() => this.handleViewDetailCenter(item)}
                                            >
                                                <div className='customize-border'>
                                                    <div className='outer-bg'>
                                                        <div
                                                            className="bg-image section-center"
                                                            style={{ backgroundImage: `url(${imageBase64})` }}
                                                        />
                                                    </div>

                                                    <div className='position text-center'>
                                                        <div className='center-name'>
                                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                                        </div>
                                                        <div className='center-address'>
                                                            {item.address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        )}
                    </div>
                </div >
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topCentersRedux: state.admin.topCenters

    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopCenters: () => dispatch(actions.fetchTopCenter())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Center));
