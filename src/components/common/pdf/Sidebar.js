// @flow

import React from "react";

import type { T_Highlight } from "react-pdf-highlighter/types";
type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void,
  readonly: Boolean,
  resetFlag: Boolean
};

const updateHash = highlight => {
  window.location.hash = `highlight-${highlight.id}`;
};



function Sidebar({ highlights, resetHighlights,readonly,resetFlag }: Props) {
  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Comments</h2>


        {!readonly?
           (
            <p>
            <small>
              To create area highlight hold ⌥ Option key (Alt), then click and
              drag.
            </small>
          </p>
          ):<p></p>
        }
       
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      {(highlights.length > 0 && !readonly)? (
        <div style={{ padding: "1rem" }}>
      {resetFlag?( 
        <a href="#" onClick={resetHighlights}>
            Reset highlights
          </a>): <div></div> }
        
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;