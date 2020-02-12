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
    Alert
} from 'reactstrap';

class RegisterModal extends Component {
    constructor() {
        super()
        this.state = {
            modal: false,
            name: "",
            email: "",
            password: "",
            isVendor: null,
            msg: null
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    onSelect(e) {
        this.setState({isVendor: e.target.value === 'Vendor' ? true : false});
        console.log(this.state.isVendor);
    }

    onSubmit(e) {
        e.preventDefault();

        const { name, email, password } = this.state;

        const newUser = {
            name,
            email,
            password
        }
    }

    render() {
        return(
            <div>
                <NavLink onClick={this.toggleModal} href='#'>Register</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Register</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (
                            <Alert color='danger'>{this.state.msg}</Alert>
                        ) : null}
                        <Form onSubmit={this.onSubmit}>
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
                                    type='text'
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
                            <Input
                                type='submit'
                                name='submit'
                                id='submit'
                                value='Submit'
                            />
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default RegisterModal;