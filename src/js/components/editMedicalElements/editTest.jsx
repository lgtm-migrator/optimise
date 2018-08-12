import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { BackButton } from '../medicalData/utils';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteTestAPICall, updateTestCall } from '../../redux/actions/tests';

@connect(state => ({ tests: state.patientProfile.data.tests }))
export default class EditTest extends Component {
    constructor(props) {
        super(props);
        this.state = { wannaUpdate: false, elementId: props.match.params.elementId };
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleWannaUpdateClick = this._handleWannaUpdateClick.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.match.params.elementId === state.elementId)
            return state;
        return {
            ...state,
            wannaUpdate: false,
            elementId: props.match.params.elementId
        };
    }

    _handleWannaUpdateClick(ev) {
        ev.preventDefault();
        this.setState(oldState => ({ wannaUpdate: !oldState.wannaUpdate }));
    }

    _handleClick(ev) {
        ev.preventDefault();
        store.dispatch(addAlert({ alert: 'Are you sure you want to delete this test record?', handler: this._deleteFunction }));
    }

    _deleteFunction() {
        const { params } = this.props.match;
        const body = { patientId: params.patientId, data: { testId: parseInt(params.elementId) }, to: `/patientProfile/${params.patientId}` };
        store.dispatch(deleteTestAPICall(body));
    }

    render() {
        const { params } = this.props.match;
        const { tests, location } = this.props;
        const { wannaUpdate } = this.state;

        if (!tests) {
            return <div></div>;
        }
        const testsFiltered = tests.filter(el => el.id === parseInt(params.elementId));
        if (testsFiltered.length !== 1) {
            return <div> We cannot find this test!</div>;
        }

        const test = testsFiltered[0];
        return (
            <>
                <div className={style.ariane}>
                    <h2>Edit test</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    {wannaUpdate ? <UpdateTestEntry location={location} data={test} elementId={params.elementId} /> : null}
                    {wannaUpdate ? <><button onClick={this._handleWannaUpdateClick}>Cancel</button><br /><br /></> :
                        <><button onClick={this._handleWannaUpdateClick}>Change test date</button><br /><br /></>
                    }
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this test</button>
                    <br /><br />
                    Note: You cannot change the type of test. If you created the wrong type of test you can delete this event record and create a new one.
                </form>
            </>
        );
    }
}

@connect(state => ({ patientId: state.patientProfile.data.patientId }))
class UpdateTestEntry extends Component {
    constructor(props) {
        super();
        this.state = {
            elementId: props.elementId,
            id: props.data.id,
            startDate: moment(parseInt(props.data.expectedOccurDate)),
            actualOccurredDate: !props.data.actualOccurredDate ? moment() : moment(parseInt(props.data.actualOccurredDate))
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleActualDateChange = this._handleActualDateChange.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.elementId === state.elementId)
            return state;
        return {
            ...state,
            id: props.data.id,
            elementId: props.elementId,
            startDate: moment(parseInt(props.data.expectedOccurDate)),
            actualOccurredDate: !props.data.actualOccurredDate ? moment() : moment(parseInt(props.data.actualOccurredDate)),
            error: undefined
        };
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

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.state.startDate || !this.state.startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the expected date of the test'
            });
        }
        if (!this.state.actualOccurredDate || !this.state.actualOccurredDate.isValid()) {
            return this.setState({
                error: 'Please indicate the actual date of the test'
            });
        }
        if (this.state.testType === 'unselected') {
            this.setState({
                error: 'Please indicate the test type'
            });
            return;
        }

        const { patientId } = this.props;
        const { id, startDate, actualOccurredDate } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}/edit/test/${id}`,
            data: {
                id,
                expectedOccurDate: startDate.toISOString(),
                actualOccurredDate: actualOccurredDate ? actualOccurredDate.toISOString() : null
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: undefined
        }, () => {
            store.dispatch(updateTestCall(body));
        });
    }

    render() {
        const { startDate, actualOccurredDate } = this.state;
        return (
            <>
                <label>Expected Date: </label>
                <PickDate startDate={startDate} handleChange={this._handleDateChange} />
                <br />
                <label>Sample taking Date: </label>
                <PickDate startDate={actualOccurredDate} handleChange={this._handleActualDateChange} />
                <br />
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmit}>Submit</button><br /><br />
            </>
        );
    }
}