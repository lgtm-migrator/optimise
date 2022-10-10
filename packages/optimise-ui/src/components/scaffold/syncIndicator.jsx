import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSyncOptionsAPICall, getSyncStatusAPICall, syncNowAPICall } from '../../redux/actions/syncInfo';
import Icon from '../icon';
import style from './scaffold.module.css';

@connect(state => ({
    loggedIn: state.login.loggedIn,
    syncInfo: state.syncInfo
    }), dispatch => ({
        getSyncOptions: () => dispatch(getSyncOptionsAPICall()),
        getSyncStatus: () => dispatch(getSyncStatusAPICall()),
        syncNow: () => dispatch(syncNowAPICall())
        }))
class SyncIndicator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lastCall: 0,
            lastError: 0
        };
        this._updateStatus = this._updateStatus.bind(this);
    }

    componentDidMount() {
        this.statusUpdater = setInterval(this._updateStatus, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.statusUpdater);
    }

    _updateStatus() {

        const { syncInfo: { config, status: { lastSuccess, syncing, error, status, adminPass } }, loggedIn } = this.props;
        const { lastCall, lastError, triggered } = this.state;
        const now = (new Date()).getTime();

        // Sync every 15 minutes
        const limit = 1000 * 60 * 15;

        let state = {
            lastCall: now
        };

        if ((status === 900 || error !== undefined) && lastError === 0)
            state.lastError = now;

        if (syncing === true && adminPass !== undefined)
            state.triggered = true;
        if (syncing !== true)
            state.triggered = false;
        if (lastCall === 0 || (lastError !== 0 && now - lastError >= limit) || (lastSuccess !== undefined && now - lastSuccess >= limit)) {
            this.props.syncNow();
            state.triggered = true;
            state.lastError = 0;
        } else if (triggered === true && syncing === true)
            this.props.getSyncStatus();

        if (loggedIn === true && config.host === undefined) {
            this.props.getSyncOptions();
            state.lastError = 0;
            state.lastCall = 0;
        }
        this.setState(state);
    }

    render() {
        const { syncInfo } = this.props;

        if (syncInfo.config === undefined || syncInfo.config.host === undefined || syncInfo.config.host === '')
            return null;
        if (syncInfo.status.error !== undefined) {
            let message = 'Remote unavailable';
            if (syncInfo.status.error.message === 'Validation key error')
                message = 'Sync key error';
            return (
                <span title={`${syncInfo.status.error.message}: ${syncInfo.status.error.exception}`}><strong className={style.statusIcon}><Icon symbol={'attention'}></Icon></strong> {message}</span>
            );
        } else if (syncInfo.status.syncing === true)
            return (
                <span title={`${syncInfo.status.status}: ${syncInfo.status.step}`}><strong className={`${style.statusIcon} ${style.syncActive}`}><Icon symbol={'sync'}></Icon></strong> Syncing ...</span>
            );
        else if (syncInfo.status.lastSuccess !== undefined)
            return (
                <span><strong className={style.statusIcon}><Icon symbol={'cloud'}></Icon></strong> Synced with {(new URL(syncInfo.config.host)).host}</span>
            );
        else
            return null;
    }
}

export default SyncIndicator;