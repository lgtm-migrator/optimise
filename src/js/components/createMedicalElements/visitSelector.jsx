import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { VisitPicker } from '../patientProfile/popup';
import { BackButton } from '../medicalData/utils';
import { createShadowVisitAPICall } from '../../redux/actions/createVisit';
import style from './medicalEvent.module.css';

//not yet finished the dispatch
@connect(state => ({ patientRealId: state.patientProfile.data.id, patientId: state.patientProfile.data.patientId }), dispatch => ({ createShadowVisit: (body, context) => dispatch(createShadowVisitAPICall(body, context)) }))
export class VisitSelector extends Component {

    constructor() {
        super();
        this._handleShadowVisit = this._handleShadowVisit.bind(this);
    }

    _handleShadowVisit(ev) {
        ev.preventDefault();
        let requestBody = {
            visitData: {
                patientId: this.props.patientRealId,
                visitDate: moment().toISOString(),
                type: 2
            },
            patientId: this.props.patientId
        };
        this.props.createShadowVisit(requestBody, {
            to: `/patientProfile/${this.props.match.params.patientId}/create`,
            type: this.props.match.params.type
        });
    }

    render() {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            return (
                <>
                    <div className={style.ariane}>
                        <h2>When is this {params.type} recorded</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <div className={style.panel}>
                        <VisitPicker elementType={params.type} />
                        <span><i>Otherwise simply record an isolated occurence:</i></span><br /><br />
                        <button onClick={this._handleShadowVisit}>Record isolated occurence</button>
                    </div>
                </>
            );
        } else {
            return null;
        }
    }
}