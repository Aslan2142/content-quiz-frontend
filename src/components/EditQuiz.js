import React from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom'
import { Container, Card, Button, InputGroup, FormControl, Toast } from 'react-bootstrap';
import { PlusCircleFill, Check2Circle } from 'react-bootstrap-icons';

import EditQuizQuestion from './EditQuizQuestion';
import { RootPath, FrontendUrl, BackendUrl } from '../AppSettings';

class EditQuiz extends React.Component {

    state = {
        name: '',
        questions: [],
        statusCode: 0,
        linkCopied: false,
        showToast: false
    }

    copyTextBox = null;

    componentDidMount = () => {
        Axios.get(BackendUrl + 'api/v1/quiz/' + this.props.match.params.uuid).then((response) => {
            if (response.data === "") {
                this.props.history.push(RootPath + '/');
                return;
            }

            this.setState({
                name: response.data.name,
                questions: response.data.questions
            });
        });
    }

    updateName = (newName) => {
        this.setState({
            name: newName
        });
    }

    addQuestion = () => {
        let tmpQuestions = this.state.questions;

        tmpQuestions.push({
            text: '',
            link: '',
            answers: [
                "I love it",
                "I like it",
                "I don't mind it",
                "I don't like it"
            ]
        });

        this.setState({
            questions: tmpQuestions
        });
    }

    updateQuestionText = (questionIndex, newText) => {
        let tmpQuestions = this.state.questions;

        tmpQuestions[questionIndex].text = newText;

        this.setState({
            questions: tmpQuestions
        });
    }

    updateQuestionLink = (questionIndex, newLink) => {
        let tmpQuestions = this.state.questions;

        tmpQuestions[questionIndex].link = newLink;

        this.setState({
            questions: tmpQuestions
        });
    }

    removeQuestion = (questionIndex) => {
        let tmpQuestions = this.state.questions;

        tmpQuestions.splice(questionIndex, 1);

        this.setState({
            questions: tmpQuestions
        });
    }

    addAnswer = (questionIndex) => {
        let tmpQuestions = this.state.questions;

        tmpQuestions[questionIndex].answers.push("");

        this.setState({
            questions: tmpQuestions
        });
    }

    updateAnswer = (questionIndex, answerIndex, newText) => {
        let tmpQuestions = this.state.questions;

        tmpQuestions[questionIndex].answers[answerIndex] = newText;

        this.setState({
            questions: tmpQuestions
        });
    }

    removeAnswer = (questionIndex, answerIndex) => {
        let tmpQuestions = this.state.questions;

        tmpQuestions[questionIndex].answers.splice(answerIndex, 1);

        this.setState({
            questions: tmpQuestions
        });
    }

    saveQuiz = () => {
        Axios.put(BackendUrl + 'api/v1/quiz/' + this.props.match.params.uuid, { name: this.state.name, questions: this.state.questions }).then((response) => {
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

    copyQuizLink = () => {
        this.copyTextBox.select();
        document.execCommand('copy');

        this.setState({
            linkCopied: true
        });
    }

    closeToast = () => {
        this.setState({
            showToast: false
        });
    }

    nameField = () => {
        return (
            <InputGroup className="mt-5">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Quiz Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.updateName(e.target.value); }} value={this.state.name} placeholder="The Name of the Quiz"></FormControl>
            </InputGroup>
        )
    }

    questions = () => {
        return this.state.questions.map((question, index) => {
            return <EditQuizQuestion key={'question' + index} question={question} index={index} updateQuestionText={this.updateQuestionText} updateQuestionLink={this.updateQuestionLink} removeQuestion={this.removeQuestion} addAnswer={this.addAnswer} updateAnswer={this.updateAnswer} removeAnswer={this.removeAnswer} />
        });
    }

    questionAdder = () => {
        let header = this.state.questions.length === 0 ? 'No Questions' : 'Add a new Question';
        let text = this.state.questions.length === 0 ? 'You haven\'t added any questions yet' : 'You can still add questions';

        return (
            <Card className="text-center text-light mt-5" bg="dark">
                <Card.Header className="text-muted">{header}</Card.Header>
                <Card.Body>
                    <Card.Text>{text}</Card.Text>
                    <Button variant="info" onClick={this.addQuestion}>New Question <PlusCircleFill className="ml-1 mb-1 mt-1" size={20} /></Button>
                </Card.Body>
            </Card>
        )
    }

    quizLinkCopy = () => {
        let message = this.state.linkCopied ? "Link Copied" : "Copy Link";

        return (
            <InputGroup className="mt-5">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Link to take the Quiz</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" ref={(copyTextBox) => { this.copyTextBox = copyTextBox; }} value={FrontendUrl + RootPath + '/quiz/' + this.props.match.params.uuid}></FormControl>
                <InputGroup.Append>
                    <Button variant="info" onClick={this.copyQuizLink}>{message}</Button>
                </InputGroup.Append>
            </InputGroup>
        )
    }

    quizSaveButton = () => {
        if (this.state.questions.length === 0) {
            return null;
        }

        return (
            <Button className="mt-5 mb-5" variant="info" block onClick={this.saveQuiz}>Save the Quiz <Check2Circle size={22} /></Button>
        )
    }

    saveStatusToast = () => {
        let message;

        switch (this.state.statusCode) {
            case 200:
                message = "The Quiz was saved successfully";
                break;
            case -1:
                message = "The Quiz couldn't be saved | Couldn't contact backend server";
                break;
            default:
                message = "The Quiz couldn't be saved | Error " + this.state.statusCode;
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
                <this.saveStatusToast />

                <Container fluid="lg" className="mt-5">

                    <this.nameField />

                    <this.questions />

                    <this.questionAdder />

                    <this.quizLinkCopy />

                    <this.quizSaveButton />

                </Container>
            </div>
        )
    }

}

export default withRouter(EditQuiz);