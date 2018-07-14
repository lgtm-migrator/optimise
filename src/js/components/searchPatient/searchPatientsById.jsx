import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPatientProfileById, searchPatientByIdAPICall, searchPatientByIdRequest } from '../../redux/actions/searchPatientById';
import store from '../../redux/store';
import cssButtons from '../../../css/buttons.module.css';
import cssInputs from '../../../css/inputfields.module.css';

@connect(state => ({ data: state.searchPatientById }))
export class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = { searchString: '' };
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    _handleKeyStroke(ev) {
        this.setState({ searchString: ev.target.value });
        if (ev.target.value !== '') {
            store.dispatch(searchPatientByIdRequest(ev.target.value));
            store.dispatch(searchPatientByIdAPICall(ev.target.value));
        } else {
            store.dispatch(searchPatientByIdRequest(ev.target.value));
        }
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
        }
    }

    render() {
        return (
            <div >
                <h2>SEARCH FOR / CREATE A PATIENT</h2>
                <form className={cssInputs.searchBar}>
                    Enter Patient ID: <br /><input className={cssInputs.searchBarInput} type='text' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey} />
                </form>
                <SearchResultForPatients listOfPatients={this.props.data.result} searchString={this.state.searchString} />
            </div>
        );
    }
}
@connect(null, dispatch => ({ fetchPatientProfile: patientName => dispatch(getPatientProfileById(patientName)) }))
export class SearchResultForPatients extends Component {
    constructor() {
        super();
        this._handleClickWrapper = this._handleClickWrapper.bind(this);
    }

    _handleClickWrapper(patientName) {
        return () => {
            this.props.fetchPatientProfile(patientName);
        };
    }

    render() {
        return (
            <div>
                {this.props.listOfPatients.filter(el => el['aliasId'] === this.props.searchString).length === 0 && this.props.searchString !== '' ? <Link to={`/createPatient/${this.props.searchString}`} ><div className={cssButtons.createPatientButton}>{`Create patient ${this.props.searchString}`}</div></Link> : null}
                {this.props.listOfPatients.map(el => {
                    const ind = el['aliasId'].indexOf(this.props.searchString);
                    const name = <span><b>{el['aliasId'].substring(0, ind)}<span className={cssButtons.matchedString}>{el['aliasId'].substring(ind, this.props.searchString.length + ind)}</span>{el['aliasId'].substring(this.props.searchString.length + ind, el['aliasId'].length)}</b></span>;
                    return (
                        <Link key={el['aliasId']} to={`/patientProfile/${el['aliasId']}`} >
                            <div onClick={this._handleClickWrapper(el['aliasId'])} className={cssButtons.patientBanner} key={el.patientId}>
                                {name} in {el.study}
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }
}