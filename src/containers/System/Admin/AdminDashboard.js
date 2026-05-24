import React, { Component } from 'react';
import { getAdminDashboardStats } from '../../../services/userService';
import './AdminDashboard.scss';

class AdminDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: {}
        }
    }

    async componentDidMount() {
        let res = await getAdminDashboardStats();

        if (res && res.errCode === 0) {
            this.setState({
                stats: res.data
            })
        }
    }

    render() {

        let { stats } = this.state;

        return (
            <div className='admin-dashboard-container'>

                <div className='dashboard-header'>
                    <h2>Dashboard hệ thống</h2>
                    <p>Quản lý và thống kê website đăng kiểm xe ô tô</p>
                </div>

                <div className='dashboard-content row'>

                    <div className='col-3'>
                        <div className='dashboard-card center'>
                            <i className="fas fa-building"></i>
                            <h3>{stats.totalCenters || 0}</h3>
                            <span>Trung tâm đăng kiểm</span>
                        </div>
                    </div>

                    <div className='col-3'>
                        <div className='dashboard-card arena'>
                            <i className="fas fa-map-marker-alt"></i>
                            <h3>{stats.totalArena || 0}</h3>
                            <span>Khu vực đăng kiểm</span>
                        </div>
                    </div>

                    <div className='col-3'>
                        <div className='dashboard-card specialty'>
                            <i className="fas fa-tools"></i>
                            <h3>{stats.totalSpecialty || 0}</h3>
                            <span>Dịch vụ đăng kiểm</span>
                        </div>
                    </div>

                    <div className='col-3'>
                        <div className='dashboard-card booking'>
                            <i className="fas fa-calendar-check"></i>
                            <h3>{stats.totalBooking || 0}</h3>
                            <span>Lượt đặt lịch</span>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default AdminDashboard;