import React from 'react';
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';
import { PlusCircle, DashCircle } from 'react-bootstrap-icons';

class EditQuizQuestion extends React.Component {

    questionText = () => {
        return (
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Question</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.props.updateQuestionText(this.props.index, e.target.value); }} value={this.props.question.text} placeholder="Enter Question"></FormControl>
            </InputGroup>
        )
    }

    questionContent = () => {
        return (
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text className="bg-secondary text-light border-secondary">Content Link</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.props.updateQuestionLink(this.props.index, e.target.value); }} value={this.props.question.link} placeholder="Enter Link to a Picture or a Video"></FormControl>
            </InputGroup>
        )
    }

    answers = () => {
        return this.props.question.answers.map((answer, index) => {
            return (
                <InputGroup key={'answer' + this.props.index + '-' + index} className="mb-2">
                    <InputGroup.Prepend>
                        <InputGroup.Text className="bg-secondary text-light border-secondary">Answer</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl className="bg-dark text-light border-secondary" onChange={(e) => { this.props.updateAnswer(this.props.index, index, e.target.value); }} value={answer}></FormControl>
                    <InputGroup.Append>
                        <Button variant="danger" onClick={() => this.props.removeAnswer(this.props.index, index)}>Remove</Button>
                    </InputGroup.Append>
                </InputGroup>
            )
        });
    }

    render() {
        return (
            <div>
                <Card className="text-center text-light mt-5" bg="dark">
                    <Card.Header className="text-muted">Question {this.props.index + 1}</Card.Header>
                    <Card.Body>
                        <this.questionText />
                        <this.questionContent />
                        <this.answers />
                        <Button className="mt-3" block variant="info" onClick={() => this.props.addAnswer(this.props.index)}>New Answer <PlusCircle className="ml-1 mb-1 mt-1" size={20} /></Button>
                        <Button className="mt-2" block variant="danger" onClick={() => this.props.removeQuestion(this.props.index)}>Remove Question <DashCircle className="ml-1 mb-1 mt-1" size={20} /></Button>
                    </Card.Body>
                </Card>

            </div>
        )
    }

}

export default EditQuizQuestion;