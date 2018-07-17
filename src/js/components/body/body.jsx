import { PureComponent } from 'react';
import { default as T } from 'prop-types';
import browserBehaviour from '../../utilities/browserBehaviour';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import './body.css';

export default class Body extends PureComponent {

    // Custom name for container
    static displayName = 'Body';

    // Typechecking for container's props
    static propTypes = {
        children: T.oneOfType([T.array, T.element])
    };

    componentDidMount() {
        browserBehaviour.apply();
    }

    render() {
        const { children } = this.props;
        return children ? children : null;
    }
}
