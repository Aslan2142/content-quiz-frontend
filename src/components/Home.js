import React from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom'
import { Container, Card, Button, ButtonGroup, InputGroup, FormControl, Modal, Toast } from 'react-bootstrap';
import { PlusSquareFill } from 'react-bootstrap-icons';

import { RootPath, BackendUrl } from '../AppSettings';

class Home extends React.Component {

    state = {
        quizUuid: '',
        quizExists: null,
        toastMessage: '',
        showToast: false,
        showModal: false
    }

    checkingTimeout = false;

    addNewQuiz = () => {
        Axios.post(BackendUrl + 'api/v1/quiz', { name: "", questions: [] }).then((response) => {
            if (response.status === 200) {
                this.props.history.push(RootPath + '/editquiz/' + response.data);
            } else {
                this.setState({
                    toastMessage: "Quiz couldn't be added",
                    showToast: true
                });
            }
        }).catch(() => {
            this.setState({
                toastMessage: "Quiz couldn't be added",
                showToast: true
            });
        });
    }

    updateQuizUuid = (newQuizUuid) => {
        this.setState({
            quizUuid: newQuizUuid
        });

        this.checkQuiz();
    }

    checkQuiz = () => {
        if (this.checkingTimeout) return;
        this.checkingTimeout = true;

        this.setState({
            quizExists: null
        });

        setTimeout(() => {
            Axios.get(BackendUrl + 'api/v1/quiz/' + this.state.quizUuid).then((response) => {
                this.setState({
                    quizExists: response.data !== ""
                });
                this.checkingTimeout = false;
            }).catch(() => {
                this.checkingTimeout = false;
            });
        }, 500);
    }

    takeQuiz = () => {
        this.props.history.push(RootPath + '/quiz/' + this.state.quizUuid);
    }

    editQuiz = () => {
        this.props.history.push(RootPath + '/editquiz/' + this.state.quizUuid);
    }

    showResults = () => {
        this.props.history.push(RootPath + '/results/' + this.state.quizUuid);
    }

    deleteQuiz = () => {
        this.setState({
            showModal: false
        });

        Axios.delete(BackendUrl + 'api/v1/quiz/' + this.state.quizUuid).then((response) => {
            if (response.status === 200) {
                this.setState({
                    toastMessage: "Quiz has been successfully deleted",
                    showToast: true
                });
                this.checkQuiz();
            } else {
                this.setState({
                    toastMessage: "Quiz couldn't be deleted",
                    showToast: true
                });
            }
        }).catch(() => {
            this.setState({
                toastMessage: "Quiz couldn't be deleted",
                showToast: true
            });
        });
    }

    buttonsDisabled = () => {
        return this.state.quizUuid === '' || !this.state.quizExists;
    }

    closeToast = () => {
        this.setState({
            showToast: false
        });
    }

    toastMessage = () => {
        return (
            <Toast style={{ zIndex: 999, position: "fixed", bottom: 50, left: 50 }} onClose={this.closeToast} show={this.state.showToast} delay={6000} animation autohide>
                <Toast.Header>
                    <strong className="mr-auto">Content Quiz</strong>
                </Toast.Header>
                <Toast.Body>{this.state.toastMessage}</Toast.Body>
            </Toast>
        )
    }

    modalMessage = () => {
        return (
            <Modal show={this.state.showModal} onHide={() => { this.setState({ showModal: false }) }} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Delete the Quiz?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the quiz? ({this.state.quizUuid})</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { this.setState({ showModal: false }) }}>Cancel</Button>
                    <Button variant="primary" onClick={this.deleteQuiz}>Delete</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    quizCheckMessage = () => {
        let message = "";

        if (this.state.quizExists !== null) {
            message = this.state.quizExists ? "" : "Quiz not found!";
        }

        if (message === "") {
            return null;
        } else {
            return (
                <InputGroup.Append>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">{message}</InputGroup.Text>
                </InputGroup.Append>
            )
        }
    }

    render() {
        return (
            <div>
                <this.toastMessage />
                <this.modalMessage />

                <Container fluid="lg" className="mt-5">
                    <Card className="text-center mt-5" bg="dark">
                        <Card.Body>

                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text className="bg-secondary text-light border-secondary">Quiz ID</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.updateQuizUuid(e.target.value); }} value={this.state.quizUuid} placeholder="Enter the ID of the Quiz"></FormControl>
                                <this.quizCheckMessage />
                            </InputGroup>

                            <ButtonGroup className="mt-3 d-flex">
                                <Button variant="info" onClick={this.takeQuiz} disabled={this.buttonsDisabled()}>Take the Quiz</Button>
                                <Button variant="info" onClick={this.editQuiz} disabled={this.buttonsDisabled()}>Edit the Quiz</Button>
                                <Button variant="info" onClick={this.showResults} disabled={this.buttonsDisabled()}>Show Results</Button>
                                <Button variant="danger" onClick={() => { this.setState({ showModal: true }) }} disabled={this.buttonsDisabled()}>Delete the Quiz</Button>
                            </ButtonGroup>

                        </Card.Body>
                    </Card>

                    <Card className="text-center mt-5" bg="dark">
                        <Card.Body>

                            <Button variant="info" onClick={this.addNewQuiz} block>Add a new Quiz <PlusSquareFill className="ml-1 mb-1 mt-1" size={20} /></Button>

                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }

}

export default withRouter(Home);