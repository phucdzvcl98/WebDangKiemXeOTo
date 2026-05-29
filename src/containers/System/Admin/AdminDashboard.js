import React, { Component } from 'react';
import './AdminDashboard.scss';
import { getReportDashboardService, getAllCenters } from '../../../services/userService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportType: 'DATE',
            selectedDate: '',
            selectedMonth: '1',
            selectedYear: new Date().getFullYear(),
            totalBooking: 0,
            bookingByVehicle: [],
            bookingByCenter: [],
            reportByCenter: [],
            totalCenter: 0,
            totalRevenue: 0,
            selectedCenter: 'ALL',
            listCenters: [],
        }
    }

    async componentDidMount() {

        let centers = await getAllCenters();

        if (centers && centers.errCode === 0) {
            this.setState({
                listCenters: centers.data
            });
        }

        await this.getReportDashboard();
    }

    handleChangeReportType = (event) => {
        this.setState({ reportType: event.target.value });
    }

    handleChangeDate = (event) => {
        this.setState({ selectedDate: event.target.value });
    }

    handleChangeMonth = (event) => {
        this.setState({ selectedMonth: event.target.value });
    }

    handleChangeYear = (event) => {
        this.setState({ selectedYear: event.target.value });
    }
    getReportDashboard = async () => {
        let res = await getReportDashboardService({
            reportType: this.state.reportType,
            selectedDate: this.state.selectedDate,
            selectedMonth: this.state.selectedMonth,
            selectedYear: this.state.selectedYear,
            selectedCenter: this.state.selectedCenter,
        });

        if (res && res.errCode === 0) {
            this.setState({
                totalBooking: res.data.totalBooking || 0,
                totalCenter: res.data.totalCenter || 0,
                totalRevenue: res.data.totalRevenue || 0,
                reportByCenter: res.data.reportByCenter || []
            });
        }
    }

    render() {
        return (
            <div className='admin-dashboard-container'>

                <div className='dashboard-header'>
                    <div className='title'>Thống kê hệ thống đăng kiểm</div>
                </div>

                <div className='dashboard-filter row'>

                    <div className='col-4 form-group'>
                        <label>Kiểu thống kê</label>
                        <select
                            className='form-control'
                            value={this.state.reportType}
                            onChange={this.handleChangeReportType}
                        >
                            <option value='DATE'>Thống kê theo ngày</option>
                            <option value='MONTH'>Thống kê theo tháng</option>
                            <option value='YEAR'>Thống kê theo năm</option>
                        </select>
                    </div>

                    {this.state.reportType === 'DATE' &&
                        <div className='col-4 form-group'>
                            <label>Chọn ngày</label>
                            <input
                                type='date'
                                className='form-control'
                                value={this.state.selectedDate}
                                onChange={this.handleChangeDate}
                            />
                        </div>
                    }

                    {this.state.reportType === 'MONTH' &&
                        <>
                            <div className='col-4 form-group'>
                                <label>Chọn tháng</label>
                                <select
                                    className='form-control'
                                    value={this.state.selectedMonth}
                                    onChange={this.handleChangeMonth}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                        <option key={month} value={month}>Tháng {month}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='col-4 form-group'>
                                <label>Chọn năm</label>
                                <select
                                    className='form-control'
                                    value={this.state.selectedYear}
                                    onChange={this.handleChangeYear}
                                >
                                    {[2024, 2025, 2026, 2027].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    }

                    {this.state.reportType === 'YEAR' &&
                        <div className='col-4 form-group'>
                            <label>Chọn năm</label>
                            <select
                                className='form-control'
                                value={this.state.selectedYear}
                                onChange={this.handleChangeYear}
                            >
                                {[2024, 2025, 2026, 2027].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    }
                    <div className='col-4 form-group'>
                        <label>Trung tâm</label>

                        <select
                            className='form-control'
                            value={this.state.selectedCenter}
                            onChange={(e) =>
                                this.setState({
                                    selectedCenter: e.target.value
                                })
                            }
                        >
                            <option value='ALL'>
                                Tất cả trung tâm
                            </option>

                            {this.state.listCenters.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='col-12 mt-3'>
                        <button
                            className='btn btn-primary'
                            onClick={this.getReportDashboard}
                        >
                            Thống kê
                        </button>
                    </div>
                    <div className='dashboard-summary row'>

                        <div className='col-4'>
                            <div className='summary-card center'>
                                <i className="fas fa-building"></i>
                                <div>
                                    <h3>{this.state.totalCenter}</h3>
                                    <span>Tổng trung tâm</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className='summary-card booking'>
                                <i className="fas fa-calendar-check"></i>
                                <div>
                                    <h3>{this.state.totalBooking}</h3>
                                    <span>Tổng lịch hẹn</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className='summary-card revenue'>
                                <i className="fas fa-money-bill-wave"></i>
                                <div>
                                    <h3>{Number(this.state.totalRevenue || 0).toLocaleString()} VNĐ</h3>
                                    <span>Tổng chi phí</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='report-table-card'>

                        <div className='report-table-header'>
                            <h3>Bảng chi tiết thống kê theo trung tâm</h3>
                        </div>

                        <table className='report-table'>

                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Trung tâm</th>
                                    <th>Khu vực</th>
                                    <th>Dịch vụ</th>
                                    <th>Loại xe</th>
                                    <th>Số lịch</th>
                                    <th>Tổng chi phí</th>
                                </tr>
                            </thead>

                            <tbody>

                                {this.state.reportByCenter &&
                                    this.state.reportByCenter.length > 0 ?

                                    this.state.reportByCenter.map((item, index) => (

                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.centerName}</td>
                                            <td>{item.region}</td>
                                            <td>{item.service}</td>
                                            <td>{item.vehicleType}</td>
                                            <td>{item.totalBooking}</td>
                                            <td>
                                                {Number(item.totalRevenue || 0)
                                                    .toLocaleString()} VNĐ
                                            </td>
                                        </tr>

                                    ))

                                    :

                                    <tr>
                                        <td colSpan="7" className='text-center'>
                                            Chưa có dữ liệu
                                        </td>
                                    </tr>

                                }

                            </tbody>

                        </table>

                    </div>
                    <div className='report-table-card mt-4'>

                        <div className='report-table-header'>
                            <h3>Biểu đồ doanh thu theo trung tâm</h3>
                        </div>
                        {console.log('reportByCenter:', this.state.reportByCenter)}
                        <ResponsiveContainer
                            width="100%"
                            height={500}
                        >
                            <BarChart
                                data={this.state.reportByCenter}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="centerCode"
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="totalRevenue"
                                    fill="#3498db"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                    <div className='col-12 mt-3'>
                        <pre>
                            {JSON.stringify(this.state, null, 2)}
                        </pre>
                    </div>

                </div>

            </div >
        );
    }
}

export default AdminDashboard;