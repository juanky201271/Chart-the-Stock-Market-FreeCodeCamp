import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import { Link } from 'react-router-dom'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const Title = styled.h1.attrs({ className: 'h1', })``

class PollsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            polls: [],
            columns: [],
            isLoading: false,
            authenticated: '',
            twitterId: '',
            ip: '',
            user: '',
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })

        var ip = ''
        await fetch("/api/auth/login/success", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept:
            "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          }
        })
          .then(response => {
            if (response.status === 200) return response.json()
            throw new Error("failed to authenticate user")
          })
          .then(responseJson => {
            ip = responseJson.ip
            if (responseJson.success === true) {
              this.setState({
                authenticated: true,
                twitterId: responseJson.user.twitterId,
                user: responseJson.user,
                ip: responseJson.ip,
              })
            } else {
              this.setState({
                authenticated: false,
                twitterId: '',
                user: '',
                ip: responseJson.ip,
              })
            }
          })
          .catch(error => {
            console.log(error)
          })

        await this.addUserIp(ip)

        await api.getAllPolls().then(polls => {
            this.setState({
                polls: polls.data.data,
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
    addUserIp = async (ip) => {
      if (ip) {
        const currentUser = await api.getUserByIp(ip).catch(err => console.log(err))
        if (!currentUser) {
          //console.log('New User')
          const payload = {
            ip: ip,
            votes: [],
          }
          const newUser = await api.insertUser(payload).catch(err => console.log(err))
          if (newUser) {
            //console.log('New User created')
            //done(null, newUser)
          } else {
            //console.log("New User don't created")
          }
        } else {
          //console.log('User exists')
        }
      } else {
        //console.log('IP empty')
      }
    }
    render() {
      console.log('polls', this.state)
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
                        {props.value.length > 1 ? (props.value.map((ele, ind) => ele.answer).join(' / ')) : (props.value.map((ele, ind) => ele.answer))}
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
                        <React.Fragment>
                          <Link to={{ pathname: `/poll/details/${props.original._id}`,
                                  state: {
                                    authenticated: this.state.authenticated,
                                    twitterId: this.state.twitterId,
                                    ip: this.state.ip,
                                    user: this.state.user,
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
                <Title>Polls</Title>
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

export default PollsList
