import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllArena } from '../../../services/userService';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataArenas: []
        }
    }

    async componentDidMount() {
        let res = await getAllArena();
        if (res && res.errCode === 0) {
            this.setState({
                dataArenas: res.data ? res.data : []
            })
        }
    }

    handleViewDetailArena = (arena) => {
        if (this.props.history) {
            this.props.history.push(`/detail-arena/${arena.id}`)
        }
    }
    render() {
        let { dataArenas } = this.state;
        return (
            <div className=" section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className='title-section'><FormattedMessage id="homepage.arena" /></span>
                        <button className="btn-section"><FormattedMessage id="homepage.more-infor" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataArenas && dataArenas.length > 0 &&
                                dataArenas.map((item, index) => {
                                    return (
                                        <div className="section-customize arena-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailArena(item)}
                                        >
                                            <div className="bg-image section-medical-facility"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div className='arena-name'>{item.name}</div>
                                        </div>
                                    )
                                })}

                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
