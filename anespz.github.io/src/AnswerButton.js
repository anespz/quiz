import React, { Component } from 'react';

class AnswerButton extends Component {

    render() {

        return (
            <button onClick={() => this.props.onClick(this.props.answer)}>{this.props.answer} </button>
        )
    }

}

export default AnswerButton;
