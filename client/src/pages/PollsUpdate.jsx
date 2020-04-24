import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'

const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const Label = styled.label`
    margin: 5px;
`
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
`
const Button = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
    display: initial;
`
const CancelButton = styled.a.attrs({ className: `btn btn-danger`, })`
    margin: 15px 15px 15px 5px;
`

class PollsUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
            question: '',
            answers: '',
            votes: [],
        }
        this.updateButtonRef = React.createRef()
    }
    handleChangeInputQuestion = event => {
        const question = event.target.value
        this.setState({ question })
    }
    handleChangeInputAnswers = event => {
        const answers = event.target.value
        this.setState({ answers })
    }
    handleUpdatePoll = async (event) => {
      event.preventDefault();
      const { _id, question, answers, } = this.state
      const arrayAnswers = answers.split('/')
      var arrTemp = []
      arrayAnswers.map((ele, ind) => {
        return (arrTemp.push({ answer: ele.trim(), votes: 0, }))
      })
      const payload = { question, answers: arrTemp, }

      await api.updatePollById(_id, payload).then(res => {
        window.alert(`Poll updated successfully`)
        this.setState({
          question: '',
          answers: [],
          votes: [],
        })
      })
      .catch(error => {
        console.log(error)
      })

      window.location.href = '/'
    }
    componentDidMount = async () => {
      var { _id, votes } = this.state
      await api.getPollById(_id).then(poll => {
        votes = poll.data.data.answers.map((ele, ind) => ele.votes)
        this.setState({
          question: poll.data.data.question,
          answers: poll.data.data.answers.map((ele, ind) => ele.answer.trim()).join(' / '),
          votes: poll.data.data.answers.map((ele, ind) => ele.votes),
        })
      })
      .catch(error => {
        console.log(error)
      })

      const votesExists = votes.filter((ele, ind) => {
        return ele > 0
      })
      if (votesExists.length > 0 && this.updateButtonRef.current) {
        this.updateButtonRef.current.style.display = "none"
      }

    }
    render() {
        console.log('update', this.state)
        const { question, answers, } = this.state

        return (
            <Wrapper>
                <Title>Update Poll</Title>

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

                <Button id="updateButton" onClick={this.handleUpdatePoll} ref={this.updateButtonRef}>Update Poll</Button>
                <CancelButton href={'/'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default PollsUpdate
