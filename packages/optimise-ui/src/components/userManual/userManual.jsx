import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import Helmet from '../scaffold/helmet';
import style from './userManual.module.css';
import markup from './userManual.md';

export default class UserManual extends PureComponent {
    render() {
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='User Manual' />
                    <h2>User Manual</h2>
                </div>
                <div className={style.panel}>
                    <ReactMarkdown source={markup} escapeHtml={false} />
                </div>
            </>
        );
    }
}
