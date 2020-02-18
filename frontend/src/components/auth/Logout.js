import React, { Component, Fragment } from "react";
import { NavItem, NavLink } from "reactstrap";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { logout } from '../../actions/authAction';

class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired
    }

    render() {
        return (
            <Fragment>
                <NavLink href="#" onClick={ this.props.logout }>
                    Logout
                </NavLink>
            </Fragment>
        )
    }
}

export default connect(
    null,
    { logout }
)(Logout);