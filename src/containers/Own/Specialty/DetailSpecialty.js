import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import CenterExtraInfor from '../Center/CenterExtraInfor';
import CenterSchedule from '../Center/CenterSchedule';
import ProfileCenter from '../Center/ProfileCenter';
import { getAllDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrCenterId: [],
            dataDetailSpecialty: {},
            listProvince: []
        }
    }

    async componentDidMount() {
        if (this.props && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });

            let resProvince = await getAllCodeService('PROVINCE');

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrCenterId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.centerSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrCenterId.push(item.centerId)
                        })
                    }
                }

                let dataProvince = resProvince.data;
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueEn: 'ALL',
                        valueVi: 'Toàn quốc',
                    })
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrCenterId: arrCenterId,
                    listProvince: dataProvince ? dataProvince : []
                })
            }
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleOnChangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;

            let res = await getAllDetailSpecialtyById({
                id: id,
                location: location
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrCenterId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.centerSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrCenterId.push(item.centerId)
                        })
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrCenterId: arrCenterId,
                })
            }
        }
    }
    render() {
        let { arrCenterId, dataDetailSpecialty, listProvince } = this.state;

        console.log('phuccheck state:', this.state)
        let { language } = this.props;
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty)
                            &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}>

                            </div>
                        }
                    </div>
                    <div className='search-sp-center'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })}
                        </select>
                    </div>
                    {arrCenterId && arrCenterId.length > 0 &&
                        arrCenterId.map((item, index) => {
                            return (
                                <div className='each-center' key={index}>
                                    <div className='dt-content-left'>
                                        <div className='profile-center'>
                                            <ProfileCenter
                                                centerId={item}
                                                isShowDescriptionCenter={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                    </div>
                                    <div className='dt-content-right'>
                                        <div className='center-schdule'>
                                            <CenterSchedule
                                                centerIdFromParent={item}
                                            />
                                        </div>
                                        <div className='center-extra-infor'>
                                            <CenterExtraInfor
                                                centerIdFromParent={item}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
