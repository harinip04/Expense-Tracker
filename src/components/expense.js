import React from 'react';

import expenseData from '../database';
import './expense.css';
import ModalDialog from '../modal/modal-dialog';

class Expense extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            openModal: false,
            category: '',
            cost:'',
            id: null,
            is_edit: false
        }
    }

    componentDidMount() {
        this.getExpenseData();
    }

    getExpenseData = () => {
        let expenses = localStorage.getItem('expense_data');
        if (!expenses) {
            localStorage.setItem('expense_data', JSON.stringify(expenseData));
            this.setState(oldState => ({ ...oldState, data: expenseData}));
            console.log('setter');
        } else {
            this.setState(oldState => ({ ...oldState, data: JSON.parse(localStorage.getItem('expense_data'))}));
            console.log('getter');
        }
    }

    modalClose = (event) => {
        this.setState(oldState => ({ ...oldState, id: null, category: '', cost: '',openModal: false, is_edit: false}));
    }

    openAddExpenseModal = (event) => {
        this.setState(oldState => ({ ...oldState, category: '', cost: '', is_edit: false, openModal: true}));
    }

    editExpense = (event, index) => {
        this.setState(oldState => ({ ...oldState, id: index, category: event.category, cost: event.cost, is_edit: true, openModal: true}));
    }

    addNewExp = (event) => {
        let arr = this.state.data.slice();
        arr.push(event);
        this.setState(oldState => ({ ...oldState, data: arr}));
        localStorage.setItem('expense_data', JSON.stringify(arr));
        this.modalClose();
    }

    updateExp = (event) => {
        let arr = this.state.data.slice();
        arr[event.id]['category'] = event.category;
        arr[event.id]['cost'] = event.cost;
        this.setState(oldState => ({ ...oldState, data: arr}));
        localStorage.setItem('expense_data', JSON.stringify(arr));
        this.modalClose();
    }

    deleteExpense = (index) => {
        let arr = this.state.data.slice();
        arr.splice(index, 1);
        this.setState(oldState => ({ ...oldState, data: arr}));
        localStorage.setItem('expense_data', JSON.stringify(arr));
    }

    render() {
        return (
            <div className="expense-container">
                <div className="expense-header">
                    <h5>Expense Management</h5>
                </div>
                <div className="expense-body">
                    <div className="add-expense">
                        <button className="add-btn" onClick={this.openAddExpenseModal}>Add Expense</button>
                    </div>
                    <div className="expfile expense-lists width-55per">
                        {
                            this.state.data &&
                            this.state.data.map((data, index) => {
                                return (<div className="expense-list" key={index}>
                                                <div className="category">{data.category}</div>
                                                <div className="cost"> ₹ {data.cost}</div>
                                                <div className="actions"> 
                                                    <button onClick={() => this.editExpense(data, index)}>Edit</button>
                                                    <i className="fa fa-window-close" aria-disabled="true" 
                                                       title="Delete"  onClick={() => this.deleteExpense(index)}></i>
                                                </div>
                                            </div>
                                        )
                            })
                        }
                        {
                            this.state.data <= 0 && 
                            <div className="no-data">No data</div>
                        }
                    </div>
                </div>
                <ModalDialog isopen={this.state.openModal} title="Add Expense" close={this.modalClose}>
                    <div className="add-expense-form">
                        <div className="form-group">
                            <div className="form-control">
                                <label>Category</label>
                                <input type="text" value={this.state.category} onChange={e => this.setState(oldState => ({...oldState, category: e.target.value}))} />
                            </div>
                            <div className="form-control">
                                <label>Amount</label>
                                <input type="number" min="0" value={this.state.cost} onChange={e => this.setState(oldState => ({...oldState, cost: e.target.value}))} />
                            </div>
                        </div>
                        <div className="submit-btn">
                            { !this.state.is_edit  && 
                                <button onClick={() => {this.addNewExp({category: this.state.category, cost: this.state.cost, date: new Date().toString()})}}>
                                    Add Expense
                                </button>
                            }
                            { this.state.is_edit  && 
                                <button onClick={() => {this.updateExp({id: this.state.id, category: this.state.category, cost: this.state.cost})}}>
                                    Update Expense
                                </button>
                            }
                        </div>
                    </div>
                </ModalDialog>
            </div>
                )
    }
}

export default Expense;