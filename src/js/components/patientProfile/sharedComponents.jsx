import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import Icon from '../icon';
import { BackButton } from '../medicalData/dataPage';
import style from './patientProfile.module.css';

export class PatientProfileSectionScaffold extends Component {
    render() {
        return (
            <>
                <h4>{this.props.sectionName}</h4><br />
                {this.props.children}<br /><br /><br />
            </>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data }))
export class PatientProfileTop extends PureComponent {
    render() {
        const { patientId } = this.props.data;
        return (
            <div className={style.profileActions}>
                <Link title='Create visit' to={`/patientProfile/${patientId}/createVisit`} ><Icon symbol='addVisit' /><span>Create visit</span></Link>
                <Link title='Order test' to={`/patientProfile/${patientId}/create/test`}><Icon symbol='addTest' /><span>Order test</span></Link>
                <Link title='Add prescription' to={`/patientProfile/${patientId}/create/treatment`}><Icon symbol='addTreatment' /><span>Add prescription</span></Link>
                <Link title='Record event' to={`/patientProfile/${patientId}/create/clinicalEvent`}><Icon symbol='addEvent' /><span>Record event</span></Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <BackButton to={'/searchPatient'} />
            </div>
        );
    }
}




/*  receive props handler function this.props.clickhandler*/
export class DeleteButton extends Component {
    render() {
        return (
            <span title='Delete' onClick={this.props.clickhandler} className={style.cancelButton}><Icon symbol='trash' /></span>
        );
    }
}

/*  receive props  this.props.to*/
export class EditButton extends Component {
    render() {
        return (
            <NavLink to={this.props.to} className={style.editButton} activeClassName={style.activeEdit}>
                <div title='Edit'><Icon symbol='edit' /></div>
            </NavLink>
        );
    }
}
