import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { EditTest, EditCE, EditMed, EditDemo } from './index';

export class EditElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/edit/test/:elementId' render={({ match, location }) => <EditTest match={match} location={location}/>} />
                <Route path='/patientProfile/:patientId/edit/clinicalEvent/:elementId' render={({ match, location }) => <EditCE match={match} location={location}/>} />
                <Route path='/patientProfile/:patientId/edit/treatment/:elementId' render={({ match, location }) => <EditMed match={match} location={location}/>} />
                <Route path='/patientProfile/:patientId/edit/demographic/data' render={({ match, location }) => <EditDemo match={match} location={location}/>} />
                <Route path='/' component={() => <></>} />
            </Switch>
        );
    }
}