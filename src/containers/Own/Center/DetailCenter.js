import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailCenter.scss';
import { getDetailInforCenter } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';

class DetailCenter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailCenter: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailInforCenter(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailCenter: res.data
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { language } = this.props;

        let { detailCenter } = this.state;
        let nameVi = '', nameEn = '';
        if (detailCenter && detailCenter.positionData) {
            nameVi = `${detailCenter.positionData.valueVi}, ${detailCenter.lastName} ${detailCenter.firstName}`;
            nameEn = `${detailCenter.positionData.valueEn}, ${detailCenter.firstName} ${detailCenter.lastName}`;
        }

        return (
            <div>
                <HomeHeader isShowBanner={false} />
                <div className="center-detail-container">
                    <div className="intro-center">
                        <div className='content-left'
                            style={{ backgroundImage: `url(${detailCenter && detailCenter.image ? detailCenter.image : ''})` }}>

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailCenter && detailCenter.Markdown
                                    && detailCenter.Markdown.description
                                    && <span>
                                        {detailCenter.Markdown.description}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-center'>

                    </div>
                    <div className='detail-infor-center'>
                        {detailCenter && detailCenter.Markdown && detailCenter.Markdown.contentHTML
                            &&
                            <div dangerouslySetInnerHTML={{ __html: detailCenter.Markdown.contentHTML }}>
                            </div>
                        }
                    </div>
                    <div className='comment-center'>

                    </div>
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DetailCenter)
);
