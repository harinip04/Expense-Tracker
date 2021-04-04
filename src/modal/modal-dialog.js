import React from 'react';
import './modal.css';

class ModalDialog extends React.Component {
    
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }

    modalClose = () => {
        this.props.close()
    }

    render() {
        return this.props.isopen ? (
            <>
                <div className="modal-overlay"></div>
                <div className="modal-container">
                <div className="modal-header">
                    <div className="title">{this.props.title}</div>
                    <div className="close-icon" onClick={this.modalClose}><i className="fa fa-window-close" aria-disabled="true"></i></div>
                </div>
                {this.props.children}
                </div>
           </>
        ) : '';
    }
}

export default ModalDialog;