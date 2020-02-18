import RegisterModal from './auth/RegisterModal';
import { Component, Fragment } from 'react';
import React from 'react';
import { Nav, Navbar, NavItem, NavLink, NavbarBrand, NavbarToggler, Collapse, NavbarText, Container } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';

class AppNavBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      }
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggleNavbar = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        const isAuthenticated = this.props.auth.isAuthenticated;
        const user = this.props.auth.user;
        const authLinks = (
            <Fragment>
                <NavItem>
                    <span className="navbar-text mr-3">
                        <strong>{ user ? `Welcome ${ user.name }` : "" }</strong>
                    </span>
                </NavItem>
                <NavItem>
                    <Logout/>
                </NavItem>
            </Fragment>
        )

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <h5><RegisterModal/></h5>
                </NavItem>
                <NavItem>
                  <h5><LoginModal/></h5>
                </NavItem>
            </Fragment>
        )

        return (
            <div>
                <Navbar color='light' light expand='md' className='mb-5'>
                    <Container>
                        <NavbarBrand href='/' className=''><h2>Bulk Purchase App</h2></NavbarBrand>
                        <NavbarToggler onClick={ this.toggleNavbar }/>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className='ml-auto' navbar>
                                { isAuthenticated ? authLinks : guestLinks }
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        auth: state.auth
    }
};
  
export default connect(
    mapStateToProps,
    null
)(AppNavBar);