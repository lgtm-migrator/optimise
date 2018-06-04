import React, {Component} from 'react';
import { connect } from 'react-redux';
import css from '../../css/patientProfile.css.js';
import patientIcon from '../../statics/icons/icons8-user-48.png';
import resumeIcon from '../../statics/icons/icons8-resume-48.png';


class Section_toConnect extends Component {
    render() {
        if (this.props.fetching) {
            return <span> FETCHING PROFILE </span>
        } else {
            return (<div style={css.bigWrapper}>
                    <PatientProfileTop/>
                    <DemographicSection/>
                    <ImmunisationSection/>
                    <MedicalHistorySection/>
                </div>)
        }
    }
}
export const Section = connect(state => ({fetching: state.patientProfile.fetching}))(Section_toConnect);



class PatientProfileSectionScaffold extends Component {
    render() {
        return (
        <div>
            <div style={css.sectionTitleBar}>{this.props.sectionName.toUpperCase()}</div>
            <div style={css.sectionBody}>
            {this.props.children}
            </div>
        </div>
        );
    }
}



/* All the components below are connected to the store separately, 
so that updating one part of the data only re-renders one of them */
class PatientProfileTop_toConnect extends Component {
    render(){
        return (
            <div>
                <span><h1> Patient ID: <b>{this.props.patientId}</b></h1></span>
                <img src={patientIcon} alt='patientIcon'/>
                <img src={resumeIcon} alt='resumeIcon'/>
            </div>
        );
    }
}

const PatientProfileTop = connect(state => ({patientId: state.patientProfile.data.patientId}))(PatientProfileTop_toConnect);


class DemographicSection_toConnect extends Component {
    render() {
        return (
        <PatientProfileSectionScaffold sectionName='Profile'>
                {Object.entries(this.props.demographicData).map(el => <span key={el[0]}><b>{el[0].replace(/_/g, ' ') + ': '}</b>{el[1]}<br/></span>)}
        </PatientProfileSectionScaffold>
        );
    }
}

const DemographicSection = connect(state => ({demographicData: state.patientProfile.data.demographicData}))(DemographicSection_toConnect);


class ImmunisationSection_toConnect extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations'>
                {this.props.immunisations.map(el => <span key={`${el['vaccine_name']}:${el[ 'immunisation_date']}`}><b>{el['vaccine_name']}</b>: {el[ 'immunisation_date']}</span>)}
            </PatientProfileSectionScaffold>
        );
    }
}

const ImmunisationSection = connect(state => ({immunisations: state.patientProfile.data.immunisations}))(ImmunisationSection_toConnect);


// class NoteSection_toConnect extends Component {
//     render() {
//         return (
//             <PatientProfileSectionScaffold sectionName='Notes'>
//             </PatientProfileSectionScaffold>
//         );
//     }
// }

//const NoteSection = connect(state => {immunisations: state.patientProfile.data.immunisations})(NoteSection_toConnect);


class MedicalHistorySection_toConnect extends Component {
    render() {
        return (
            <div>
            <PatientProfileSectionScaffold sectionName='Existing Medical Conditions'>
                {this.props.medicalHistory.filter(el => el.relation === 'self').map(el => {
                    return (
                        <span key={`${el['condition_name']}:${el['start_date']}`}>{`${el['condition_name']}: ${el['start_date']} : ${el.outcome} : ${el['resolved_year']}`}<br/></span>
                    );
                })}
            </PatientProfileSectionScaffold>
            <PatientProfileSectionScaffold sectionName='Family Medical History'>
                {this.props.medicalHistory.filter(el => el.relation !== 'self').map(el => {
                    return (
                        <span key={`${el.relation}:${el['condition_name']}:${el['start_date']}`}>{`${el.relation} : ${el['condition_name']}: ${el['start_date']} : ${el.outcome} : ${el['resolved_year']}`}<br/></span>
                    );
                })}
            </PatientProfileSectionScaffold>
            </div>
        );
    }
}

const MedicalHistorySection = connect(state => ({medicalHistory: state.patientProfile.data.medicalHistory}))(MedicalHistorySection_toConnect);