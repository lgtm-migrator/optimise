import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { SearchPatient } from '../searchPatient';
import { FilterPanel } from '../filterPatient/selectPanel';
import style from './scaffold.module.css';

export default class MiddlePanel extends Component {
    render() {
        return (
            <div className={style.middlePanel}>
                <Switch>
                    <Route exact path='/' component={SearchPatient} />
                    <Route path='/searchPatient' component={SearchPatient} />
                    <Route path='/createPatient' component={SearchPatient} />
                    <Route exact path='/export' component={() => <></>} />
                    <Route exact path='/filterPatients' component={FilterPanel} />
                    <Route path='/patientProfile/:patientId' component={null} />
                </Switch>
            </div>
        );
    }
}
