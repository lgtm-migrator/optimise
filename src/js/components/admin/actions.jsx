import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import style from './admin.module.css';
import { AdminRouter } from './router';

export class AdminActions extends Component {
    render() {
        return (
            <>
            <div className={style.ariane}>
                <h2> ADMIN MENU </h2>
            </div>
            <div className={style.panel}>
                <div className={style.actionsMenu}>
                    <NavLink to='/administration/messages' activeClassName={style.activeNavLink}>
                        <button>Messages</button>
                    </NavLink>
                    <br/><br/>
                    <NavLink to='/administration/users' activeClassName={style.activeNavLink}>
                        <button>Manage users</button>
                    </NavLink>
                    <br/><br/>
                    <NavLink to='/administration/log' activeClassName={style.activeNavLink}>
                        <button>View access log</button>
                    </NavLink>
                </div>
                <div className={style.actionsDisplay}>
                    <AdminRouter/>
                </div>
            </div>
        </>
        );
    }
}