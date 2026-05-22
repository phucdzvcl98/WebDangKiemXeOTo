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
            listRegion: []
        }
    }

    async componentDidMount() {
        if (this.props && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });

            let resRegion = await getAllCodeService('REGION');

            if (res && res.errCode === 0 && resRegion && resRegion.errCode === 0) {
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

                let dataRegion = resRegion.data;
                if (dataRegion && dataRegion.length > 0) {
                    dataRegion.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'REGION',
                        valueEn: 'ALL',
                        valueVi: 'Toàn quốc',
                    })
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrCenterId: arrCenterId,
                    listRegion: dataRegion ? dataRegion : []
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
        let { arrCenterId, dataDetailSpecialty, listRegion } = this.state;
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
                            {listRegion && listRegion.length > 0 &&
                                listRegion.map((item, index) => {
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
