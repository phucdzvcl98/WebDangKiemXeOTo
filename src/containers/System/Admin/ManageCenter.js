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
            hasOldData: false
        }
    }

    componentDidMount() {
        this.props.fetchALLCenters()
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allCenters !== this.props.allCenters) {
            let dataSelect = this.buildDataInputSelect(this.props.allCenters)
            this.setState({
                listCenters: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allCenters)
            this.setState({
                listCenters: dataSelect
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
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
        })

    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });

        let res = await getDetailInforCenter(selectedOption.value);
        if (res && res.errCode === 0 && res.data.Markdown) {
            let markdown = res.data.Markdown;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false
            })
        }
        console.log(`phuc`, res);
    };

    handleOnChangeDecs = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-center-container">
                <div className='manage-center-title'>
                    tao tao tao
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group '>
                        <label>chon trung tam</label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listCenters}
                        />
                    </div>
                    <div className='content-right'>
                        <label>thong tin gth</label>
                        <textarea className='form-control' rows="4"
                            onChange={(event) => this.handleOnChangeDecs(event)}
                            value={this.state.description}
                        >
                            aaaaaa
                        </textarea>
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
                        <span>Lưu Thông tin</span> : <span>Tạo Thông Tin</span>}

                </button>
            </div >
        )
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        allCenters: state.admin.allCenters,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchALLCenters: () => dispatch(actions.fetchALLCenters()),
        saveDetailCenter: (data) => dispatch(actions.saveDetailCenter(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCenter);
