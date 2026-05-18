import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from '../../../components/Input/DatePicker';
import moment, { lang } from 'moment';
import { range } from 'lodash';
import { toast } from "react-toastify";
import _ from 'lodash';
import { saveBulkScheduleCenter } from '../../../services/userService'

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        this.state = {
            // contentMarkdown: '',
            // contentHTML: '',
            selectedCenter: {},
            // description: '',
            listCenters: [],
            // hasOldData: false
            currentDate: '',
            rangeTime: [],
        }
    }

    componentDidMount() {
        this.props.fetchALLCenters()
        this.props.fetchALLSheduleTime()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allCenters !== this.props.allCenters) {
            let dataSelect = this.buildDataInputSelect(this.props.allCenters)
            this.setState({
                listCenters: dataSelect
            })
        }
        if (prevProps.allSheduleTime !== this.props.allSheduleTime) {
            let data = this.props.allSheduleTime;
            if (data && data.length > 0) {
                // data.map(item => {
                //     item.isSelected = false;
                //     return item;
                // })
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedCenter) => {
        this.setState({ selectedCenter });

        // let res = await getDetailInforCenter(selectedOption.value);
        // if (res && res.errCode === 0 && res.data.Markdown) {
        //     let markdown = res.data.Markdown;
        //     this.setState({
        //         contentHTML: markdown.contentHTML,
        //         contentMarkdown: markdown.contentMarkdown,
        //         description: markdown.description,
        //         hasOldData: true
        //     })
        // } else {
        //     this.setState({
        //         contentHTML: '',
        //         contentMarkdown: '',
        //         description: '',
        //         hasOldData: false
        //     })
        // }
        // console.log(`phuc`, res);
    };

    handleChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            let { rangeTime } = this.state;
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedCenter, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error("Invalid date!");
            return;
        }
        if (selectedCenter && _.isEmpty(selectedCenter)) {
            toast.error("Invalid seleted center!");
            return;
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        //  = moment(currentDate).unix();
        let formatedDate = new Date(currentDate).getTime();


        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.centerId = selectedCenter.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object)
                })
            } else {
                toast.error("Invalid seleted time!");
                return;
            }
        }
        let res = await saveBulkScheduleCenter({
            arrSchedule: result,
            centerId: selectedCenter.value,
            formatedDate: formatedDate,
        })
        if (res && res.errCode === 0) {
            toast.success("Save Infor succeed!");
        } else {
            toast.error("error saveBulkScheduleCenter");
            console.log('error saveBulkScheduleCenter>>>res:', res)
        }

    }
    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group' >
                            <label><FormattedMessage id='manage-schedule.choose-center' /></label>
                            <Select
                                value={this.state.selectedCenter}
                                onChange={this.handleChangeSelect}
                                options={this.state.listCenters}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                            <DatePicker
                                onChange={this.handleChangeDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={item.isSelected === true
                                                ? 'btn btn-schedule active' : 'btn btn-schedule'}

                                            key={index}
                                            onClick={() => this.handClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button onClick={() => this.handleSaveSchedule()} className='btn btn-primary btn-save-schedule'>
                                <FormattedMessage id='manage-schedule.save' />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allCenters: state.admin.allCenters,
        allSheduleTime: state.admin.allSheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchALLCenters: () => dispatch(actions.fetchALLCenters()),
        fetchALLSheduleTime: () => dispatch(actions.fetchALLSheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
