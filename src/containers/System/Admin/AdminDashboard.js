import React, { Component } from 'react';
import { getAdminDashboardStats } from '../../../services/userService';
import './AdminDashboard.scss';

class AdminDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: {},
            bookingByStatus: [],
            bookingByDate: []
        }
    }

    async componentDidMount() {
        let res = await getAdminDashboardStats();

        if (res && res.errCode === 0) {
            this.setState({
                stats: res.data,
                bookingByStatus: res.data.bookingByStatus || [],
                bookingByDate: res.data.bookingByDate || []
            });
        }
    }

    render() {

        let { stats } = this.state;

        return (
            <div className='admin-dashboard-container'>

                <div className='dashboard-header'>
                    <div className='title'>Dashboard hệ thống</div>
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

                <div className="dashboard-tables row">
                    <div className="col-6">
                        <div className="stat-table">
                            <h3>Thống kê theo trạng thái</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Trạng thái</th>
                                        <th>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bookingByStatus.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.statusId}</td>
                                            <td>{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="stat-table">
                            <h3>Thống kê theo ngày</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Ngày</th>
                                        <th>Số lượt đặt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bookingByDate.map((item, index) => (
                                        <tr key={index}>
                                            <td>{new Date(+item.date).toLocaleDateString('vi-VN')}</td>
                                            <td>{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;