import React, {Component} from 'react';
import {SearchPatientsById} from './components/searchPatientsById.js';




class App extends Component {
    render() {
        return (
        <div className="App">
            Type whatever you want!
            <SearchPatientsById/>
        </div>
        );
    }
}


export default App;
