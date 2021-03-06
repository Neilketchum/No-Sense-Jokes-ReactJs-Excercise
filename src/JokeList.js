import React, { Component } from 'react'
import Axios from 'axios';
import './JokeList.css'
import { v4 as uuidv4 } from 'uuid';
import Joke from './Joke';
class JokeList extends Component{
    constructor(props){
        super(props);
        this.state = {jokes:JSON.parse(window.localStorage.getItem("jokes")||'[]'),loading:false}
        this.seenJokes = new Set(this.state.jokes.map(j=>j.text));
        console.log(this.seenJokes)
        this.handleClick = this.handleClick.bind(this)
    }
    static defaultProps = {
        numJokesToGet:10
    };
         componentDidMount(){
        if(this.state.jokes.length == 0){
            this.getJokes();
        }   

    }
    async getJokes(){
        try {
            let joke = [];
            while(joke.length<this.props.numJokesToGet){
                let res = await Axios.get('https://icanhazdadjoke.com/',{headers:{Accept:"application/json"}})
                let newJoke = res.data.joke
                if(!this.seenJokes.has(newJoke))
                    joke.push({text:res.data.joke,votes:0,id:uuidv4()})
                else{
                    console.log("Duplicate")
                    console.log(newJoke)
                }
            }
            this.setState(st=>({
                loading:false,
                jokes:[...st.jokes,...joke]
            }),
            () => window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
            );        
            // window.localStorage.setItem("jokes",JSON.stringify(joke))
    }
             catch (error) {
                alert("Page at Maintence");
        };
    }
    handleVote(id,delta){
        this.setState(
            st=>({
                  jokes: st.jokes.map(j=>
                        j.id===id?{...j,votes:j.votes+delta}:j
                    )
            }),()=>window.localStorage.setItem('jokes',JSON.stringify(this.state.jokes))
        )
    }
    handleClick(){
        this.setState({loading:true},this.getJokes)
        // this.getJokes()
    }
    render(){
        if(this.state.loading){
            return(
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className = "JokeList-title">Loading....</h1>
                </div>
            ) 
        }
        let sortedJokes = this.state.jokes.sort((a,b)=>b.votes -a.votes)
        return(
            <div className = "Jokelist">
                <div className="jokeList-sidebar">
                    <h3 className = "JokeList-title"><span>No Sense</span> Jokes </h3>
                    <img className = "Jokelist-image" src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt=""/>
                    <button className = "btn-getMore" onClick = {this.handleClick}>New Jokes</button>
                </div>
                <div className="jokeList-jokes">
                    <p>{ sortedJokes.map(j=>(
                        <Joke votes = {j.votes} 
                        text = {j.text} 
                        key ={j.id}
                        upvote ={()=>this.handleVote(j.id,1)}
                        downvote = {()=>this.handleVote(j.id,-1)}    />
                    ))}</p>
                </div>
                
            </div>
        )
    }
}
export default JokeList;