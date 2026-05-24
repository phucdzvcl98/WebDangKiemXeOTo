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
import Specialty from '../../HomePage/Section/Specialty';
import { getAdminDashboardStats } from '../../../services/userService';


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
            listRegion: [],
            listArena: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedRegion: '',
            selectedArena: '',
            selectedSpecialty: '',

            nameArena: '',
            addressArena: '',
            note: '',
            specialtyId: '',
            stats: {}
        }
    }

    async componentDidMount() {
        console.log('allCenters', this.props.allCenters);
        this.props.fetchALLCenters();
        this.props.getRequiredCenterInfor();
        let resStats = await getAdminDashboardStats();
        if (resStats && resStats.errCode === 0) {
            this.setState({
                stats: resStats.data
            });
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.fullName;
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
            if (type === 'PAYMENT' || type === 'REGION') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }

            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }

            if (type === 'ARENA') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
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
            let { resPayment, resPrice, resRegion, resSpecialty, resArena } = this.props.allRequiredCenterInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectRegion = this.buildDataInputSelect(resRegion, 'REGION');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectArena = this.buildDataInputSelect(resArena, 'ARENA');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listRegion: dataSelectRegion,
                listSpecialty: dataSelectSpecialty,
                listArena: dataSelectArena
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allCenters, 'USERS');
            let { resPayment, resPrice, resRegion } = this.props.allRequiredCenterInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectRegion = this.buildDataInputSelect(resRegion, 'REGION');

            this.setState({
                listCenters: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listRegion: dataSelectRegion,
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
        console.log('selectedArena: ', this.state.selectedArena);
        console.log('listArena: ', this.state.listArena);
        this.props.saveDetailCenter({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            centerId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedRegion: this.state.selectedRegion.value,
            nameArena: this.state.nameArena,
            addressArena: this.state.addressArena,
            note: this.state.note,
            arenaId: this.state.selectedArena && this.state.selectedArena.value ? this.state.selectedArena.value : '',
            specialtyId: this.state.selectedSpecialty.value
        })

    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listRegion, listSpecialty, listArena } = this.state;

        let res = await getDetailInforCenter(selectedOption.value);
        if (res && res.errCode === 0 && res.data.Markdown) {
            let markdown = res.data.Markdown;

            let addressArena = '', nameArena = '', note = '', arenaId = '', selectedArena = '',
                paymentId = '', priceId = '', regionId = '', specialtyId = '',
                selectedPayment = '', selectedPrice = '', selectedRegion = '',
                selectedSpecialty = '';

            if (res.data.Center_Infor) {
                addressArena = res.data.Center_Infor.addressArena;
                nameArena = res.data.Center_Infor.nameArena;
                note = res.data.Center_Infor.note;
                paymentId = res.data.Center_Infor.paymentId;
                priceId = res.data.Center_Infor.priceId;
                regionId = res.data.Center_Infor.regionId;
                specialtyId = res.data.Center_Infor.specialtyId;
                arenaId = res.data.Center_Infor.arenaId;

                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })
                selectedRegion = listRegion.find(item => {
                    return item && item.value === regionId
                })
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })
                selectedArena = listArena.find(item => {
                    return item && item.value === arenaId
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
                selectedRegion: selectedRegion,
                selectedSpecialty: selectedSpecialty,
                selectedArena: selectedArena
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressArena: '',
                nameArena: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedRegion: '',
                selectedSpecialty: '',
                selectedArena: ''
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
                <div className='title'>
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
                        <label><FormattedMessage id='admin.manage-center.region' /></label>
                        <Select
                            value={this.state.selectedRegion}
                            onChange={this.handleChangeSelectCenterInfor}
                            options={this.state.listRegion}
                            placeholder={<FormattedMessage id='admin.manage-center.region' />}
                            name="selectedRegion"
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

                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.specialty' /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id='admin.manage-center.specialty' />}
                            onChange={this.handleChangeSelectCenterInfor}
                            name='selectedSpecialty'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-center.select-arena' /></label>
                        <Select
                            value={this.state.selectedArena}
                            options={this.state.listArena}
                            placeholder={<FormattedMessage id='admin.manage-center.select-arena' />}
                            onChange={this.handleChangeSelectCenterInfor}
                            name='selectedArena'
                        // isDisabled={true}
                        />
                    </div>
                </div>

                <div className='manage-center-editor'>
                    <MdEditor
                        style={{ height: '300px' }}
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
