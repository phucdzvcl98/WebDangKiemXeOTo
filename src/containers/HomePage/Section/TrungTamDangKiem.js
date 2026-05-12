import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class TrungTamDangKiem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrCenters: []
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
        console.log('phuc check view infor:', center)
        this.props.history.push(`/detail-center/${center.id}`)
    }
    render() {
        let arrCenters = this.state.arrCenters;
        let { language } = this.props;
        // arrCenters = arrCenters.concat(arrCenters).concat(arrCenters)
        return (
            <div className=" section-share section-trung-tam-dang-kiem">
                <div className="section-container">
                    <div className="section-header">
                        <span className='title-section'><FormattedMessage id="homepage.outstanding-vehicle-inspection-center" /></span>
                        <button className="btn-section"><FormattedMessage id="homepage.more-infor" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>

                            {arrCenters && arrCenters.length > 0
                                && arrCenters.map((item, index) => {

                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                    return (
                                        <div className="section-customize" key={index} onClick={() => this.handleViewDetailCenter(item)}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className="bg-image section-trung-tam-dang-kiem"
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                    />
                                                </div>
                                                <div className='position text-center' >
                                                    <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                    <div>Hà Nội</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TrungTamDangKiem));
