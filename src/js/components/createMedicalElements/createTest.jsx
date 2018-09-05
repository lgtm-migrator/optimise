import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/utils';
import { createTestAPICall } from '../../redux/actions/tests';
import style from './medicalEvent.module.css';

//not yet finished the dispatch
@connect(state => ({ patientId: state.patientProfile.data.id, visits: state.patientProfile.data.visits, types: state.availableFields.testTypes }), dispatch => ({ createTest: body => dispatch(createTestAPICall(body)) }))
export class CreateTest extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment(),
            actualOccurredDate: moment(),
            testType: 'unselected'
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleActualDateChange = this._handleActualDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: undefined
        });
    }

    _handleActualDateChange(date) {
        this.setState({
            actualOccurredDate: date,
            error: undefined
        });
    }

    _handleTypeChange(ev) {
        this.setState({
            testType: ev.target.value,
            error: undefined
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate;
        const actualOccurredDate = this.state.actualOccurredDate;
        return {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.patientId,
                expectedOccurDate: date.toISOString(),
                actualOccurredDate: actualOccurredDate ? actualOccurredDate.toISOString() : null,
                type: Number.parseInt(this.state.testType)
            }
        };
    }

    _handleSubmitClick(e) {
        e.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.state.startDate || !this.state.startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the date on which the test was done'
            });
        }
        // if (!this.state.actualOccurredDate || !this.state.actualOccurredDate.isValid()) {
        //     return this.setState({
        //         error: 'Please indicate the date on which the test results were processed'
        //     });
        // }
        if (this.state.testType === 'unselected') {
            this.setState({
                error: 'Please indicate the test type'
            });
            return;
        }
        const requestBody = this._formatRequestBody();
        requestBody.to = `/patientProfile/${this.props.match.params.patientId}`;

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: undefined
        }, () => {
            this.props.createTest(requestBody);
        });
    }

    render() {
        if (this.props.visits) {
            const params = this.props.match.params;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Creating a new Test</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        <label>Date on which the test was done: </label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br />
                        {/* <label>Date on which test results were processed: </label><br /><PickDate startDate={this.state.actualOccurredDate} handleChange={this._handleActualDateChange} /><br /> */}
                        <label htmlFor='test'>What type of test was it?</label><br />
                        <select name='test' value={this.state.testType} onChange={this._handleTypeChange} autoComplete='off'>
                            <option value='unselected'></option>
                            {this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select><br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                        <button onClick={this._handleSubmitClick}>Submit</button>
                    </form>
                </>
            );
        } else {
            return null;
        }
    }
}