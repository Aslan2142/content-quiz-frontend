import React from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom'
import { Container, Button, InputGroup, FormControl, Toast } from 'react-bootstrap';

import Result from './Result';
import { RootPath, BackendUrl } from '../AppSettings';

class Results extends React.Component {

    state = {
        username: '',
        quiz: { name: '', questions: [] },
        results: [],
        statusCode: 0,
        showToast: false
    }

    componentDidMount = () => {
        Axios.get(BackendUrl + 'api/v1/quiz/' + this.props.match.params.uuid).then((response) => {
            if (response.data === "") {
                this.props.history.push(RootPath + '/');
                return;
            }
            this.setState({
                quiz: response.data
            });
        }).catch(() => {
            this.setState({
                statusCode: -1,
                showToast: true
            });
        });
    }

    updateUsername = (newUsername) => {
        this.setState({
            username: newUsername
        });
    }

    showResults = () => {
        Axios.get(BackendUrl + 'api/v1/result?quizUuid=' + this.props.match.params.uuid + '&username=' + this.state.username).then((response) => {
            if (response.status !== 200) {
                this.setState({
                    statusCode: response.status,
                    showToast: true
                });
                return;
            }
            if (response.data === "") {
                this.setState({
                    statusCode: -404,
                    showToast: true
                });
                return;
            }
            this.setState({
                results: response.data.answers
            });
        }).catch(() => {
            this.setState({
                statusCode: -1,
                showToast: true
            });
        });
    }

    closeToast = () => {
        this.setState({
            showToast: false
        });
    }
    
    nameField = () => {
        return (
            <h1 className="text-center text-light">{this.state.quiz.name} Results</h1>
        )
    }
    
    usernameField = () => {
        return (
            <InputGroup className="mt-5">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Username</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.updateUsername(e.target.value); }} onKeyPress={(e) => { if (e.charCode === 13 && this.state.username.length >= 3) this.showResults(); }} value={this.state.username} placeholder="Enter Name of the user (at least 3 letters)"></FormControl>
                <InputGroup.Append>
                    <Button variant="info" onClick={this.showResults} disabled={this.state.username.length < 3}>Show Results</Button>
                </InputGroup.Append>
            </InputGroup>
        )
    }

    results = () => {
        return this.state.quiz.questions.map((question, index) => {
            return <Result key={'result' + index} question={question} result={this.state.results[index]} index={index} />;
        });
    }

    sendStatusToast = () => {
        let message;

        switch (this.state.statusCode) {
            case -1:
                message = "Results couldn't be retrieved | Couldn't contact backend server";
                break;
            case -404:
                message = "Results couldn't be retrieved | Results for this Username were not found";
                break;
            default:
                message = "Results couldn't be retrieved | Error " + this.state.statusCode;
        }

        return (
            <Toast style={{ zIndex: 999, position: "fixed", bottom: 50, left: 50 }} onClose={this.closeToast} show={this.state.showToast} delay={6000} animation autohide>
                <Toast.Header>
                    <strong className="mr-auto">Content Quiz</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        )
    }

    render() {
        return (
            <div>
                <this.sendStatusToast />

                <Container fluid="lg" className="mt-5">

                    <this.nameField />

                    <this.usernameField />

                    <this.results />

                </Container>
            </div>
        )
    }

}

export default withRouter(Results);
