import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageOwn.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllOwnForCenter, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManageOwn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataOwn: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.getDataOwn()
    }

    getDataOwn = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllOwnForCenter({
            centerId: user.id,
            date: formatedDate
        })
        console.log('CHECK RES:', res);
        if (res && res.errCode === 0) {
            this.setState({
                dataOwn: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataOwn()

        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            centerId: item.centerId,
            ownId: item.ownId,
            email: item.ownData.email,
            timeType: item.timeType,
            ownName: item.ownData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })

        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            centerId: dataModal.centerId,
            ownId: dataModal.ownId,
            timeType: dataModal.timeType,
            language: this.props.language,
            ownName: dataModal.ownName,
        });

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Gửi hóa đơn thành công:');
            this.closeRemedyModal();
            await this.getDataOwn();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Có lỗi xảy ra....');
            console.log('error send remedy:', res)
        }
    }

    render() {
        let { dataOwn, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className='manage-own-container'>
                        <div className='m-p-title'>
                            Quản lý khách đặt lịch
                        </div>
                        <div className='manage-own-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày đăng kiểm</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-own'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataOwn && dataOwn.length > 0 ?
                                            dataOwn.map((item, index) => {
                                                let time = language === LANGUAGES.VI ?
                                                    item.timeTypeDataOwn.valueVi : item.timeTypeDataOwn.valueEn;
                                                let gender = language === LANGUAGES.VI ?
                                                    item.ownData.genderData.valueVi : item.ownData.genderData.valueEn;
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.timeTypeDataOwn.valueVi}</td>
                                                        <td>{item.ownData.firstName}</td>
                                                        <td>{item.ownData.address}</td>
                                                        <td>{item.ownData.genderData.valueVi}</td>
                                                        <td>
                                                            <button className='mp-btn-confirm'
                                                                onClick={() => this.handleBtnConfirm(item)}>Xác nhận</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center" }}>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageOwn);
