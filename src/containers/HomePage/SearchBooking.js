import React, { Component } from 'react';
import { searchBooking } from '../../services/userService';
import './SearchBooking.scss';

class SearchBooking extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSearch: []
        }
    }

    async componentDidMount() {

        let keyword = new URLSearchParams(
            this.props.location.search
        ).get('keyword');

        let res = await searchBooking(keyword);

        if (res && res.errCode === 0) {
            this.setState({
                dataSearch: res.data
            })
        }
    }

    render() {

        let { dataSearch } = this.state;

        return (
            <div className='search-booking-container'>

                <div className='title'>
                    Kết quả tìm kiếm
                </div>

                <table className='table table-bordered'>

                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Biển số</th>
                            <th>Họ tên</th>
                            <th>Trung tâm</th>
                            <th>Ngày đăng kiểm</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody>

                        {dataSearch && dataSearch.length > 0 ?

                            dataSearch.map((item, index) => {

                                return (
                                    <tr key={index}>

                                        <td>{index + 1}</td>

                                        <td>{item.plateNumber}</td>

                                        <td>
                                            {item.ownData.firstName}
                                        </td>


                                        <td>
                                            {item.centerData.firstName}
                                        </td>

                                        <td>
                                            {new Date(
                                                +item.date
                                            ).toLocaleDateString('vi-VN')}
                                        </td>

                                        <td>
                                            {item.statusId === 'S1'
                                                ? 'Chờ xác nhận'
                                                : 'Đã xác nhận'}
                                        </td>

                                    </tr>
                                )
                            })

                            :

                            <tr>
                                <td
                                    colSpan="7"
                                    style={{
                                        textAlign: 'center'
                                    }}
                                >
                                    Không tìm thấy dữ liệu
                                </td>
                            </tr>
                        }

                    </tbody>

                </table>

            </div>
        )
    }
}

export default SearchBooking;