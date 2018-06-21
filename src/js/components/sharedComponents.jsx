import React, { Component } from 'react';
import css from '../../css/patientProfile.css.js';
import plusSignIcon from '../../statics/icons/icons8-plus-math-64.png'; 
import Radium from 'radium';


export class Button extends Component {
    render() {
        return <div style={this.props.style} onClick={this.props.clicked}>{this.props.text}</div>
    }
}

Button = Radium(Button);

export class PlusButton extends Component {
    render() {
        return <img src={plusSignIcon} style={css.plusSign} alt='plusSignIcon'/>
    }
}