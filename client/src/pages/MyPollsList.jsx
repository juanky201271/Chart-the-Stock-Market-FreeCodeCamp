import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``
const Delete = styled.div` color: #ff0000; cursor: pointer; `

class DeletePoll extends Component {
  deleteUser = async event => {
    event.preventDefault()
    const {twitterId, ip, _id, } = this.props
    if (window.confirm(`Do tou want to delete the poll ${_id} permanently?`,)) {

      await api.deletePollById(_id)
      .catch(error => {
        console.log(error)
      })

      await api.getAllUsersTwitter().then(usersTwitter => {
        usersTwitter.data.data.forEach((item, ind) => {
          var upd = false
          var vot = item.votes.map((itemVotes, indVotes) => {
            if (itemVotes.poll_id === _id) {
              upd = true
              return ({ poll_id: '', answer: '' })
            } else {
              return ({ poll_id: itemVotes.poll_id, answer: itemVotes.answer })
            }
          })
          if (upd) {
            var payload = { votes: vot }
            api.updateUserByTwitterId(twitterId, payload)
            .catch(error => {
              console.log(error)
            })
          }
        })
      })
      .catch(error => {
        console.log(error)
      })

      await api.getAllUsers().then(users => {
        users.data.data.forEach((item, ind) => {
          var upd = false
          var vot = item.votes.map((itemVotes, indVotes) => {
            if (itemVotes.poll_id === _id) {
              upd = true
              return ({ poll_id: '', answer: '' })
            } else {
              return ({ poll_id: itemVotes.poll_id, answer: itemVotes.answer })
            }
          })
          if (upd) {
            var payload = { votes: vot }
            api.updateUserByIp(ip, payload)
            .catch(error => {
              console.log(error)
            })
          }
        })
      })
      .catch(error => {
        console.log(error)
      })

      window.location.href = '/'
    }
  }
  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

class MyPollsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            polls: [],
            columns: [],
            isLoading: false,
        }
    }
    componentDidMount = async () => {
      this.setState({ isLoading: true })

      const { twitterId } = this.props.location.state
      await api.getAllPolls().then(polls => {
        let p = polls.data.data
        if (twitterId) {
          p = p.filter(function(item) {
            return item.twitterId === twitterId.toString()
          })
        } else {
          p = []
        }
        this.setState({
            polls: p,
            isLoading: false,
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
            isLoading: false,
        })
      })

    }
    render() {
      console.log('my polls', this.state)
        const { polls, isLoading } = this.state
        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Question',
                accessor: 'question',
                filterable: true,
            },
            {
                Header: 'Answers',
                accessor: 'answers',
                Cell: function(props) {
                  return (
                      <span>
                        {props.value.length > 1
                          ?
                          (props.value.map((ele, ind) => ele.answer).join(' / '))
                          :
                          (props.value.map((ele, ind) => ele.answer))}
                      </span>
                  )
                }
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeletePoll
                              _id={props.original._id}
                              authenticated={this.props.location.state.authenticated}
                              twitterId={this.props.location.state.twitterId}
                              ip={this.props.location.state.ip}
                              user={this.props.location.state.user} />
                        </span>
                    )
                }.bind(this),
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                          <React.Fragment>
                            <Link to={{ pathname: `/poll/update/${props.original._id}`,
                                    state: {
                                      authenticated: this.props.location.state.authenticated,
                                      twitterId: this.props.location.state.twitterId,
                                      ip: this.props.location.state.ip,
                                      user: this.props.location.state.user,
                                    }
                                  }}
                                  className="nav-link" >Update</Link>
                          </React.Fragment>
                        </span>
                    )
                }.bind(this),
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                          <React.Fragment>
                            <Link to={{ pathname: `/poll/details/${props.original._id}`,
                                    state: {
                                      authenticated: this.props.location.state.authenticated,
                                      twitterId: this.props.location.state.twitterId,
                                      ip: this.props.location.state.ip,
                                      user: this.props.location.state.user,
                                    }
                                  }}
                                  className="nav-link" >Details</Link>
                          </React.Fragment>
                        </span>
                    )
                }.bind(this),
            },
        ]

        let showTable = true
        if (!polls.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <Title>My Polls</Title>
                {showTable && !isLoading && (
                    <ReactTable
                        data={polls}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}

                {!showTable && (
                    <hr />
                )}

                {isLoading && (
                    <h3>Loading Polls</h3>
                )}
            </Wrapper>
        )
    }
}

export default MyPollsList
