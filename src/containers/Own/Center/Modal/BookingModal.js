import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileCenter from '../ProfileCenter';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postOwnBookAppointment } from '../../../../services/userService';
import { toast } from "react-toastify";
import { selectFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            centerId: '',
            timeType: '',
            genders: '',
            plateNumber: '',
        }
    }

    async componentDidMount() {
        this.props.getGenders();

    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let centerId = this.props.dataTime.centerId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    centerId: centerId,
                    timeType: timeType
                })
            }
        }
    }


    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleOnchangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');

            return `${time} - ${date}`
        }
        return ''
    }

    buildCenterName = (dataTime) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            return dataTime.centerData.fullName;
        }
        return '';
    }

    handleConfirmBooking = async () => {


        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let centerName = this.buildCenterName(this.props.dataTime);

        let res = await postOwnBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            centerId: this.state.centerId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            centerName: centerName,
            plateNumber: this.state.plateNumber

        })
        if (res && res.errCode === 0) {
            toast.success('Đặt lịch thành công!')
            this.props.closeBookingClose();

        } else if (res && res.errCode === 2) {
            toast.error('Khung giờ này đã đủ 2 xe!')

        } else {
            toast.error('Đặt lịch thất bại!')
        }

        // if (res && res.errCode === 0) {
        //     toast.success('Booking a new appointment succeed!')
        //     this.props.closeBookingClose();
        // } else {
        //     toast.error('Booking a new appointment error!')
        // }
    }

    render() {
        //toggle={}
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        let centerId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            centerId = dataTime.centerId
        }

        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="lg"
                centered
            //backdrop={true}
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id='own.booking-modal.title' />
                        </span>
                        <span
                            className='right'
                            onClick={closeBookingClose}
                        ><i className='fas fa-times'></i></span>
                    </div>
                    <div className='booking-modal-body'>
                        { }
                        <div className='center-infor'>
                            <ProfileCenter
                                centerId={centerId}
                                isShowDescriptionCenter={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className='price'>

                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='own.booking-modal.fullName' />
                                </label>
                                <input className='form-control'
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnchangeInput(event, 'fullName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='own.booking-modal.phoneNumber' />
                                </label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='own.booking-modal.email' />
                                </label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='own.booking-modal.address' /></label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='own.booking-modal.plateNumber' /></label>
                                <input className='form-control'
                                    value={this.state.plateNumber}
                                    onChange={(event) => this.handleOnchangeInput(event, 'plateNumber')}
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label>
                                    <FormattedMessage id='own.booking-modal.reason' />
                                </label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='own.booking-modal.birthday' /></label>
                                <DatePicker
                                    value={this.state.birthday}
                                    className='form-group'
                                    onChange={this.handleOnchangeDatePicker}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='own.booking-modal.gender' /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm'
                            onClick={() => this.handleConfirmBooking()}
                        ><FormattedMessage id='own.booking-modal.btnConfirm' /></button>
                        <button className='btn-booking-cancel'
                            onClick={closeBookingClose}
                        ><FormattedMessage id='own.booking-modal.btnCancel' /></button>
                    </div>
                </div>

            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
