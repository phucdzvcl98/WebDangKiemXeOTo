import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import UserRedux from './UserRedux';
import * as actions from "../../../store/actions"
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import 'react-markdown-editor-lite/lib/index.css';
import './ManageCenter.scss';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { saveDetailCenterService } from '../../../services/userService';
import { getDetailInforCenter } from "../../../services/userService"


const mdParser = new MarkdownIt();

class ManageCenter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listCenters: [],
            hasOldData: false,

            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectPrice: '',
            selectPayment: '',
            nameArena: '',
            addressArena: '',
            note: ''
        }
    }

    componentDidMount() {
        this.props.fetchALLCenters();
        this.props.getRequiredCenterInfor();
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }

        }
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allCenters !== this.props.allCenters) {
            let dataSelect = this.buildDataInputSelect(this.props.allCenters, 'USERS')
            this.setState({
                listCenters: dataSelect
            })
        }

        if (prevProps.allRequiredCenterInfor !== this.props.allRequiredCenterInfor) {
            let { resPayment, resPrice, resProvince } = this.props.allRequiredCenterInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');

            console.log('phuc:data new:', dataSelectPrice, dataSelectPayment, dataSelectProvince);

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allCenters, 'USERS');
            let { resPayment, resPrice, resProvince } = this.props.allRequiredCenterInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');

            this.setState({
                listCenters: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailCenter({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            centerId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectProvince: this.state.selectProvince.value,
            nameArena: this.state.nameArena,
            addressArena: this.state.addressArena,
            note: this.state.note,
        })

    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listProvince } = this.state;

        let res = await getDetailInforCenter(selectedOption.value);
        if (res && res.errCode === 0 && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let addressArena = '', nameArena = '', note = '',
                paymentId = '', priceId = '', provinceId = '',
                selectedPayment = '', selectedPrice = '', selectProvince = '';

            if (res.data.Center_Infor) {
                addressArena = res.data.Center_Infor.addressArena;
                nameArena = res.data.Center_Infor.nameArena;
                note = res.data.Center_Infor.note;
                paymentId = res.data.Center_Infor.note;
                priceId = res.data.Center_Infor.priceId;
                provinceId = res.data.Center_Infor.provinceId;

                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressArena: addressArena,
                nameArena: nameArena,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectProvince: selectProvince
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressArena: '',
                nameArena: '',
                note: ''
            })
        }
    };

    handleChangeSelectCenterInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-center-container">
                <div className='manage-center-title'>
                    <FormattedMessage id="admin.manage-center.title" />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group '>
                        <label><FormattedMessage id='admin.manage-center.select-center' /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listCenters}
                            placeholder={<FormattedMessage id="admin.manage-center.select-center" />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id='admin.manage-center.intro' /></label>
                        <textarea className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.price' /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectCenterInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id='admin.manage-center.price' />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.payment' /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectCenterInfor}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id='admin.manage-center.payment' />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.province' /></label>
                        <Select
                            value={this.state.selectProvince}
                            onChange={this.handleChangeSelectCenterInfor}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id='admin.manage-center.province' />}
                            name="selectProvince"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.nameArena' /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameArena')}
                            value={this.state.nameArena} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.addressArena' /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressArena')}
                            value={this.state.addressArena} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.note' /></label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note} />
                    </div>
                </div>

                <div className='manage-center-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button onClick={() => this.handleSaveContentMarkdown()}
                    className={hasOldData === true ? 'save-content-center' : 'create-content-center'} >
                    {hasOldData === true ?
                        <span><FormattedMessage id='admin.manage-center.save' /></span>
                        :
                        <span><FormattedMessage id='admin.manage-center.add' /></span>
                    }

                </button>
            </div >
        )
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        allCenters: state.admin.allCenters,
        allRequiredCenterInfor: state.admin.allRequiredCenterInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchALLCenters: () => dispatch(actions.fetchALLCenters()),
        getRequiredCenterInfor: () => dispatch(actions.getRequiredCenterInfor()),
        saveDetailCenter: (data) => dispatch(actions.saveDetailCenter(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCenter);
