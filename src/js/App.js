import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar } from './components/scaffold.jsx';
import { LoginPage } from './components/login/loginPage.jsx';
import cssLogin from '../css/loginpage.module.css';
import { LoadingIcon } from '../statics/svg/icons.jsx';
import cssIcons from '../css/icons.module.css';
import cssScaffold from '../css/scaffold.module.css';
import { getVisitFieldsCall, getTestFieldsCall, getClinicalEventTypesCall, getTestTypesCall, getDrugsCall, getDemoCall, getRelationCall } from './redux/actions/availableFields.js';
require('react-datepicker/dist/react-datepicker-cssmodules.css');


@withRouter
@connect(state => ({ loggedIn: state.login.loggedIn }))
class App extends Component {
    componentWillUnmount() {
        if (this.props.loggedIn) {
            // dispatch logout
        }
    }

    render() {
        if (this.props.loggedIn) {
            return <LoadingFields />;
        } else {
            return <LoginPage />;
        }
    }
}



function mapDispatchToProps(dispatch) {
    return {
        getVisitFieldsCall: () => dispatch(getVisitFieldsCall()),
        getTestFieldsCall: () => dispatch(getTestFieldsCall()),
        getClinicalEventTypesCall: () => dispatch(getClinicalEventTypesCall()),
        getTestTypesCall: () => dispatch(getTestTypesCall()),
        getDrugsCall: () => dispatch(getDrugsCall()),
        getDemoCall: () => dispatch(getDemoCall()),
        getRelationCall: () => dispatch(getRelationCall())
    };
}
@withRouter
@connect(state => ({ fetching: state.availableFields.fetching }), mapDispatchToProps)
class LoadingFields extends Component {
    componentDidMount() {
        this.props.getVisitFieldsCall();
        this.props.getTestFieldsCall();
        this.props.getClinicalEventTypesCall();
        this.props.getTestTypesCall();
        this.props.getDrugsCall();
        this.props.getDemoCall();
        this.props.getRelationCall();

    }

    render() {
        if (this.props.fetching) {
            return <div className={cssLogin.loadingFields}><div className={cssIcons.spinner}><LoadingIcon /></div> Loading project data..</div>;
        } else {
            return (
                <div className={cssScaffold.App}>
                    <MenuBar />
                    <MiddlePanel />
                    <RightPanel />
                    <FarRightPanel />
                    <StatusBar />
                </div>
            );
        }
    }
}


export default App;