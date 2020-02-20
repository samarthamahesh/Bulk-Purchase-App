import React, { Component } from "react";
import { Container, Badge, Row, Col } from "reactstrap";

export default class Welcome extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm='12' md={{ size: 10, offset: 3 }}>
                        <br/><br/>
                        <h2>Welcome to <strong>Bulk Purchase Application</strong></h2>
                        <h5><i>"Buy More, Pay Less"</i></h5>
                        <br/><br/>
                        <h4>Not Registered? <Badge>Register</Badge> yourself today</h4>
                        <br/>
                        <h4>Registered? <Badge>Login</Badge> to manage your account</h4>
                    </Col>
                </Row>
            </Container>
        )
    }
}