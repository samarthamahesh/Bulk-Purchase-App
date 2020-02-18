import React from 'react';
import { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert,
    ModalFooter
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/authAction';
import { clearErrors } from '../../actions/msgActions';
import { GET_ERRORS } from '../../actions/actionTypes';

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            email: "",
            password: "",
            msg: null
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        msg: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    toggleModal() {
        this.props.clearErrors();
        this.setState({
            isOpen: !this.state.isOpen,
            name: "",
            email: "",
            password: "",
            isVendor: "",
            msg: ""
        });
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidUpdate(prevProps) {
        const msg = this.props.msg;
        const isAuthenticated = this.props.isAuthenticated;
        if (msg !== prevProps.msg) {
            if (msg.id == GET_ERRORS) {
                this.setState({ msg: msg.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
    
        if (this.state.isOpen) {
            if (isAuthenticated) {
                this.toggle();
            }
        }
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            email: this.state.email,
            password: this.state.password,
        };

        this.props.login(newUser);

        document.getElementById('login_form').reset();
    }

    render() {
        return(
            <div>
                <NavLink onClick={this.toggleModal} href='#'>Login</NavLink>
                <Modal isOpen={this.state.isOpen} size='md' toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (
                            <Alert color='danger'>{this.state.msg}</Alert>
                        ) : null}
                        <Form onSubmit={this.onSubmit} id='login_form'>
                            <FormGroup>
                                <Label for='email'>Email</Label>
                                <Input
                                    type='text'
                                    name='email'
                                    id='email'
                                    placeholder='Email'
                                    className='mb-3'
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for='password'>Password</Label>
                                <Input
                                    type='password'
                                    name='password'
                                    id='password'
                                    placeholder='Password'
                                    className='mb-3'
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={ this.onSubmit }>Login</Button>
                        <Button color="secondary" onClick={ this.toggleModal }>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
};

const mapStateToProps = function(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        msg: state.msg
    }
};

export default connect(
    mapStateToProps,
    { login, clearErrors }
)(LoginModal);