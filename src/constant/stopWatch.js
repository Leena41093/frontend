import React, { Component } from 'react';
import moment from 'moment';
export class StopWatch extends React.Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      timeleft: 100,
    }
  }

  componentWillMount() {
    setTimeout(this.tick, 1000)
  }

  componentDidMount() {
    this.setState({ timeleft: this.props.date })
  }


  tick() {
    if(this.state.timeleft === 0){
      this.props.stopMethod();
    }
    this.setState({ timeleft: this.state.timeleft - 1 });
    setTimeout(this.tick, 1000)
  }

  pad(num) {
    return ("0" + num).slice(-2);
  }

  hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(secs);
  }


  render() {
    return (
      <div>
        {this.hhmmss(this.state.timeleft)}
      </div>
    );
  }
}

