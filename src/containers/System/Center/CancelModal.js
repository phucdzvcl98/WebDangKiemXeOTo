import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss';
import { Modal, Button, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from "react-toastify";

class CancelModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reason: ''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isOpenModal !== this.props.isOpenModal) {
            this.setState({
                reason: ''
            })
        }
    }

    handleOnchangeReason = (event) => {
        this.setState({
            reason: event.target.value
        })
    }

    handleSendCancel = () => {
        if (!this.state.reason) {
            toast.error("Vui lòng nhập lý do hủy!");
            return;
        }

        this.props.sendCancel(this.state);
    }

    render() {
        let { isOpenModal, closeCancelModal } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="md"
                centered
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>Nhập lý do hủy lịch</h5>
                    <button type='button' className='close' aria-label='Close' onClick={closeCancelModal}>
                        <span aria-hidden='true'>x</span>
                    </button>
                </div>

                <ModalBody>
                    <div className='row'>
                        <div className='col-12 form-group'>
                            <label>Lý do hủy</label>
                            <textarea
                                className='form-control'
                                rows='4'
                                value={this.state.reason}
                                onChange={(event) => this.handleOnchangeReason(event)}
                                placeholder='Nhập lý do hủy lịch...'
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color='danger' onClick={() => this.handleSendCancel()}>
                        Gửi hủy lịch
                    </Button>{' '}
                    <Button color='secondary' onClick={closeCancelModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default connect()(CancelModal);