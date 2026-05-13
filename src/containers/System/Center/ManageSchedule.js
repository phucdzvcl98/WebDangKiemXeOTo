import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import DatePicker from '../../../components/Input/DatePicker';
import moment, { lang } from 'moment';
import { range } from 'lodash';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        this.state = {
            // contentMarkdown: '',
            // contentHTML: '',
            selectedCenter: '',
            // description: '',
            listCenters: [],
            // hasOldData: false
            currentDate: currentDate,
            rangeTime: []
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
            this.setState({
                rangeTime: this.props.allSheduleTime
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

    render() {
        console.log('phuc check state', this.state)
        let { rangeTime } = this.state;
        let { language } = this.props;
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
                                value={this.state.currentDate[0]}
                                minDate={new Date()}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button className='btn btn-schedule' key={index}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'><FormattedMessage id='manage-schedule.save' /></button>
                        </div>
                    </div>
                </div>
            </div>
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
