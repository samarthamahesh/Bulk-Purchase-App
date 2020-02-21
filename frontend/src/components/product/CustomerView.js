import React, { Component, Fragment } from "react";
import { Container, Form, FormGroup, Input, Button, Card, CardBody, CardTitle, CardSubtitle, CardText, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap";
import { connect } from "react-redux";
import { orderProduct, listOrderedProducts, listUnorderedProducts } from '../../actions/productActions';
import { SORT_BY_PRICE, SORT_BY_QUANTITY, SORT_BY_RATING, ORDER_FAIL, ORDER_SUCCESS, ORDER_WAITING, ORDER_PLACED, ORDER_DISPATCHED, ORDER_CANCELLED, PRODUCT_DISPATCHED, PRODUCT_WAITING, PRODUCT_DISPATCH_READY, PRODUCT_DELETED } from '../../actions/actionTypes';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import StarRatingComponent from 'react-star-rating-component';
import starRatings from "react-star-ratings/build/star-ratings";

class CustomerView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search_string: '',
            cardItems: null,
            orderItems: null,
            sortButton_isOpen: false,
            orderModal_isOpen: false,
            orderModal_product_name: null,
            orderModal_bundle_price: null,
            orderModal_bundle_quantity: null,
            orderModal_order_quantity: null,
            orderModal_msg: null,
            orderModal_msgType: null,
            editModal_isOpen: null,
            selected_product: null,
            msg: null,
            ismsgError: null,
            placed: null,
            searchButton: null,
            star_isopen: false,
            vendor_rating: null,
            diff: null,
            selectededitorder: null,
            review_isopen: null,
            editplaced: null,
            review: null,
            reviewsubmitted: null,
            reviewmsg: null,
            editSubmitted: false,
            vendorModal: false,
            selectedVendorReview: null,
            vendorReviews: null
        }

        this.onChange = this.onChange.bind(this);
        this.listProducts = this.listProducts.bind(this);
        this.listOrderedProducts = this.listOrderedProducts.bind(this);
        this.sortToggle = this.sortToggle.bind(this);
        this.editModalToggle = this.editModalToggle.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.sort = this.sort.bind(this);
        this.sortRating = this.sortRating.bind(this);
        this.onClickSort = this.onClickSort.bind(this);
        this.onChangeOrderQuantity = this.onChangeOrderQuantity.bind(this);
        this.orderModalToggle = this.orderModalToggle.bind(this);
        this.updateSelectedModal = this.updateSelectedModal.bind(this);
        this.update = this.update.bind(this);
        this.convertToName = this.convertToName.bind(this);
        this.starToggle = this.starToggle.bind(this);
        this.productstarToggle = this.productstarToggle.bind(this);
        this.changeRating = this.changeRating.bind(this);
        this.changeproductRating = this.changeproductRating.bind(this);
        this.submitproductRating = this.submitproductRating.bind(this);
        this.submitRating = this.submitRating.bind(this);
        this.updateStarModal = this.updateStarModal.bind(this);
        this.updateproductStarModal = this.updateproductStarModal.bind(this);
        this.editorder = this.editorder.bind(this);
        this.onChangeEditQuantity = this.onChangeEditQuantity.bind(this);
        this.openeditModal = this.openeditModal.bind(this);
        this.openReviewModal = this.openReviewModal.bind(this);
        this.reviewModalToggle = this.reviewModalToggle.bind(this);
        this.onChangeReview = this.onChangeReview.bind(this);
        this.submitreview = this.submitreview.bind(this);
        this.updateVendorModal = this.updateVendorModal.bind(this);
        this.toggleVendor = this.toggleVendor.bind(this);
        this.listReviews = this.listReviews.bind(this);
    }

    componentDidUpdate(prevProps) {
        const msg = this.props.msg;
        if(msg !== prevProps.msg) {
            if (msg.isError === true && msg.id == ORDER_FAIL) {
                this.setState({ msg: msg.msg.msg, ismsgError: true });
            } else if (msg.isError === false && msg.id == ORDER_SUCCESS) {
                this.setState({ msg: msg.msg.msg, ismsgError: false, placed: true })
            } else {
                this.setState({ msg: null, ismsgError: null })
            }
        }
    }

    openReviewModal(e) {
        const order = this.state.orderItems.find(ele => ele._id === e.target.value)
        this.setState({
            review_isopen: true,
            selectedrevieworder: order
        })
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeReview(e) {
        this.setState({
            review: e.target.value
        })
    }

    listProducts() {
        this.setState({
            searchButton: true
        })
        this.props.listUnorderedProducts(this.state.search_string, this.props.user);
    }

    listOrderedProducts() {
        this.setState({
            searchButton: false
        })
        const user = this.props.user;
        this.props.listOrderedProducts(user);
    }

    componentDidMount() {
        this.setState({
            search_string: '',
            cardItems: null,
            orderItems: null,
            sortButton_isOpen: false,
            orderModal_isOpen: false,
            orderModal_product_name: null,
            orderModal_bundle_price: null,
            orderModal_bundle_quantity: null,
            orderModal_order_quantity: null,
            orderModal_msg: null,
            orderModal_msgType: null,
            editModal_isOpen: null,
            selected_product: null,
            msg: null,
            ismsgError: null,
            placed: null,
            searchButton: null,
            star_isopen: false,
            productstar_isopen: null,
            vendor_rating: null,
            product_rating: null,
            diff: null,
            selectededitorder: null,
            review_isopen: null,
            editplaced: null,
            review: null,
            reviewsubmitted: null,
            reviewmsg: null
        })
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.product.result) {
            if(this.state.searchButton) {
                this.setState({
                    cardItems: nextProps.product.result.search_products
                });
            } else if(!this.state.searchButton) {
                this.setState({
                    orderItems: nextProps.product.result.orders
                })

            }
        }
    }

    sortToggle() {
        this.setState({
                sortButton_isOpen: !this.state.sortButton_isOpen
        })
    }

    onClickSort(e) {
        if(this.state.cardItems) {
            if(e.target.value == SORT_BY_PRICE) {
                this.sort('bundle_price');
            } else if(e.target.value == SORT_BY_QUANTITY) {
                this.sort('bundle_quantity');
            } else if(e.target.value == SORT_BY_RATING) {
                this.sortRating();
            }
        }
    }

    onChangeOrderQuantity(e) {
        this.setState({
            orderModal_order_quantity: e.target.value
        });
    }

    submitreview() {
        const body = {
            order_id: this.state.selectedrevieworder._id,
            review: this.state.review
        }

        axios.post('http://localhost:5000/api/order/submitreview', body)
        this.setState({
            reviewsubmitted: true,
            reviewmsg: 'Review Submitted, Thank You'
        })
    }

    onChangeEditQuantity(e) {
        this.setState({
            diff: e.target.value - this.state.selectededitorder.quantity
        });
    }

    submitOrder(e) {
        const order = {
            customer: this.props.user,
            product: this.state.selected_product,
            quantity: this.state.orderModal_order_quantity,
            status: ORDER_WAITING
        }

        if(order.quantity > this.state.selected_product.bundle_quantity) {
            this.setState({
                msg: "Order quantity cannot be more than bundle quantity left",
                ismsgError: true
            });
        } else if(order.quantity == null || order.quantity == '' || order.quantity == 0) {
            this.setState({
                msg: "Order quantity cannot be empty",
                ismsgError: true
            });
        } else {
            this.props.orderProduct(order);
            this.props.listUnorderedProducts(this.state.search_string, this.props.user);
        }
    }

    editorder() {
        const body = {
            order: this.state.selectededitorder,
            diff: this.state.diff
        }
        this.setState({
            editSubmitted: true
        })
        axios.post('http://localhost:5000/api/order/edit', body)
            .then(result => {
                this.props.listOrderedProducts(this.props.user);
            })
    }

    sort(field) {
        this.state.cardItems.sort((a, b) => {
            var x = a[field];
            var y = b[field];
            return ((x<y) ? -1 : ((x>y) ? 1 : 0));
        });
    }

    sortRating() {
        this.state.cardItems.sort((a, b) => {
            var x = a.vendor.rating_sum / a.vendor.total_ratings;
            var y = b.vendor.rating_sum / b.vendor.total_ratings;
            return ((x<y) ? -1 : ((x>y) ? 1 : 0));
        });
    }

    orderModalToggle() {
        this.setState({
                orderModal_isOpen: !this.state.orderModal_isOpen,
                placed: null,
                orderModal_msg: null,
                msg: null,
                ismsgError: null
        })
    }

    editModalToggle() {
        this.setState({
                editModal_isOpen: !this.state.editModal_isOpen,
                editSubmitted: false
        })
    }

    openeditModal(e) {
        const order = this.state.orderItems.find(ele => ele._id === e.target.value)
        this.setState({
            editModal_isOpen: true,
            selectededitorder: order
        })
    }

    update(product) {
        this.setState({
            selected_product: product
        })
    }

    updateSelectedModal(e) {
        const product = this.state.cardItems.find(element => element._id === e.target.value)
        this.update(product)
        this.orderModalToggle();
    }

    convertToName(val) {
        if(val === ORDER_WAITING) {
            return 'WAITING'
        } else if(val === ORDER_PLACED) {
            return 'PLACED'
        } else if(val === ORDER_DISPATCHED) {
            return 'DISPATCHED'
        } else if(val === ORDER_CANCELLED) {
            return 'CANCELLED'
        }
    }

    starToggle() {
        this.setState({
            star_isopen: !this.state.star_isopen,
            vendor_rating: null
        })
    }

    productstarToggle() {
        this.setState({
            productstar_isopen: !this.state.productstar_isopen,
            product_rating: null
        })
    }

    reviewModalToggle() {
        this.setState({
            review_isopen: !this.state.review_isopen,
            reviewsubmitted: false
        })
    }

    updateStarModal(e) {
        const order = this.state.orderItems.find(ele => ele._id === e.target.value)
        this.setState({
            selectedorder: order
        })
        this.starToggle()
    }

    updateproductStarModal(e) {
        const order = this.state.orderItems.find(ele => ele._id === e.target.value)
        this.setState({
            selectedorder: order
        })
        this.productstarToggle()
    }

    changeRating(newRating, prevValue, name) {
        this.setState({
            vendor_rating: newRating
        })
    }

    changeproductRating(newRating, prevValue, name) {
        this.setState({
            product_rating: newRating
        })
    }

    submitRating(e) {
        var obj = {}

        obj['order_id'] = this.state.selectedorder._id;
        obj['rating'] = this.state.vendor_rating;
        obj['vendor_id'] = this.state.selectedorder.product.vendor._id;

        const user = this.props.user;

        axios
            .post('http://localhost:5000/api/order/updateVendorRating', obj)
            .then(this.props.listOrderedProducts(user))
            .then(this.starToggle())
    }

    submitproductRating(e) {
        var obj = {}

        obj['order'] = this.state.selectedorder;
        obj['rating'] = this.state.product_rating;

        const user = this.props.user;

        axios
            .post('http://localhost:5000/api/order/updateProductRating', obj)
            .then(this.props.listOrderedProducts(user))
            .then(this.productstarToggle())
    }

    listReviews(vendor) {
        axios.get(`http://localhost:5000/api/product/vendorReviews/${vendor._id}`)
            .then(res => {
                console.log(this.state.vendorReviews)
                this.setState({
                    vendorReviews: res.data.reviews
                })
            })
    }

    updateVendorModal(e) {
        const vendor = this.state.cardItems.find(ele => ele.vendor._id === e.target.value).vendor
        this.setState({
            vendorModal: true,
            selectedVendorReview: vendor
        })
        this.listReviews(vendor)
    }

    toggleVendor() {
        this.setState({
            vendorModal: !this.state.vendorModal
        })
    }

    render() {
        var msgBar;
        if(this.state.msg) {
            if(this.state.ismsgError) {
                msgBar = <Alert color='danger'>{ this.state.msg }</Alert>
            } else {
                msgBar = <Alert color='success'>{ this.state.msg }</Alert>
            }
        } else {
            msgBar = ''
        }

        var cardProducts;
        if(this.state.cardItems && this.state.searchButton) {
            cardProducts = this.state.cardItems.map((product) =>
            <Row>
                <Col sm='12' md={{ size: 6, offset: 3 }}>
                    <Card className='mt-5'>
                        <CardBody>
                            <CardText>Vendor Name : <strong>{ product.vendor.name }</strong></CardText>
                            <CardText>Product Name : <strong>{ product.product_name }</strong></CardText>
                            <CardText>Product Bundle Price : <strong>{ product.bundle_price }</strong></CardText>
                            <CardText>Product Bundles Remaining : <strong>{ product.bundle_quantity }</strong></CardText>
                            { <CardText>Vendor Rating : 
                                <StarRatingComponent
                                    editing={false}
                                    starCount={5}
                                    value={product.vendor.rating_sum / product.vendor.total_ratings}
                                />
                                ({(product.vendor.rating_sum / product.vendor.total_ratings).toFixed(3)})
                            </CardText> }
                            <Button color='info' value={ product._id } onClick={ this.updateSelectedModal } className='float-left'>Order</Button>
                            <Button color='warning' value={ product.vendor._id } onClick={ this.updateVendorModal } className='float-right'>Vendor Products Reviews</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            )
        } else if(this.state.orderItems && !this.state.searchButton) {
            cardProducts = this.state.orderItems.map((order) => 
            <Row>
                <Col sm='12' md={{ size: 6, offset: 3 }}>
                    <Card className='mt-5'>
                        <CardBody>
                            <CardTitle>Order Status : <strong>{ this.convertToName(order.status) }</strong></CardTitle>
                            <CardText>Vendor Name : <strong>{ order.product.vendor.name }</strong></CardText>
                            <CardText>Product Name : <strong>{ order.product.product_name }</strong></CardText>
                            <CardText>Order Quantity : <strong>{ order.quantity }</strong></CardText>
                            { <CardText>Vendor Rating : 
                                <StarRatingComponent
                                    editing={false}
                                    starCount={5}
                                    value={order.product.vendor.rating_sum / order.product.vendor.total_ratings}
                                />
                                ({(order.product.vendor.rating_sum / order.product.vendor.total_ratings).toFixed(3)})
                            </CardText>}
                            { order.status ===  ORDER_WAITING ? <CardText>Product Bundle Quantity Left : <strong>{ order.product.bundle_quantity }</strong></CardText> : ''}
                            { order.status === ORDER_WAITING ? <Button className='mb-3' color='warning' value={ order._id } onClick={this.openeditModal}>Edit Order</Button> : ''}
                            { !order.vendor_rating ? <Button className='float-right' value={order._id} color='info' onClick={this.updateStarModal}>Rate the Vendor</Button> : ''}
                            <br/><br/>
                            <CardText>
                                { order.status === ORDER_DISPATCHED && !order.product_rating ? <Button className='mb-3 float-left' color='info' value={ order._id } onClick={this.updateproductStarModal}>Rate Product</Button> : ''}
                                { order.status === ORDER_DISPATCHED && !order.product_review ? <Button className='float-right' color='info' value={order._id} onClick={this.openReviewModal}>Add a Product Review</Button> : ''}
                            </CardText>
                            <CardText>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            )
        } else {
            cardProducts = ''
        }

        var orderDetails;
        if(this.state.placed) {
            orderDetails = '';
        } else {
            orderDetails = (
                <Fragment>
                    Vendor Name : <strong>{this.state.selected_product ? this.state.selected_product.vendor.name : ''}</strong>
                    <br/>
                    Product Name : <strong>{this.state.selected_product ? this.state.selected_product.product_name : ''}</strong>
                    <br/>
                    Product Bundle Price : <strong>{this.state.selected_product ? this.state.selected_product.bundle_price : ''}</strong>
                    <br/>
                    Product Bundle Quantity Left : <strong>{this.state.selected_product ? this.state.selected_product.bundle_quantity : ""}</strong>
                </Fragment>
            )
        }

        var inputQuantity;
        if(this.state.placed) {
            inputQuantity = '';
        } else {
            inputQuantity = (
                <Input
                    type='number'
                    name='orderModal_order_quantity'
                    id='order_quantity'
                    placeholder='Order Quantity'
                    className='mb-3'
                    onChange={this.onChangeOrderQuantity}
                />
            )
        }

        var inputEditQuantity;
        if(this.state.editplaced) {
            inputEditQuantity = '';
        } else {
            inputEditQuantity = (
                <Input
                    type='number'
                    placeholder='Edit Quantity'
                    className='mb-3'
                    onChange={this.onChangeEditQuantity}
                />
            )
        }

        var inputreview;
        if(this.state.reviewsubmitted) {
            inputreview = ''
        } else {
            inputreview = (
                <Input
                    type='text'
                    placeholder='Review'
                    className='mb-3'
                    onChange={this.onChangeReview}
                />
            )
        }

        var orderButton;
        if(this.state.placed) {
            orderButton = ''
        } else {
            orderButton = (
                <ModalFooter>
                    <Button color='primary' onClick={this.submitOrder}>Order</Button>
                </ModalFooter>
            )
        }

        var editButton;
        if(this.state.editplaced) {
            editButton = ''
        } else {
            editButton = (
                <ModalFooter>
                    <Button color='primary' onClick={this.editorder}>Edit Order</Button>
                </ModalFooter>
            )
        }

        var reviewButton;
        if(this.state.reviewsubmitted) {
            reviewButton = ''
        } else {
            reviewButton = (
                <ModalFooter>
                    <Button color='primary' onClick={this.submitreview}>Submit Review</Button>
                </ModalFooter>
            )
        }

        var starrating;
        if(this.state.selectedorder) {
            if(!this.state.selectedorder.vendor_rating) {
                starrating = (
                    <Fragment>
                        <StarRatingComponent
                            name='vendor_rating'
                            starCount={5}
                            value={this.state.vendor_rating}
                            onStarClick={this.changeRating}
                            />
                        <br/>
                        <Button color='primary' onClick={this.submitRating}>Submit</Button>
                    </Fragment>
                )
            } else {
                starrating = '';
            }
        } else {
            starrating = '';
        }

        var productstarrating;
        if(this.state.selectedorder) {
            if(!this.state.selectedorder.product_rating) {
                productstarrating = (
                    <Fragment>
                        <StarRatingComponent
                            name='product_rating'
                            starCount={5}
                            value={this.state.product_rating}
                            onStarClick={this.changeproductRating}
                            />
                        <br/>
                        <Button color='primary' onClick={this.submitproductRating}>Submit</Button>
                    </Fragment>
                )
            } else {
                productstarrating = '';
            }
        } else {
            productstarrating = '';
        }

        var editMessage;
        if(this.state.editSubmitted) {
            editMessage = <Alert color='success'>Edited Order Successfully</Alert>
        }

        var elements = [];
        if(this.state.vendorReviews) {
            for(var i=0;i<this.state.vendorReviews.length;i++) {
                var temp = [];
                for(var j=0;j<this.state.vendorReviews[i].reviews.length;j++) {
                    temp.push(<li>{this.state.vendorReviews[i].reviews[j]}</li>)
                }
                elements.push(<><Card><CardTitle className='m-3'><strong>Product Name : <i>{this.state.vendorReviews[i].product_name}</i></strong></CardTitle>
                {this.state.vendorReviews[i].total_ratings != 0 ? 
                <CardText className='m-3'><strong>Product Rating :</strong>
                    <StarRatingComponent
                        editing={false}
                        starCount={5}
                        value={this.state.vendorReviews[i].rating_sum / this.state.vendorReviews[i].total_ratings}
                    />
                    ({(this.state.vendorReviews[i].rating_sum / this.state.vendorReviews[i].total_ratings).toFixed(3)})
                </CardText> : ''}
                <CardTitle className='m-3'><strong>Reviews :</strong></CardTitle><ul>{temp}</ul></Card><br/></>)
            }
        }

        return (
            <div>
                <Container>
                    <Button color='info' className='float-right mb-3' onClick={this.listOrderedProducts}>My Orders</Button>
                    <Form>
                        <FormGroup>
                            <Input
                                type='text'
                                name='search_string'
                                placeholder='Product Name'
                                id='searchBar'
                                onChange={ this.onChange }
                            />
                        </FormGroup>
                    </Form>
                    <Modal isOpen={this.state.vendorModal} size='lg' toggle={this.toggleVendor}>
                        <ModalHeader toggle={this.toggleVendor}>Reviews and Ratings</ModalHeader>
                        <ModalBody>
                            {elements}
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={this.state.orderModal_isOpen} size='md' toggle={this.orderModalToggle}>
                        <ModalHeader toggle={this.orderModalToggle}>Order {this.state.orderModal_product_name}</ModalHeader>
                        <ModalBody>
                            { msgBar }
                            {orderDetails}
                            <br/><br/>
                            {inputQuantity}
                        </ModalBody>
                        {orderButton}
                    </Modal>
                    <Modal isOpen={this.state.editModal_isOpen} size='md' toggle={this.editModalToggle}>
                        <ModalHeader toggle={this.editModalToggle}>Edit Order</ModalHeader>
                        <ModalBody>
                            { editMessage }
                            {this.state.editSubmitted ? '' : inputEditQuantity}
                        </ModalBody>
                        {this.state.editSubmitted ? '' : editButton}
                    </Modal>
                    <Modal isOpen={this.state.review_isopen} size='md' toggle={this.reviewModalToggle}>
                        <ModalHeader toggle={this.reviewModalToggle}>Add Review</ModalHeader>
                        <ModalBody>
                            { this.state.reviewsubmitted ? <Alert color='success'>{this.state.reviewmsg}</Alert> : '' }
                            <br/>
                            {inputreview}
                        </ModalBody>
                        {reviewButton}
                    </Modal>
                    <Modal isOpen={this.state.star_isopen} size='sm' toggle={this.starToggle}>
                        <ModalHeader toggle={this.starToggle}>Rate Vendor</ModalHeader>
                        <ModalBody>
                            {starrating}
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={this.state.productstar_isopen} size='sm' toggle={this.productstarToggle}>
                        <ModalHeader toggle={this.productstarToggle}>Rate Product</ModalHeader>
                        <ModalBody>
                            {productstarrating}
                        </ModalBody>
                    </Modal>
                    <div id="search-bar">
                        <Button color='primary' onClick={ this.listProducts } className='float-left'>Search</Button>
                        <ButtonDropdown isOpen={ this.state.sortButton_isOpen } toggle={ this.sortToggle } className='float-right'>
                            <DropdownToggle caret>
                                Sort
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Select a field</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem onClick={ this.onClickSort } value={ SORT_BY_PRICE }>Bundle Price</DropdownItem>
                                <DropdownItem onClick={ this.onClickSort } value={ SORT_BY_QUANTITY }>Bundle Quantity Left</DropdownItem>
                                <DropdownItem onClick={ this.onClickSort } value={ SORT_BY_RATING }>Vendor Rating</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>
                    <br/>
                    <br/>
                    <div className='float-none'>
                        { cardProducts }
                    </div>
                    <br/><br/>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        user: state.auth.user,
        product: state.product,
        msg: state.msg
    }
}

export default connect(
    mapStateToProps,
    { orderProduct, listOrderedProducts, listUnorderedProducts }
)(CustomerView);