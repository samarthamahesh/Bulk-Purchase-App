import React, { Component } from "react";
import { Container, Form, FormGroup, Input, Button, Label, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap";
import { connect } from "react-redux";
import { addProduct, listProducts } from '../../actions/productActions';
import { clearErrors } from '../../actions/msgActions';
import { GET_ERRORS, GET_SUCCESS, PRODUCT_WAITING, PRODUCT_DISPATCH_READY, PRODUCT_DISPATCHED } from "../../actions/actionTypes";

class VendorMenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_isOpen: false,
            modal_product_name: null,
            modal_bundle_price: null,
            modal_bundle_quantity: null,
            modal_msg: null,
            modal_ismsgError: null,
            show_dropdown_isOpen: false,
            show_page: null
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showList = this.showList.bind(this);
        this.showReadyProducts = this.showReadyProducts.bind(this);
        this.showDispatchedProducts = this.showDispatchedProducts.bind(this);
        this.showToggle = this.showToggle.bind(this);
    }

    componentDidUpdate(prevProps) {
        const msg = this.props.msg;
        if(msg != prevProps.msg) {
            if(msg.isError === true && msg.id == GET_ERRORS) {
                this.setState({
                    modal_msg: msg.msg.msg,
                    modal_ismsgError: true
                });
            } else if(msg.isError === false && msg.id == GET_SUCCESS) {
                this.setState({
                    modal_msg: msg.msg.msg,
                    modal_ismsgError: false
                })
            } else {
                this.setState({
                    modal_msg: null,
                    modal_ismsgError: null
                })
            }
        }
    }

    toggleModal() {
        this.props.clearErrors();

        this.setState({
            modal_isOpen: !this.state.modal_isOpen
        });
    }

    onChange(e) {
        this.setState({
            modal_isOpen: true,
            [e.target.name]: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const newProduct = {
            product_name: this.state.modal_product_name,
            bundle_price: this.state.modal_bundle_price,
            bundle_quantity: this.state.modal_bundle_quantity,
            vendor: this.props.auth.user
        }

        this.props.addProduct(newProduct);

        document.getElementById('add_product_form').reset();

        this.setState({
            modal_product_name: null,
            modal_bundle_price: null,
            modal_bundle_quantity: null
        })
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_WAITING)
    }

    showToggle() {
        this.setState({
            show_dropdown_isOpen: !this.state.show_dropdown_isOpen
        })
    }

    showList() {
        this.setState({
            show_page: 0
        })
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_WAITING);
    }

    showReadyProducts() {
        this.setState({
            show_page: 1
        })
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_DISPATCH_READY);
    }

    showDispatchedProducts() {
        this.setState({
            show_page: 2
        })
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_DISPATCHED);
    }

    render() {
        var statusBar;
        if(this.state.modal_msg) {
            if(this.state.modal_ismsgError) {
                statusBar = <Alert color='danger'>{ this.state.modal_msg }</Alert>
            } else {
                statusBar = <Alert color='success'>{ this.state.modal_msg }</Alert>
            }
        } else {
            statusBar = ''
        }

        return (
            <div className='container'>
                <Button onClick={this.toggleModal} className='float-left'>Add Product</Button>
                <ButtonDropdown direction='down' isOpen={ this.state.show_dropdown_isOpen } toggle={ this.showToggle } className='float-right'>
                    <DropdownToggle caret>
                        Show Products
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Select an option</DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem onClick={ this.showList }>Waiting</DropdownItem>
                        <DropdownItem onClick={ this.showReadyProducts }>Ready For Dispatch</DropdownItem>
                        <DropdownItem onClick={ this.showDispatchedProducts }>Dispatched</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
                <Modal isOpen={ this.state.modal_isOpen } size='lg' toggle={ this.toggleModal }>
                    <ModalHeader toggle={ this.toggleModal }>Add Product</ModalHeader>
                    <ModalBody>
                        { statusBar }
                        <Form onSubmit={ this.onSubmit } id='add_product_form'>
                            <FormGroup>
                                <Label for="product_name">Product Name</Label>
                                <Input
                                    type='text'
                                    name='modal_product_name'
                                    id='product_name'
                                    placeholder='Product Name'
                                    className='mb-3'
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                            <Label for="bundle_price">Product Bundle Price</Label>
                                <Input
                                    type='number'
                                    name='modal_bundle_price'
                                    id='bundle_price'
                                    placeholder='Product Bundle Price'
                                    className='mb-3'
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                            <Label for="bundle_quantity">Product Bundle Quantity</Label>
                                <Input
                                    type='number'
                                    name='modal_bundle_quantity'
                                    id='bundle_quantity'
                                    placeholder='Product Bundle Quantity'
                                    className='mb-3'
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={this.onSubmit}>Add</Button>
                        <Button color='secondary' onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        auth: state.auth,
        msg: state.msg,
        product: state.product
    }
}

export default connect(
    mapStateToProps,
    { addProduct, clearErrors, listProducts }
)(VendorMenuBar);