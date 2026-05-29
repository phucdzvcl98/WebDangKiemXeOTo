import React, { Component } from 'react';
import './AdminDashboard.scss';

class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportType: 'DATE',
            selectedDate: '',
            selectedMonth: '1',
            selectedYear: new Date().getFullYear()
        }
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

                    <div className='col-12 mt-3'>
                        <button className='btn btn-primary'>
                            Thống kê
                        </button>
                    </div>

                </div>

            </div>
        );
    }
}

export default AdminDashboard;