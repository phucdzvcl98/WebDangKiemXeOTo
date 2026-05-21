
import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailArena.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import CenterExtraInfor from '../Center/CenterExtraInfor';
import CenterSchedule from '../Center/CenterSchedule';
import ProfileCenter from '../Center/ProfileCenter';
import { getAllDetailArenaById, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailArena extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrCenterId: [],
            dataDetailArena: {},
        }
    }

    async componentDidMount() {
        if (this.props && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailArenaById({
                id: id,
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrCenterId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.centerArena;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrCenterId.push(item.centerId)
                        })
                    }
                }

                this.setState({
                    dataDetailArena: res.data,
                    arrCenterId: arrCenterId,

                })
            }
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    render() {
        let { arrCenterId, dataDetailArena } = this.state;

        console.log('phuccheck state:', this.state)
        let { language } = this.props;
        return (
            <div className='detail-arena-container'>
                <HomeHeader />
                <div className='detail-arena-body'>
                    <div className='description-arena'>
                        {dataDetailArena && !_.isEmpty(dataDetailArena)
                            &&
                            <>
                                <div>{dataDetailArena.name}</div>
                                <div dangerouslySetInnerHTML={{ __html: dataDetailArena.descriptionHTML }}>

                                </div>
                            </>
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailArena);
