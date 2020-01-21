import React, { Component } from 'react';

class AnswerButton extends Component {

    render() {

        return (
        <div className='answerButton'>
            <button onClick={() => this.props.onClick(this.props.answer)}>{this.props.answer} </button>
        </div>
        )
    }

}

export default AnswerButton;
