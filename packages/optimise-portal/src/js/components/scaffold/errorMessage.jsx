import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { clearError } from '../../redux/actions/error';
import style from './scaffold.module.css';

@connect(state => ({ error: state.appLevelError }))
export default class ErrorMessage extends PureComponent {
    _handleCancel = () => {
        store.dispatch(clearError());
    }

    inceptError(error) {
        if (!error)
            return null;
        let compile = '';
        if (typeof error === 'string')
            compile = error;
        if (typeof error === 'object' && (error.error || error.data))
            compile += ` ${this.inceptError(error.error || error.data)}`;
        return compile;
    }

    render() {
        const { error } = this.props;
        let compile = this.inceptError(error);
        if (compile) {
            return (
                <div className={style.errorMessage}>
                    <div className={style.errorMessageDialogBox}>
                        <span><b>OOPS!</b></span> <span onClick={this._handleCancel} className={style.cancelButton}>&#10006;</span><br /><br />
                        It seems you have encountered an error! <br />
                        Hopefully, the following error message can help:<br /><br />
                        <div>{compile}</div>
                    </div>
                </div>
            );
        } else {
            return null;
        }

    }
}