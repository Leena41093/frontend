// @flow

import React, { Component } from "react";

import "./style/Tip.css";

type State = {
  compact: boolean,
  text: string,
  emoji: string
};

type Props = {
  onConfirm: (comment: { text: string, emoji: string }) => void,
  onOpen: () => void,
  onUpdate?: () => void
};

class Tip extends Component<Props, State> {
  state = {
    compact: true,
    text: "",
    emoji: ""
  };

  state: State;
  props: Props;

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen,showTip } = this.props;
    const { compact, text, emoji } = this.state;
    showTip == undefined || showTip == null ? false :showTip;
    return (
      <div className="Tip">
        {showTip == undefined || showTip == null ? false :showTip ? compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add Marks / Comment
          </div>
        ) : (
          <form
            className="Tip__card"
            onSubmit={event => {
              event.preventDefault();
              onConfirm({ text, emoji });
            }}
          >
            <div>
              <textarea
                width="100%"
                placeholder="Add Marks / Comment"
                autoFocus
                value={text}
                onChange={event => this.setState({ text: event.target.value, emoji: event.target.value })}
                ref={node => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
             
            </div>
            <div>
              <input  className="Tip__compact" type="submit" value="Add" />
            </div>
          </form>
        ):<div></div>}
      </div>
    );
  }
}

export default Tip;