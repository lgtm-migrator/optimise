import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

function mapStateToProps(state) {
    return {
        fields: state.availableFields,
        patientProfile: state.patientProfile
    };
}

function mapDispatchToProps(dispatch) {
    return {
        submitData: data => dispatch(alterDataCall(data))
    };
}

/**
 * @class DataTemplate
 * @description Renders the data page for test / visit / treatment / event data
 * @prop {String} this.props.elementType - 'test', 'visit', 'treatment', 'clinicalEvent'
 * @prop {Object} this.props.match - from router
 * @prop {Object} this.props.fields - from store
 * @prop {Object} this.props.patientProfile - from store
 * @prop {Function} this.props.submitData - from connect
 */

@connect(mapStateToProps, mapDispatchToProps)
export class DataTemplate extends Component {
    constructor() {
        super();
        this.state = { data: null };
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const idString = `${this.props.elementType}Id`;
        const bodydata = { add: {}, update: {} };
        bodydata[idString] = this.props.match.params.elementId;
        for (let i = 0, length = ev.target.length - 1; i < length; i++) {   //length - 1 to exclude 'save' button
            const originalValue = ev.target[i].attributes.originalvalue ? ev.target[i].attributes.originalvalue.nodeValue : undefined;
            if (originalValue) {
                if (originalValue !== ev.target[i].value) {
                    bodydata.update[ev.target[i].name] = ev.target[i].value;
                }
            } else {
                if (ev.target[i].value !== '' && ev.target[i].value !== 'unselected') {
                    bodydata.add[ev.target[i].name] = ev.target[i].value;
                }
            }
        }
        const body = { data: bodydata, type: this.props.elementType, patientId: this.props.match.params.patientId };
        // console.log(body);
        // this.setState(body);
        this.props.submitData(body);
    }

