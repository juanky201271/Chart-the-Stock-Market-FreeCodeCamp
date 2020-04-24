import React, { Component } from 'react'
import styled from 'styled-components'
import api from '../api'
import { Chart } from '../components'

const Title = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const WrapperRigth = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    float: rigth;
    width: 40%;
`
const WrapperLeft = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    float: left;
    width: 40%;
`
const Label = styled.label`
    margin: 5px;
`
const LabelExtra = styled.label`
    margin: 5px;
    color: DodgerBlue;
`
const LabelVoted = styled.label`
    margin: 5px;
    color: green;
    font-weight: bold;
`
const ShareButton = styled.button.attrs({ className: 'btn btn-info', })`
    margin: 15px 15px 15px 5px;
    display: initial;
`
const Button = styled.button.attrs({ className: 'btn btn-primary', })`
    margin: 15px 15px 15px 5px;
    display: initial;
`
const CancelButton = styled.a.attrs({ className: 'btn btn-danger', })`
    margin: 15px 15px 15px 5px;
`
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
    display: none;
`
const InputRadio = styled.input.attrs({ type: 'radio', })`
    margin: 5px;
`

class PollsDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: this.props.match.params._id,
            authenticated: this.props.location.state.authenticated,
            twitterId: this.props.location.state.twitterId,
            ip: this.props.location.state.ip,
            user: this.props.location.state.user,
            question: '',
            answers: '',
            vote: '',
            extraOption: '',
            userVotes: [],
        }
        this.updateButtonRef = React.createRef()
        this.shareButtonRef = React.createRef()
        this.extraInputRef = React.createRef()
    }
    handleChangeInputVote = async event => {
        const vote = event.target.value
        this.setState({ vote })
        if (event.target.id === 'extraOption') {
          this.extraInputRef.current.style.display = 'initial'
        } else {
          this.extraInputRef.current.style.display = 'none'
        }
    }
    handleChangeInputExtraOption = event => {
        const extraOption = event.target.value
        this.setState({ extraOption })
    }
    handleVotePoll = async (event) => {
      event.preventDefault();
      const { _id, question, answers, extraOption, vote, authenticated, twitterId, ip, } = this.state
      if (!vote) return
      if (!extraOption && vote.trim() === "I'd like a custom option") return

      var arrTemp = []
      answers.map((ele, ind) => {
        if (ele.answer.trim() === vote.trim()) {
          return (arrTemp.push({ answer: ele.answer.trim(), votes: ele.votes + 1, }))
        } else {
          return (arrTemp.push({ answer: ele.answer.trim(), votes: ele.votes, }))
        }
      })
      if (extraOption && vote.trim() === "I'd like a custom option") arrTemp.push({ answer: extraOption, votes: 1, })
      const payload = { question, answers: arrTemp, }

      await api.updatePollById(_id, payload).then(res => {
        window.alert(`Poll voted successfully`)
      })
      .catch(error => {
        console.log(error)
      })
      arrTemp = []
      if (authenticated) {
        // twitterId
        await api.getUserByTwitterId(twitterId).then(user => {

          arrTemp = user.data.data.votes || []
          arrTemp.push({ poll_id: _id,
            answer: ( vote.trim() === "I'd like a custom option" ? extraOption : vote.trim()) })
        })
        .catch(error => {
          console.log(error)
        })
        const payload2 = { votes: arrTemp, }
        await api.updateUserByTwitterId(twitterId, payload2)
        .catch(error => {
          console.log(error)
        })
      } else {
        // ip
        await api.getUserByIp(ip).then(user => {

          arrTemp = user.data.data.votes || []
          arrTemp.push({ poll_id: _id,
            answer: ( vote.trim() === "I'd like a custom option" ? extraOption : vote.trim()) })
        })
        .catch(error => {
          console.log(error)
        })
        const payload3 = { votes: arrTemp, }
        await api.updateUserByIp(ip, payload3)
        .catch(error => {
          console.log(error)
        })
      }

      window.location.href = '/'
    }
    componentDidMount = async () => {
      var { _id, authenticated, twitterId, ip, userVotes, } = this.state

      if (authenticated) {
        // twitterId
        await api.getUserByTwitterId(twitterId).then(user => {
          userVotes = user.data.data.votes || []
          this.setState({
            userVotes: user.data.data.votes || []
          })
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        // ip
        await api.getUserByIp(ip).then(user => {
          userVotes = user.data.data.votes || []
          this.setState({
            userVotes: user.data.data.votes || []
          })
        })
        .catch(error => {
          console.log(error)
        })
      }

      await api.getPollById(_id).then(poll => {
        const arrayAnswers = poll.data.data.answers.map((item, ind) =>
          <div key={item.toString().substr(0,5) + ind.toString()}>
            <InputRadio id={item.answer.trim()} name="options" value={item.answer.trim()} onChange={this.handleChangeInputVote} />
            { userVotes.filter((itemUser, indUser) => {
                return (itemUser.poll_id === _id && itemUser.answer.trim() === item.answer.trim())
              }).length > 0 ? (
              <LabelVoted>{item.answer.trim() + ' ..... (' + item.votes + '). Your VOTE.'}</LabelVoted>
            )
            :
            (
              <Label>{item.answer.trim() + ' ..... (' + item.votes + ').'}</Label>
            )}
          </div>
        )
        arrayAnswers.push(
          <div key={'extraOption'}>
            <InputRadio id={'extraOption'} name="options" value={"I'd like a custom option"} onChange={this.handleChangeInputVote} />
            <LabelExtra>{"I'd like a custom option"}</LabelExtra>
          </div>
        )
        this.setState({
            question: poll.data.data.question,
            answersHtml: arrayAnswers,
            answers: poll.data.data.answers,
        })
      })
      .catch(error => {
        console.log(error)
      })

      if (!authenticated && this.shareButtonRef.current) {
        this.shareButtonRef.current.style.display = "none"
      }
      const votesExists = userVotes.filter((ele, ind) => {
        return ele.poll_id === _id
      })
      if (votesExists.length > 0 && this.updateButtonRef.current) {
        this.updateButtonRef.current.style.display = "none"
      }

    }
    handleShare(url) {
      window.open(url, '_blank')
    }
    render() {
        console.log('details', this.state)
        const { question, answersHtml, _id } = this.state
        const url = 'https://twitter.com/intent/tweet?url=' +
                    'https://bva-jccc-fcc.herokuapp.com/poll/details/' +
                    this.props.match.params._id +
                    '&text=' +
                    question +
                    ' - ' +
                    'BVA-jccc-fcc'

        return (
            <Wrapper>
              <WrapperLeft>
                <Title>Poll Details</Title>
                <Label>{question}</Label>
                {answersHtml}
                <InputText
                    type="text"
                    id="extraInput"
                    value={this.state.extraOption}
                    placeholder="write some other option"
                    onChange={this.handleChangeInputExtraOption}
                    ref={this.extraInputRef}
                />
                <Button onClick={this.handleVotePoll} id="updateButton" ref={this.updateButtonRef}>Vote</Button>
                <CancelButton href={'/'}>Cancel</CancelButton>
                <ShareButton onClick={() => this.handleShare(url)} id="shareButton" ref={this.shareButtonRef}>Share on Twitter</ShareButton>
              </WrapperLeft>
              <WrapperRigth>
                <Chart _id={_id} />
              </WrapperRigth>
            </Wrapper>
        )
    }
}

export default PollsDetails
