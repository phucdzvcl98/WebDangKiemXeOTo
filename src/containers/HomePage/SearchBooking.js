import React, { Component } from 'react';
import { searchBooking } from '../../services/userService';
import './SearchBooking.scss';
import HomeHeader from '../HomePage/HomeHeader';

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
            <>
                <HomeHeader isShowBanner={false} />
                <div className='search-booking-container'>

                    <div className='title'>
                        Kết quả tìm kiếm
                    </div>

                    <table className='table table-bordered'>

                        <thead>
                            <tr>


                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Biển số</th>
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
                                            <td>
                                                {item.fullName}
                                            </td>
                                            <td>{item.phoneNumber}</td>
                                            <td>{item.plateNumber}</td>
                                            <td>
                                                {item.centerData && item.centerData.fullName}
                                            </td>
                                            <td>
                                                {new Date(
                                                    +item.date
                                                ).toLocaleDateString('vi-VN')}
                                            </td>

                                            <td>
                                                {
                                                    item.statusId === 'S1'
                                                        ? 'Đang xử lý'
                                                        : item.statusId === 'S2'
                                                            ? 'Đã xác nhận'
                                                            : item.statusId === 'S4'
                                                                ? 'Đã hủy'
                                                                : 'Hoàn thành'
                                                }
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
            </>
        )
    }
}

export default SearchBooking;