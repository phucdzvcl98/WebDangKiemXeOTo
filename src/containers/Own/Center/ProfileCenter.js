import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileCenter.scss';
import { getProfileCenterById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { isParameter } from 'typescript';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';

class DefaultClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforCenter(this.props.centerId);
        this.setState({
            dataProfile: data
        })
    }

    getInforCenter = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileCenterById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.centerId !== prevProps.centerId) {

        }

    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id='own.booking-modal.priceBooking' /></div>
                </>
            )
        }
        return <></>
    }

    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionCenter, dataTime } = this.props;

        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi},${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn},${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-center-container'>
                <div className='intro-center'>
                    <div
                        className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}>

                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionCenter === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown
                                        && dataProfile.Markdown.description
                                        &&
                                        <span>
                                            {dataProfile.Markdown.description}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }

                        </div>
                    </div>
                </div>
                <div className='price'>
                    <FormattedMessage id='own.booking-modal.price' />
                    {dataProfile && dataProfile.Center_Infor && language === LANGUAGES.VI &&
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Center_Infor.priceTypeData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix='VND'
                        />
                    }
                    {dataProfile && dataProfile.Center_Infor && language === LANGUAGES.EN &&
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Center_Infor.priceTypeData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix='$'
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
