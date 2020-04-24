import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'

const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const Label = styled.label` margin: 5px; `
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
`
const Button = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
`
const CancelButton = styled.a.attrs({ className: `btn btn-danger`, })`
    margin: 15px 15px 15px 5px;
`

class PollsInsert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            question: '',
            answers: '',
        }
    }
    handleChangeInputQuestion = event => {
        const question = event.target.value
        this.setState({ question })
    }
    handleChangeInputAnswers = event => {
        const answers = event.target.value
        this.setState({ answers })
    }
    handleIncludePoll = async (event) => {
        event.preventDefault();
        const { question, answers, } = this.state
        const { twitterId, ip, } = this.props.location.state
        const arrayAnswers = answers.split('/')

        var arrTemp = []
        arrayAnswers.map((ele, ind) => {
          return (arrTemp.push({ answer: ele.trim(), votes: 0, }))
        })

        const payload = { question: question, answers: arrTemp, ip: ip, twitterId: twitterId }

        await api.insertPoll(payload).then(res => {
            window.alert(`Poll inserted successfully`)
            this.setState({
              question: '',
              answers: '',
            })
        })
        .catch(error => {
          console.log(error)
        })

        window.location.href = '/'
    }
    render() {
      console.log('insert', this.state)
        const { question, answers } = this.state
        return (
            <Wrapper>
                <Title>Create Poll</Title>

                <Label>Question: </Label>
                <InputText
                    type="text"
                    value={question}
                    onChange={this.handleChangeInputQuestion}
                />

                <Label>Answers: </Label>
                <InputText
                    type="text"
                    value={answers}
                    placeholder="Separate each one with '/'..."
                    onChange={this.handleChangeInputAnswers}
                />

                <Button onClick={this.handleIncludePoll}>Add Poll</Button>
                <CancelButton href={'/'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default PollsInsert
