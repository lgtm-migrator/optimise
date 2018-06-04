import React, {Component} from 'react';
import css from '../../css/patientProfile.css.js';
import plusSignIcon from '../../statics/icons/icons8-plus-math-64.png'; 


////////////////////////
let hey = {"patientId":"florian","demographicData":{"DOB":"4/7/1994","gender":"male","dominant_hand":"left","ethnicity":"chinese","country_of_origin":"china","alcohol_usage":"More than 3 units a day","smoking_history":"unknown"},"immunisations":[],"medicalHistory":[],"visits":[{"visitId":2,"visitDate":"29/2/2000","data":[]},{"visitId":1,"visitDate":"4/7/2015","data":[{"field":19,"value":"LEFT"},{"field":83,"value":"1"}]}],"tests":[{"testId":1,"ordered_during_visit":1,"type":2,"expected_occur_date":"5/6/1","data":[{"field":64,"value":"13"},{"field":65,"value":"12"}]}],"treatments":[{"id":1,"ordered_during_visit":1,"drug":"2","dose":2,"unit":"cc","form":"oral","times_per_day":2,"duration_weeks":4,"terminated_date":null,"terminated_reason":null,"interruptions":[{"reason":"pregnancy","start_date":"dsafsaf","end_date":"dsafsdf"},{"reason":"pregnancy","start_date":"fdsaf","end_date":"dsaf"},{"reason":"pregnancy","start_date":"t45325","end_date":"432532"}]},{"id":2,"ordered_during_visit":1,"drug":"1","dose":2,"unit":"cc","form":"oral","times_per_day":2,"duration_weeks":7,"terminated_date":null,"terminated_reason":null,"interruptions":[]},{"id":3,"ordered_during_visit":10,"drug":"1","dose":2,"unit":"cc","form":"oral","times_per_day":3,"duration_weeks":3,"terminated_date":null,"terminated_reason":null,"interruptions":[]}],"clinicalEvents":[{"id":1,"recorded_during_visit":null,"type":1,"date_start_date":"3/11/2011","end_date":null,"data":[{"field":10,"value":"COMPLETE"}]},{"id":2,"recorded_during_visit":1,"type":1,"date_start_date":"ffdsg","end_date":null,"data":[]}]};



export class Button extends Component {
    constructor() {
        super();
    }

    render() {
        return <div style={this.props.style}>{this.props.text}</div>
    }
}

export class PatientProfileSection extends Component {
    constructor() {
        super();
    }

    render() {
        return(
        <div>
            <div style={css.sectionTitleBar}>{this.props.sectionName.toUpperCase()}</div>
            <div style={css.sectionBody}>
                {Object.entries(hey.demographicData).map(el => <span><b>{el[0].replace(/_/g, ' ') + ': '}</b>{el[1]}<br/></span>)}
            </div>
        </div>
        );
    }
}

export class PlusButton extends Component {
    render() {
        return <img src={plusSignIcon} style={css.plusSign}/>
    }
}