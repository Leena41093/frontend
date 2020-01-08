import React, { Component } from 'react';
import moment from 'moment';
 export class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      timeleft: 100,
      enddate: moment().add('2', 'hours')
    }
  }

  componentWillMount() {
    setTimeout(this.tick, 1000)
  }

  componentDidMount(){
    
    this.setState({enddate:this.props.date})
   
  }
  

  tick() {
    //this.setState({timeleft:this.state.timeleft-1});
    this.setState({ timeleft: (moment(this.props.date).unix() - moment().unix()) })
    setTimeout(this.tick, 1000)
  }

  pad(num) {
 		  return ("0"+num).slice(-2);
  }

  padhrs(num) {

   if(num <= 9 && num >= -9){
		  return ("0"+num).slice(-2);
	 } else {
		 return num;
   }
   

  }
  hhmmss(secs) {
    var negative = secs < 0;
    secs = +secs;
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    var returnval = this.padhrs(hours) + ":" + this.pad(minutes) + ":" + this.pad(secs);
    if(negative<0){
      returnval = '-'+returnval;
    }
    return returnval;
  }


  render() {
    return (
      <div>
        {this.hhmmss(this.state.timeleft)}
      </div>
    );
  }
}

