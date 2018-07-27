import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';


@connect(state => ({
    data: state.patientProfile.data
}))
export default class EditPerformanceMesaure extends Component {
    render() {
        const { match: { params }, data: { visits } } = this.props;
        if (visits === undefined)
            return null;
        const visitFiltered = visits.filter(el => parseInt(params.visitId) === el.id);
        if (visitFiltered.length !== 1){
            return <div> Cannot find your visit </div>;
        }
        return (
            <>
                <div className={style.ariane}>
                    <h2>Performance Measure</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <span><i>This is for the visit of the {(new Date(parseInt(visitFiltered[0].visitDate))).toDateString()}</i></span><br /><br />
                    <NavLink to={`/patientProfile/${params.patientId}/edit/msPerfMeas/${params.visitId}/edss`}><span>EDSS calculator</span></NavLink>
                </form>
            </>
        );
    }
}
