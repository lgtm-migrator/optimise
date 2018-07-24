import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteTestAPICall, updateTestCall } from '../../redux/actions/tests';

@connect(state => ({ tests: state.patientProfile.data.tests }))
export default class EditTest extends Component {
    constructor() {
        super();
        this.state = { wannaUpdate: false };
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleWannaUpdateClick = this._handleWannaUpdateClick.bind(this);
    }

    _handleWannaUpdateClick(ev) {
        ev.preventDefault();
        this.setState(oldState => ({ wannaUpdate: !oldState.wannaUpdate }));
    }

    _handleClick(ev) {
        ev.preventDefault();
        store.dispatch(addAlert({ alert: 'about deleting this test?', handler: this._deleteFunction }));
    }

    _deleteFunction() {
        const { params } = this.props.match;
        const body = { patientId: params.patientId, data: { testID: parseInt(params.elementId) }, to: `/patientProfile/${params.patientId}` };
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
            return <div> Cannot find your treatment! check your ID! </div>;
        }
        const test = testsFiltered[0];
        return (
            <>
                <div className={style.ariane}>
                    <h2>Edit test</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <h3>Please select the following options: </h3>
                    <br />
                    {wannaUpdate ? <UpdateTestEntry location={location} data={test} /> : null}
                    {wannaUpdate ? <><br /><br /> <button onClick={this._handleWannaUpdateClick}>Cancel</button></> :
                        <button onClick={this._handleWannaUpdateClick}>Change test date</button>
                    }
                    <br /><br /><br /><br />
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this test</button>
                    <br /><br />
                    Note: test type is not allowed to be changed. If you entered a test of the wrong type by error, you can delete the test and create a new one.
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
            id: props.data.id,
            startDate: moment(parseInt(props.data.expectedOccurDate)),
            actualOccurredDate: !props.data.actualOccurredDate ? moment() : moment(parseInt(props.data.actualOccurredDate))
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleActualDateChange = this._handleActualDateChange.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleActualDateChange(date) {
        this.setState({
            actualOccurredDate: date
        });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { patientId } = this.props;
        const { id, startDate, actualOccurredDate } = this.state;
        const body = {
            patientId: patientId,
            to: `/patientProfile/${patientId}`,
            data: {
                id,
                expectedOccurDate: startDate.valueOf(),
                actualOccurredDate: actualOccurredDate ? actualOccurredDate.valueOf() : null
            }
        };
        // console.log(body);
        store.dispatch(updateTestCall(body));
    }

    render() {
        const { actualOccurredDate, startDate } = this.state;
        return (
            <>
                <label>Expected Date: </label>
                <PickDate startDate={startDate} handleChange={this._handleDateChange} />
                <br /><br />
                <label>Sample taking Date: </label>
                <PickDate startDate={actualOccurredDate} handleChange={this._handleActualDateChange} />
                <br /><br />
                <button onClick={this._handleSubmit}>Submit</button>
            </>
        );
    }
}