    render() {
        if (!this.props.patientProfile.fetching) {
            const idString = (this.props.elementType === 'test' || this.props.elementType === 'visit') ? `${this.props.elementType}Id` : 'id';   //this is because id naming is inconsistent on backend - might change..?
            const elementsMatched = this.props.patientProfile.data[`${this.props.elementType}s`].filter(element => element[idString] === parseInt(this.props.match.params.elementId, 10));
            if (elementsMatched.length === 0) {
                return <div>{`Cannot find your ${this.props.elementType}!`}</div>;
            } else {
                const fieldString = `${this.props.elementType}Fields`;
                return (
                    <>
                        <div className={style.ariane}>
                            <h2>Results</h2>
                            <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                        </div>
                        <form className={style.panel}>
                            {formatData(elementsMatched[0], this.props.fields[fieldString], this.props.fields.inputTypes, this._handleSubmit, idString, this.props.elementType)}
                        </form>
                    </>
                );
            }
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}

export class BackButton extends Component {
    render() {
        return (
            <Link to={this.props.to} title='Close' className={style.backButton}>&#10006;</Link>
        );
    }
}


/**
 * @function formatData
 * @example
* // medicalElement = {
* //     'testId': 1,
* //     'orderedDuringVisit': 10,
* //     'type': 2,
* //     'expectedOccurDate': '5/6/1',
* //     'data': [
* //        { 'field': 64, 'value': '13' },
* //        { 'field': 65, 'value': '12' },
* //        { 'field': 86, 'value': '123' },
* //        { 'field': 91, 'value' : 'TEST NOT DONE' }]}
* @description Take the data of a test, event, or visit as sent by the backend and format it to react component / JSX for display.
* @param {Object} medicalElement - medical element object (test, events, visits) as is from the {test, event, visit} entries from /patientProfile/:patientId
* @param {Array} fieldList - the available fields as is returned from calling /getAvailable{testFields | eventFields,etc}
* @param {Array} dataTypes - the datatype array returned by backend
* @returns {JSX} Formatted data for display on frontend
        */
function formatData(medicalElement, fieldList, inputTypes, submitFunction, idString, type) {
    if (type === 'visit') {
        medicalElement = { ...medicalElement, type: 1 };
    }
    //reformating the field list to hash table with fieldId as key for easier lookup later without needing array filter:
    const filteredFieldList = fieldList.filter(field => field.referenceType === medicalElement.type);
    //same with data:
    const dataHashTable = medicalElement.data.reduce((map, el) => { map[el.field] = el.value; return map; }, {});
    //same with inputTypes:
    const dataTypesHashTable = inputTypes.reduce((map, dataType) => { map[dataType.id] = dataType.value; return map; }, {});
    return (
        <div>
            <form onSubmit={submitFunction}>
                {
                    filteredFieldList.map(field => {
                        const { id, definition, type, permittedValues } = field;
                        const originalValue = dataHashTable[field.id]; //assigned either the value or undefined, which is falsy, which is used below
                        const key = `${medicalElement[idString]}_FIELD${id}`;
                        switch (dataTypesHashTable[type]) {   //what to return depends on the data type of the field
                            case 'I':
                                return (
                                    <>
                                        <label htmlFor='' key={key}>{definition}:</label><br />
                                        <ControlledInputField fieldId={id} originalValue={originalValue} dataType='I' /><br /><br />
                                    </>
                                );
                            case 'F':
                                return (
                                    <>
                                        <label htmlFor='' key={key}>{definition}:</label><br />
                                        <ControlledInputField fieldId={id} originalValue={originalValue} dataType='F' /><br /><br />
                                    </>
                                );
                            case 'C':
                                return (
                                    <>
                                        <label htmlFor='' key={key}>{definition}:</label><br />
                                        <ControlledSelectField fieldId={id} originalValue={originalValue} permittedValues={permittedValues} /><br /><br />
                                    </>
                                );
                            case 'T':
                                return (
                                    <>
                                        <label htmlFor='' key={key}>{definition}:</label> <br />
                                        <ControlledInputField fieldId={id} originalValue={originalValue} dataType='T' /><br /><br />
                                    </>
                                );
                            case 'B':
                                return (
                                    <>
                                        <label htmlFor='' key={key}>{definition}:</label><br />
                                        <ControlledSelectField fieldId={id} originalValue={originalValue} permittedValues='true,false' /><br /><br />
                                    </>
                                );
                            default:
                                return (
                                    <>
                                        <span>This field cannot be displayed. Please contact admin. </span><br /><br />
                                    </>
                                );
                        }
                    })
                }
                <input type="submit" value="Save" />
            </form>
        </div>
    );
}


/*
undone:
rendering tests directly throws error
input field has to be controlled component
now the test input is hardcode
*/


/**
 * @class
 * @name ControlledInputField
 * @description An html input element. If the input is same as the original value, the color is black. If the input is valid for the dataType, the color is green; if not, the color is red.
* @prop {string} this.props.originalValue
* @prop {string} this.props.dataType - 'I': integer, 'F': float, 'T': free text
* @prop {string} this.props.fieldId - fieldid
   */
export class ControlledInputField extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.originalValue, valid: true };
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
        this._validateInput = this._validateInput.bind(this);
        this._handleResetClick = this._handleResetClick.bind(this);
    }

    componentDidMount() {
        this.setState({ value: this.props.originalValue });
    }

    _handleKeyStroke(ev) {
        this.setState({ value: ev.target.value, valid: this._validateInput(ev.target.value) });
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
        }
    }

    _handleResetClick() {
        this.setState({ value: this.props.originalValue ? this.props.originalValue : '' });
    }

    _validateInput(value) {
        switch (this.props.dataType) {
            case 'I':
                if (parseInt(value, 10) && parseInt(value, 10) === parseFloat(value, 10) && parseInt(value, 10) === value) {
                    return true;
                } else {
                    return false;
                }
            case 'F':
                if (parseFloat(value, 10) && parseFloat(value, 10) === value) {
                    return true;
                } else {
                    return false;
                }
            case 'T':
                return true;
            default:
                throw new Error('wrong dataType');
        }

    }

    render() {
        return (
            <div className={style.cutter}>
                <input
                    name={this.props.fieldId}
                    fieldid={this.props.fieldId}
                    type='text'
                    value={this.state.value}
                    onChange={this._handleKeyStroke}
                    onKeyPress={this._handleEnterKey}
                />
                <button onClick={this._handleResetClick}>Reset</button>
            </div>
        );
    }
}


/**
 * @class
 * @name ControlledSelectField
 * @description An html select element.
* @prop {string} this.props.permittedValues - a string of permitted value separated by commas. As is from the database
* @prop {string} this.props.fieldId - fieldid
* @prop {string} this.props.originalValue
       */
export class ControlledSelectField extends Component {
    constructor() {
        super();
        this.state = { value: 'unselected' };
        this._handleResetClick = this._handleResetClick.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.originalValue) {
            this.setState({ value: this.props.originalValue });
        }
    }

    _handleChange(ev) {
        this.setState({ value: ev.target.value });
    }

    _handleResetClick() {
        this.setState({ value: this.props.originalValue ? this.props.originalValue : 'unselected' });
    }

    render() {
        return (
            <div className={style.cutter}>
                <select originalvalue={this.props.originalValue} name={this.props.fieldId} fieldid={this.props.fieldId} value={this.state.value} onChange={this._handleChange} >
                    <option value='unselected'>unselected</option>
                    {this.props.permittedValues.split(',').map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                <button onClick={this._handleResetClick}>Reset</button>
            </div>
        );
    }
}
