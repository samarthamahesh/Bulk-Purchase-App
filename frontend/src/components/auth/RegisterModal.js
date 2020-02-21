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
import { register } from '../../actions/authAction';
import { clearErrors } from '../../actions/msgActions';
import { REGISTER_FAIL, REGISTER_SUCCESS, GET_SUCCESS, GET_ERRORS } from '../../actions/actionTypes';

class RegisterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            name: "",
            email: "",
            password: "",
            isVendor: null,
            msg: null
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        msg: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    toggleModal() {
        this.props.clearErrors();
        this.setState({
            isOpen: !this.state.isOpen,
            name: "",
            email: "",
            password: "",
            isVendor: null,
            msg: null,
            ismsgError: null
        });
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSelect(e) {
        if(e.target.value === 'Vendor') {
        this.setState({
                isVendor: true
            })
        } else if(e.target.value === 'Customer') {
            this.setState({
                isVendor: false
            })
        } else {
            this.setState({
                isVendor: null
            })
        }
    }

    componentDidUpdate(prevProps) {
        const msg = this.props.msg;
        if(msg !== prevProps.msg) {
            if (msg.isError === true && msg.id == GET_ERRORS) {
                this.setState({ msg: msg.msg.msg, ismsgError: true });
            } else if (msg.isError === false && msg.id == GET_SUCCESS) {
                this.setState({ msg: msg.msg.msg, ismsgError: false })
            } else {
                this.setState({ msg: null, ismsgError: null })
            }
        }
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            isVendor: this.state.isVendor
        };

        this.props.register(newUser);

        document.getElementById('register_form').reset();
    }

    render() {
        var statusBar;
        if(this.state.msg) {
            if(this.state.ismsgError) {
                statusBar = <Alert color='danger'>{ this.state.msg }</Alert>
            } else {
                statusBar = <Alert color='success'>{ this.state.msg }</Alert>
            }
        } else {
            statusBar = ''
        }

        return(
            <div>
                <NavLink onClick={this.toggleModal} href='#'>Register</NavLink>
                <Modal isOpen={this.state.isOpen} size='lg' toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Register</ModalHeader>
                    <ModalBody>
                        { statusBar }
                        <Form onSubmit={this.onSubmit} id='register_form'>
                            <FormGroup>
                                <Label for='name'>Name</Label>
                                <Input
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='Name'
                                    className='mb-3'
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for='email'>Email</Label>
                                <Input
                                    type='email'
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
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        type='radio'
                                        name='user'
                                        value='Customer'
                                        onChange={this.onSelect}
                                    />
                                    Customer
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        type='radio'
                                        name='user'
                                        value='Vendor'
                                        onChange={this.onSelect}
                                    />
                                    Vendor
                                </Label>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={ this.onSubmit }>Submit</Button>
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
    { register, clearErrors }
)(RegisterModal);