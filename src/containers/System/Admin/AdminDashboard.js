import React, { Component } from 'react';
import './AdminDashboard.scss';
import { getReportDashboardService, getAllCenters } from '../../../services/userService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';

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
            totalRegion: 0,
            totalService: 0,
            totalVehicle: 0,
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
                totalRegion: res.data.totalRegion || 0,
                totalService: res.data.totalService || 0,
                totalVehicle: res.data.totalVehicle || 0,
                reportByCenter: res.data.reportByCenter || [],
                bookingByVehicle: res.data.bookingByVehicle || []
            });
        }
    }

    render() {
        const COLORS = [
            '#3498db',
            '#e74c3c',
            '#2ecc71',
            '#f39c12',
            '#9b59b6',
            '#daf012',
            '#34495e'
        ];
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
                            <div className='summary-card center'>
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <h3>{this.state.totalRegion}</h3>
                                    <span>Tổng khu vực</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className='summary-card booking'>
                                <i className="fas fa-tools"></i>
                                <div>
                                    <h3>{this.state.totalService}</h3>
                                    <span>Tổng dịch vụ</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-4'>
                            <div className='summary-card revenue'>
                                <i className="fas fa-car"></i>
                                <div>
                                    <h3>{this.state.totalVehicle}</h3>
                                    <span>Tổng loại xe</span>
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
                                        <td colSpan="6" className='text-center'>
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

                                <YAxis domain={[0, 'dataMax + 100000']} />

                                <Tooltip />

                                <Bar
                                    dataKey="totalRevenue"
                                    fill="#3498db"
                                >
                                    <LabelList
                                        dataKey="totalRevenue"
                                        position="top"
                                        formatter={(value) => Number(value).toLocaleString()}
                                    />
                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>
                    <div className='report-table-card mt-4'>

                        <div className='report-table-header'>
                            <h3>Biểu đồ số lịch hẹn theo trung tâm</h3>
                        </div>

                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={this.state.reportByCenter}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="centerCode"
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />

                                <YAxis domain={[0, 'dataMax + 2']} />

                                <Tooltip />

                                <Bar
                                    dataKey="totalBooking"
                                    fill="#27ae60"
                                >
                                    <LabelList
                                        dataKey="totalBooking"
                                        position="top"
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                    <div className='report-table-card mt-4'>

                        <div className='report-table-header'>
                            <h3>Biểu đồ loại xe</h3>
                        </div>

                        <ResponsiveContainer width="100%" height={500}>

                            <PieChart>

                                <Pie
                                    data={this.state.bookingByVehicle}
                                    dataKey="total"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={180}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {this.state.bookingByVehicle.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div >
        );
    }
}

export default AdminDashboard;