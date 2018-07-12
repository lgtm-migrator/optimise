import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { CreateTest } from './createTest.jsx';
import { CreateCE } from './createCE.jsx';
import { CreateTreatment } from './createTreatment.jsx';
export class CreateElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/create/:visitId/test' render={({ match }) => <CreateTest match={match} />} />
                <Route path='/patientProfile/:patientId/create/:visitId/clinicalEvent' render={({ match }) => <CreateCE match={match} />} />
                <Route path='/patientProfile/:patientId/create/:visitId/treatment' render={({ match }) => <CreateTreatment match={match} />} />
                <Route path='/' render={() => <div>This element type is not allowed ;) URL error</div>} />
            </Switch>
        )
    }
}