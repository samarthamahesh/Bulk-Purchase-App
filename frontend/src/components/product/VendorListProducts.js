import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { listProducts, statusProduct } from '../../actions/productActions';
import { Container, Button, Card, CardBody, CardText, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import { PRODUCT_WAITING, PRODUCT_DISPATCH_READY, PRODUCT_DISPATCHED, PRODUCT_DELETED } from '../../actions/actionTypes';
import axios from 'axios';
import StarRatingComponent from "react-star-rating-component";

class VendorListProducts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: null,
            product_status: null,
            selected_product_id: null,
            reviewModal: false,
        }

        this.dispatchProduct = this.dispatchProduct.bind(this);
        this.readyToDispatch = this.readyToDispatch.bind(this);
        this.delete = this.delete.bind(this);
        this.openReview = this.openReview.bind(this);
        this.toggleReview = this.toggleReview.bind(this);
        this.listReviews = this.listReviews.bind(this);
    }

    componentDidMount() {
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_WAITING)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            product_status: nextProps.product.result.product_status,
            products: nextProps.product.result.search_products
        });
    }

    listReviews(product) {
        axios.get(`http://localhost:5000/api/product/reviews/${product._id}`)
            .then(res => {
                this.setState({
                    reviews: res.data.reviews
                })
            })
    }
    
    openReview(e) {
        const product = this.state.products.find(ele => ele._id === e.target.value)
        this.setState({
            reviewModal: true,
            selectedReview: product
        })
        this.listReviews(product)
    }

    toggleReview() {
        this.setState({
            reviewModal: !this.state.reviewModal
        })
    }

    readyToDispatch(e) {
        const product = this.state.products.find(element => element._id === e.target.value);
        this.props.statusProduct(product, PRODUCT_DISPATCH_READY);
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_WAITING)
    }

    dispatchProduct(e) {
        const product = this.state.products.find(element => element._id === e.target.value);
        this.props.statusProduct(product, PRODUCT_DISPATCHED);
        this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_DISPATCH_READY)
    }

    delete(e) {
        const product = this.state.products.find(element => element._id === e.target.value);
        this.props.statusProduct(product, PRODUCT_DELETED);
        if(this.state.product_status === PRODUCT_WAITING) {
            this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_WAITING)
        } else if(this.state.product_status === PRODUCT_DISPATCH_READY) {
            this.props.listProducts('vendor._id', this.props.auth.user._id, PRODUCT_DISPATCH_READY)
        }
    }

    render() {
        var cardProducts;
        if(this.state.products) {
            if(this.state.product_status == PRODUCT_WAITING) {
                cardProducts = this.state.products.map((product) =>
                    <Row>
                        <Col sm='12' md={{ size: 6, offset: 3 }}>
                            <Card className='mt-5'>
                                <CardBody>
                                    <CardText>Product Name : <strong>{ product.product_name }</strong></CardText>
                                    <CardText>Product Bundle Price : <strong>{ product.bundle_price == 0 ? this.update : product.bundle_price }</strong></CardText>
                                    <CardText>Product Bundles Remaining : <strong>{ product.bundle_quantity }</strong></CardText>
                                    <Button color='danger' value={ product._id } onClick={this.delete}>Delete</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            } else if(this.state.product_status == PRODUCT_DISPATCH_READY) {
                cardProducts = this.state.products.map((product) =>
                    <Row>
                        <Col sm='12' md={{ size: 6, offset: 3 }}>
                            <Card className='mt-5'>
                                <CardBody>
                                    <CardText>Product Name : <strong>{ product.product_name }</strong></CardText>
                                    <CardText>Product Bundle Price : <strong>{ product.bundle_price }</strong></CardText>
                                    <Button color='info' value={ product._id } className='float-left' onClick={this.dispatchProduct}>Dispatch</Button>
                                    <Button color='danger' value={ product._id } className='float-right' onClick={this.delete}>Delete</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            } else if(this.state.product_status == PRODUCT_DISPATCHED) {
                cardProducts = this.state.products.map((product) =>
                    <Row>
                        <Col sm='12' md={{ size: 6, offset: 3 }}>
                            <Card className='mt-5'>
                                <CardBody>
                                    <CardText>Product Name : <strong>{ product.product_name }</strong></CardText>
                                    <CardText>Product Bundle Price : <strong>{ product.bundle_price }</strong></CardText>
                                    <CardText>Product Rating :
                                        <StarRatingComponent
                                            editing={false}
                                            starCount={5}
                                            value={product.rating_sum / product.total_ratings}
                                        />
                                        ({(product.rating_sum / product.total_ratings).toFixed(3)})
                                    </CardText>
                                    <CardText>
                                        <Button color='info' value={ product._id } onClick={this.openReview}>Product Reviews</Button>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            }
        } else {
            cardProducts = ""
        }

        var elements = []
        if(this.state.reviews){
            for(var i=0;i<this.state.reviews.length;i++) {
                elements.push(<li>{this.state.reviews[i]}</li>)
            }
        }

        return (
            <Container>
                <br/><br/>
                { cardProducts }
                <br/><br/>
                <Modal isOpen={this.state.reviewModal} size='lg' toggle={this.toggleReview}>
                    <ModalHeader toggle={this.toggleReview}>Reviews</ModalHeader>
                    <ModalBody>
                        <ul>
                            {elements}
                        </ul>
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        auth: state.auth,
        product: state.product
    }
}

export default connect(
    mapStateToProps,
    { listProducts, statusProduct }
)(VendorListProducts);