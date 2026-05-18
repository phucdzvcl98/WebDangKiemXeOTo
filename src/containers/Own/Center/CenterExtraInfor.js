import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import './CenterExtraInfor.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { isTemplateExpression } from 'typescript';
import { getExtraInforCenterById } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';

class CenterExtraInfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {}
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.language !== prevProps.language) {

        }

        if (this.props.centerIdFromParent !== prevProps.centerIdFromParent) {
            let res = await getExtraInforCenterById(this.props.centerIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;

        return (
            <div className='center-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='own.extra-infor-center.text-address' />
                    </div>
                    <div className='name-arena'>
                        {extraInfor && extraInfor.nameArena ? extraInfor.nameArena : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfor && extraInfor.addressArena ? extraInfor.addressArena : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfor === false &&
                        <div className='short-infor'>
                            <FormattedMessage id="own.extra-infor-center.price" />
                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI
                                &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfor.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />
                            }
                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN
                                &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfor.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'$'}
                                />
                            }
                            <span className='detail' onClick={() => this.showHideDetailInfor(true)}>
                                <FormattedMessage id="own.extra-infor-center.detail" />
                            </span>
                        </div>
                    }

                    {isShowDetailInfor === true &&
                        <>
                            <div className='title-price'>
                                <FormattedMessage id="own.extra-infor-center.price" />
                            </div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'>
                                        <FormattedMessage id="own.extra-infor-center.price" />
                                    </span>
                                    <span className='right'>
                                        {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI
                                            &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfor.priceTypeData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            />
                                        }
                                        {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN
                                            &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfor.priceTypeData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'$'}
                                            />
                                        }
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id="own.extra-infor-center.payment" />
                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.VI
                                    ? extraInfor.paymentTypeData.valueVi : ''}
                                {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.EN
                                    ? extraInfor.paymentTypeData.valueVi : ''}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfor(false)}>
                                    <FormattedMessage id="own.extra-infor-center.hide-price" />
                                </span>
                            </div>

                        </>
                    }
                </div>

            </div>
        )
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CenterExtraInfor)
);
