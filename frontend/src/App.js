import React, { Component } from 'react';
import AppNavBar from './components/navbar';
import VendorMenuBar from './components/product/VendorMenuBar';
import CustomerView from './components/product/CustomerView';
import { connect } from 'react-redux';
import store from './store';
import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.min.css';
import { loadUser } from './actions/authAction';
import VendorListProducts from './components/product/VendorListProducts';
import { Container } from 'reactstrap';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser())
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    var renderView;
    if(this.props.auth.isAuthenticated) {
      if(this.props.auth.user.isVendor === true) {
        renderView = (
          <Container>
            <VendorMenuBar/>
            <VendorListProducts/>
          </Container>
        );
      } else {
        renderView = <CustomerView/>
      }
    }

    return (
        <div className='App'>
          <AppNavBar />
            { renderView }
        </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    auth: state.auth
  }
}

export default connect(
  mapStateToProps,
  null
)(App);