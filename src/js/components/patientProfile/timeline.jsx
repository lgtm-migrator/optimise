import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PatientProfileSectionScaffold } from './sharedComponents';
import style from './patientProfile.module.css';

/*
Timeline:
Currently it takes the latest date and the earliest date in all the visits, tests, meds, and events in the patient profile,
and defined the css grid column number as the difference in days between the two. And then for each medical elements it calculates
from its date which css grid area it belongs to, by calculating the ratio and then rounding off.
*/
@connect(state => ({ data: state.patientProfile.data }))
export class TimelineBox extends Component {   //unfinsihed
    render() {
        const allVisitDates = this.props.data.visits.map(el => el.visitDate);
        const allTestDates = this.props.data.tests.map(el => el.expectedOccurDate);
        const allCEDates = [];
        this.props.data.clinicalEvents.forEach(function (el) {
            allCEDates.push(el.dateStartDate);
            if (el.endDate) {
                allCEDates.push(el.endDate);
            }
        });
        const allDates = [...allVisitDates, ...allTestDates, ...allCEDates];
        allDates.sort();
        const mappingVisitFunction = visit => (
            <a title={new Date(parseInt(visit.visitDate, 10)).toDateString()} key={`${visit.visitId}visit`} href={`#visit/${visit.visitId}`} >
                <div> - </div>
            </a>
        );

        const mappingTestFunction = test => (
            <a title={new Date(parseInt(test.expectedOccurDate, 10)).toDateString()} key={`${test.testId}test`} href={`#test/${test.testId}`} >
                <div> - </div>
            </a>
        );
        const mappingMedFunction = med => (
            <a title={new Date(parseInt(med.visitDate, 10)).toDateString()} key={`${med.id}med`} href={`#treatment/${med.id}`} >
                <div> - </div>
            </a>
        );

        const mappingCEFunction = CE => (
            <a title={new Date(parseInt(CE.dateStartDate)).toDateString()} key={`${CE.id}ce`} href={`#clinicalEvent/${CE.id}`} >
                <div> - </div>
            </a>
        );

        return (
            <PatientProfileSectionScaffold sectionName='Timeline'>
                <div className={style.timelineBox} >
                    <div >
                        Visits
                    </div>
                    <div >
                        Meds
                    </div>
                    <div >
                        Tests
                    </div>
                    <div >
                        Events
                    </div>
                    {this.props.data.visits.map(mappingVisitFunction)}
                    {this.props.data.tests.map(mappingTestFunction)}
                    {this.props.data.treatments.map(mappingMedFunction)}
                    {this.props.data.clinicalEvents.map(mappingCEFunction)}
                </div>
            </PatientProfileSectionScaffold>
        );
    }
}
