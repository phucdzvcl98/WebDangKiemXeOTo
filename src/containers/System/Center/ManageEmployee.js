import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
    createEmployeeService,
    getEmployeesByCenterService,
    updateEmployeeService,
    deleteEmployeeService
} from '../../../services/userService';

class ManageEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            position: '',
            listEmployees: [],
            action: 'CREATE',
            employeeEditId: ''
        }
    }

    async componentDidMount() {
        await this.getEmployees();
    }

    getEmployees = async () => {
        let res = await getEmployeesByCenterService(this.props.userInfo.id);

        if (res && res.errCode === 0) {
            this.setState({
                listEmployees: res.data
            });
        }
    }

    handleSaveEmployee = async () => {
        let { action } = this.state;

        let data = {
            id: this.state.employeeEditId,
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            position: this.state.position,
            centerId: this.props.userInfo.id
        };

        let res = action === 'CREATE'
            ? await createEmployeeService(data)
            : await updateEmployeeService(data);

        if (res && res.errCode === 0) {
            toast.success(action === 'CREATE' ? 'Thêm thành công!' : 'Sửa thành công!');

            this.setState({
                fullName: '',
                phoneNumber: '',
                position: '',
                action: 'CREATE',
                employeeEditId: ''
            });

            await this.getEmployees();
        }
    }

    handleEditEmployee = (item) => {
        this.setState({
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            position: item.position,
            action: 'EDIT',
            employeeEditId: item.id
        });
    }

    handleDeleteEmployee = async (item) => {
        let res = await deleteEmployeeService(item.id);

        if (res && res.errCode === 0) {
            toast.success('Xóa nhân viên thành công!');
            await this.getEmployees();
        }
    }

    render() {
        return (
            <div className='container'>
                <div className='title'>Quản lý nhân viên đăng kiểm</div>

                <div className='row'>

                    <div className='col-4 form-group'>
                        <label>Tên nhân viên</label>

                        <input
                            className='form-control'
                            value={this.state.fullName}
                            onChange={(e) =>
                                this.setState({
                                    fullName: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label>Số điện thoại</label>

                        <input
                            className='form-control'
                            value={this.state.phoneNumber}
                            onChange={(e) =>
                                this.setState({
                                    phoneNumber: e.target.value
                                })
                            }
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label>Chức vụ</label>

                        <select
                            className='form-control'
                            value={this.state.position}
                            onChange={(e) =>
                                this.setState({
                                    position: e.target.value
                                })
                            }
                        >
                            <option value="">Chọn cấp độ</option>

                            <option value="Kiểm định viên bậc 1">
                                Kiểm định viên bậc 1
                            </option>

                            <option value="Kiểm định viên bậc 2">
                                Kiểm định viên bậc 2
                            </option>

                            <option value="Kiểm định viên bậc 3">
                                Kiểm định viên bậc 3
                            </option>
                        </select>
                    </div>

                    <div className='col-12 mt-3'>
                        <button
                            className={
                                this.state.action === 'CREATE'
                                    ? 'btn btn-primary'
                                    : 'btn btn-warning'
                            }
                            onClick={this.handleSaveEmployee}
                        >
                            {this.state.action === 'CREATE'
                                ? 'Thêm nhân viên'
                                : 'Lưu thay đổi'}
                        </button>
                    </div>

                </div>

                <table className='table table-bordered mt-4'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên nhân viên</th>
                            <th>Số điện thoại</th>
                            <th>Chức vụ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.listEmployees && this.state.listEmployees.length > 0 ?
                            this.state.listEmployees.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.position}</td>
                                    <td>
                                        <button
                                            className='btn btn-warning mx-2'
                                            onClick={() => this.handleEditEmployee(item)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className='btn btn-danger'
                                            onClick={() => this.handleDeleteEmployee(item)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan="5" className='text-center'>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(ManageEmployee);