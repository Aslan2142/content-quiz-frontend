import React from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom'
import { Container, Button, InputGroup, FormControl, Toast } from 'react-bootstrap';

import QuizQuestion from './QuizQuestion';
import { RootPath, BackendUrl } from '../AppSettings';

class Quiz extends React.Component {

    state = {
        username: '',
        name: '',
        questions: [],
        answered: [],
        statusCode: 0,
        showToast: false
    }

    componentDidMount = () => {
        Axios.get(BackendUrl + 'api/v1/quiz/' + this.props.match.params.uuid).then((response) => {
            if (response.data === "") {
                this.props.history.push(RootPath + '/');
                return;
            }

            let answered = [];
            for (let i = 0; i < response.data.questions.length; i++) {
                answered.push(-1);
            }

            this.setState({
                name: response.data.name,
                questions: response.data.questions,
                answered
            });
        });
    }

    setAnswer = (questionIndex, answerIndex) => {
        let tmpAnswered = this.state.answered;

        tmpAnswered[questionIndex] = answerIndex;

        this.setState({
            answered: tmpAnswered
        });
    }

    updateUsername = (newUsername) => {
        this.setState({
            username: newUsername
        });
    }

    sendAnswers = () => {
        Axios.post(BackendUrl + 'api/v1/result', { quizuuid: this.props.match.params.uuid, username: this.state.username, answers: this.state.answered }).then((response) => {
            this.setState({
                statusCode: response.status,
                showToast: true
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
            <h1 className="text-center text-light">{this.state.name}</h1>
        )
    }

    questions = () => {
        return this.state.questions.map((question, index) => {
            return <QuizQuestion key={'question' + index} question={question} answered={this.state.answered[index]} index={index} setAnswer={this.setAnswer} />
        });
    }
    
    usernameField = () => {
        return (
            <InputGroup className="mt-5">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Your Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.updateUsername(e.target.value); }} value={this.state.username} placeholder="Enter your Name (at least 3 letters)"></FormControl>
            </InputGroup>
        )
    }

    sendButton = () => {
        if (this.state.questions.length === 0) {
            return null;
        }

        return (
            <Button className="mt-5 mb-5" variant="info" block onClick={this.sendAnswers} disabled={this.state.statusCode === 200 || this.state.username.length < 3}>Send Answers</Button>
        )
    }

    sendStatusToast = () => {
        let message;

        switch (this.state.statusCode) {
            case 200:
                message = "The Results were sent successfully";
                break;
            case -1:
                message = "Results couldn't be sent | Couldn't contact backend server";
                break;
            default:
                message = "Results couldn't be sent | Error " + this.state.statusCode;
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

                    <this.questions />

                    <this.usernameField />

                    <this.sendButton />

                </Container>
            </div>
        )
    }

}

export default withRouter(Quiz);