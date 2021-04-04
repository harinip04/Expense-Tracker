import React from 'react';

import './dashboard.css';
import expenseData from '../database';

class Dashboard extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            data: [],
            filterData: null,
            filter: '',
            apply_filter: false,
            netTotal: 0,
            from: '',
            to: ''
        };
    }

    componentDidMount() {
        this.getExpenseData();
    }

    getExpenseData = async () => {
        let expenses = await localStorage.getItem('expense_data');
        if (!expenses) {
            localStorage.setItem('expense_data', JSON.stringify(expenseData));
            this.setState(oldState => ({ ...oldState, data: expenseData}));
            console.log('setter');
        } else {
            this.setState(oldState => ({ ...oldState, data: JSON.parse(localStorage.getItem('expense_data'))}));
            console.log('getter');
        }
        let total = 0;
        for (let i = 0; i< this.state.data.length; i++) {
            total += +this.state.data[i].cost;
        }
        this.setState(oldState => ({ ...oldState, netTotal: total}));
       
    }

    handleFilterChange = (event) => {
        this.setState(oldState => ({ ...oldState, apply_filter: false, filter: event.target.value}));
    }

    resetFilter = () => {
        this.setState(oldState => ({ ...oldState, filter: '', apply_filter: false, filterData: null, from: null, to: null}));
    }

    applyFilter = () => {
        this.setState(oldState => ({ ...oldState, apply_filter: true, filterData: null}));
        let result = {};
        let total = 0;
        if (this.state.filter === 'current_week' || this.state.filter === 'custom') {
            let curr = new Date();
            let firstday, lastday;
            if (this.state.filter === 'current_week') {
               firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
               lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
            } else  {
               firstday = new Date(this.state.from);
               lastday = new Date(this.state.to);
            }
            for (let i = 0; i < this.state.data.length ; i++ ) {
                if (new Date(this.state.data[i]['date']) >= firstday && new Date(this.state.data[i]['date']) <= lastday) {
                    if (!result[this.state.data[i]['category']]) {
                        result[this.state.data[i]['category']] = {cost : 0};
                    }
                    result[this.state.data[i]['category']]['cost'] += +this.state.data[i]['cost'];
                    total += +this.state.data[i]['cost'];
                }
            }
        } else if (this.state.filter === 'current_month') {
            let thisMonth = (new Date()).getMonth();
            let thisYear = (new Date()).getFullYear();
            for (let i = 0; i < this.state.data.length ; i++ ) {
                if (new Date(this.state.data[i]['date']).getMonth() === thisMonth && new Date(this.state.data[i]['date']).getFullYear() === thisYear) {
                    if (!result[this.state.data[i]['category']]) {
                        result[this.state.data[i]['category']] = {cost : 0};
                    }
                    result[this.state.data[i]['category']]['cost'] += +this.state.data[i]['cost'];
                    total += +this.state.data[i]['cost'];
                }
            }
        } else if (this.state.filter === 'current_year') {
            let thisYear = (new Date()).getFullYear();
            for (let i = 0; i < this.state.data.length ; i++ ) {
                if (new Date(this.state.data[i]['date']).getFullYear() === thisYear) {
                    if (!result[this.state.data[i]['category']]) {
                        result[this.state.data[i]['category']] = {cost : 0};
                    }
                    result[this.state.data[i]['category']]['cost'] += +this.state.data[i]['cost'];
                    total += +this.state.data[i]['cost'];
                }
            }
        }

        result['total'] = {};
        result['total']['cost'] = total;
        this.setState(oldState => ({ ...oldState, apply_filter: true, filterData: result}));
    }

    setFromDate = (e) => {
        this.setState(oldState => ({ ...oldState, apply_filter: false, from: e.target.value}));
    }

    setToDate = (e) => {
        this.setState(oldState => ({ ...oldState, apply_filter: false, to: e.target.value}));
    }

    render() {
        return(
            <div className="dashboard-container">
                <div className="dash-header">
                    <h3>Dashboard</h3>
                </div>
                <div className="dash-content">
                    <div className="net-total-expense">
                        Net Total Expense: <span>₹ {this.state.netTotal}</span>
                    </div>
                    <div className="filter-card">
                        <div className="inputs">
                            <select value={this.state.filter} onChange={this.handleFilterChange}>
                                <option>Select Filter</option>
                                <option value="current_week">
                                    Current Week
                                </option>
                                <option value="current_month">
                                    Current Month
                                </option>
                                <option value="current_year">
                                    Current Year
                                </option>
                                <option value="custom">
                                    Custom
                                </option>
                            </select>
                            {
                                this.state.filter === 'custom' &&
                                <div className="custom-dates">
                                    <div className="date-div"><div>From</div>
                                    <input type="date" value={this.state.from} onChange={this.setFromDate}></input></div>
                                    <div className="date-div"><div>To</div>
                                    <input type="date" value={this.state.to} onChange={this.setToDate}></input></div>
                                </div>
                            }
                        </div>
                        <div className="filter-btn">
                            {this.state.apply_filter && 
                                <button className="reset-btn" onClick={this.resetFilter}>Reset</button>
                            }
                            {!this.state.apply_filter && 
                                <button className="apply-btn" onClick={this.applyFilter}>Apply filter</button>
                            }
                        </div>
                    </div>
                    { this.state.filterData &&
                        <div className="dashboard-list expense-lists">
                            {
                                this.state.filterData &&
                                Object.keys(this.state.filterData).map(data => {
                                    return data !== 'total' ? (    <div className="expense-list" key={data}>
                                                    <div className="category">{data}</div>
                                                    <div className="cost"> ₹ {this.state.filterData[data]['cost']}</div>
                                                </div>
                                            ) : ''
                                })
                            }
                            {
                                Object.keys(this.state.filterData).length <= 1 && 
                                <div className="no-data">No data</div>
                            }
                        </div>
                    }
                    { this.state.filterData && this.state.filterData['total'] &&
                        <div className="dashboard-list total-expenses">
                            <div className="category">TOTAL</div>
                            <div className="cost"> ₹ {this.state.filterData['total']['cost']}</div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Dashboard;