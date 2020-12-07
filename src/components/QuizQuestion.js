import React from 'react';
import { Card, ButtonGroup, ToggleButton } from 'react-bootstrap';

import Content from './Content';

class QuizQuestion extends React.Component {

    questionText = () => {
        if (this.props.question.text === undefined || this.props.question.text === null || this.props.question.text === '') {
            return null;
        }

        return (
            <h4 className="text-center mb-4">{this.props.question.text}</h4>
        )
    }

    questionContent = () => {
        if (this.props.question.link === undefined || this.props.question.link === null) return null;

        if (this.props.question.link.startsWith('http://') || this.props.question.link.startsWith('https://')) {
            return (
                <Content key={'content' + this.props.index} link={this.props.question.link}/>
            )
        } else {
            return null;
        }
    }

    answers = () => {
        return this.props.question.answers.map((answer, index) => {
            return (
                <ToggleButton
                    key={'answer' + this.props.index + '-' + index}
                    type="radio"
                    variant="secondary"
                    checked={this.props.answered === index}
                    onChange={() => this.props.setAnswer(this.props.index, index)}
                >{answer}</ToggleButton>
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
                        <ButtonGroup className="mb-1" vertical="true" toggle>
                            <this.answers />
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </div>
        )
    }

}

export default QuizQuestion;