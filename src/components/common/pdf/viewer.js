// @flow

import React, { Component } from "react";

import URLSearchParams from "url-search-params";

import {
  PdfLoader,
  PdfHighlighter,
  // Highlight,
  Popup,
  AreaHighlight
} from "react-pdf-highlighter";
import Tip from './tipCustom';
import testHighlights from "./test-highlights";
import Highlight from './highlightCustom';
import $ from "jquery";

import Spinner from "./Spinner";
import Sidebar from "./Sidebar";

import type { T_Highlight, T_NewHighlight } from "react-pdf-highlighter/types";

import "./style/App.css";

type T_ManuscriptHighlight = T_Highlight;

type Props = {
  url: Array
};

type State = {
  highlights: Array<T_ManuscriptHighlight>
};



const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => window.location.hash.slice("#highlight-".length);

const resetHash = (obj) => {
  window.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const DEFAULT_URL = "http://solutions.weblite.ca/pdfocrx/scansmpl.pdf";

const searchParams = new URLSearchParams(window.location.search);
var url = searchParams.get("url") || DEFAULT_URL;


const pdfToViewport = (pdf, viewport): T_LTWH => {
  const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([
    pdf.x1,
    pdf.y1,
    pdf.x2,
    pdf.y2
  ]);

  return {
    left: x1,
    top: y1,

    width: x2 - x1,
    height: y1 - y2
  };
};

export const scaledToViewport = (
  scaled: T_Scaled,
  viewport: T_VIEWPORT,
  usePdfCoordinates: boolean = false
): T_LTWH => {
  const { width, height } = viewport;

  if (true) {
    return pdfToViewport(scaled, viewport);
  }

  if (scaled.x1 === undefined) {
    throw new Error("You are using old position format, please update");
  }

  const x1 = width * scaled.x1 / scaled.width;
  const y1 = height * scaled.y1 / scaled.height;

  const x2 = width * scaled.x2 / scaled.width;
  const y2 = height * scaled.y2 / scaled.height;

  return {
    left: x1,
    top: y1,
    width: x2 - x1,
    height: y2 - y1
  };
};

class Viewer extends Component<Props, State> {

  state = {
    // highlights: testHighlights[this.props.url] ? [...testHighlights[this.props.url]] : []
    highlights: this.props.input ? this.props.input : [],
    markerFlag: false,
    currentMarks: "",
    disabledBtn: true,
  };

  state: State;
  props: Props;

  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  };



  scrollViewerTo = (highlight: any) => {
    
  };

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };
  

  componentDidMount() {
    // this.setState({currentMarks:this.props.currentMarks})
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
   
    this.addMarksHighlight = this.addMarksHighlight.bind(this);
    window.addEventListener("message", (event) => {
      if (typeof (event.data) != "object" && !(event.data instanceof Array)) {
        if (event.data && event.data != "addMarks") {
          this.setState({ currentMarks: event.data })
        } else if (event.data == "addMarks") {
          this.addMarks(event)
        }
      } else if (event.data instanceof Array && event.data.length > 0) {
        let arr = JSON.parse(JSON.stringify(event.data))
        this.setState({ highlights: arr })
      }
      if (event.target.data) {
        this.addMarksHighlight(event.target.data);
      }
    });
    document.addEventListener("message", (event) => {

      if (this.props.renderMarker) {
        //add marks
        if (event.data && event.data == "clear") {
          this.setState({ highlights: [] })
        } else if (event.data && event.data == "undo") {
          let highlights = this.state.highlights;
          let array = [];
          highlights.map((obj, index) => {
            if (index != 0) {
              array.push(obj)
            }
          })
          this.setState({ highlights: array })
        }
        if (event.data && event.data != "addMarks") {
          this.setState({ currentMarks: event.data })
        } else if (event.data == "addMarks") {
          this.addMarks(event)
        }
      } else {
        //view
        if (event.data) {
          let arr = JSON.parse(event.data);
          this.setState({ highlights: arr })
        }
      }
      //##
      // if (typeof (event.data) != "object" && !(event.data instanceof Array)) {
      //   if (event.data && event.data != "addMarks") {
      //     if (this.props.renderMarker) {
      //       this.setState({ currentMarks: event.data }) //4
      //     } 
      //       let arr = JSON.parse(event.data);
      //       this.setState({ highlights: arr })


      //   } else if (this.props.renderMarker && event.data == "addMarks") {
      //     this.addMarks(event)
      //   }
      // } else if (event.data instanceof Array && event.data.length > 0) {
      //   console.log('##event.data>>>', event.data);
      //   this.setState({ highlights: event.data })
      // }
      // if (event.target.data) {
      //   this.addMarksHighlight(event.target.data);
      // }
    });
    //##
    //   document.addEventListener("message", (event) => {
    //     console.log('##input receied window>>>', event);
    //     if (typeof (event.data) != "object" && !(event.data instanceof Array)) {
    //       if (event.data && event.data != "addMarks") {
    //         this.setState({ currentMarks: event.data })
    //       } else if (event.data == "addMarks") {
    //         this.addMarks(event)
    //       }
    //     } else if (event.data instanceof Array && event.data.length > 0) {
    //       console.log('##event.data>>>', event.data);
    //       this.setState({ highlights: event.data })
    //     }
    //     if (event.target.data) {
    //       this.addMarksHighlight(event.target.data);
    //     }
    //   });
      this.myRef = React.createRef();
    }

    getHighlightById(id: string) {
      const { highlights } = this.state;

      return highlights.find(highlight => highlight.id === id);
    }

    addHighlight(highlight: T_NewHighlight) {
      const { highlights } = this.state;
      

      this.setState({
        highlights: [{ ...highlight, id: getNextId() }, ...highlights]
      }, () => {
        if (this.props.onComment) {
          window.parent.postMessage(JSON.stringify(this.state.highlights), '*');
          this.props.onComment(this.state.highlights)
        }
      }
      );
    }

    updateHighlight(highlightId: string, position: Object, content: Object) {

      this.setState({
        highlights: this.state.highlights.map(h => {
          return h.id === highlightId
            ? {
              ...h,
              position: { ...h.position, ...position },
              content: { ...h.content, ...content }
            }
            : h;
        })
      });
    }

    renderSideBar(highlights) {
      if (this.props.nosidebar) {
        return false;
      } else {
        return (
          <Sidebar
            highlights={highlights}
            resetHighlights={this.resetHighlights}
            readonly={this.props.readonly}
            resetFlag={this.props.resetFlag}
          />
        )
      }
    }
    componentWillUnmount() {
      window.removeEventListener('scroll', () => {
        this.setState({ markerFlag: false , disabledBtn:false})
      });
    };
    addMarks = (e) => {
      //console.log('@addMarks>> ', e, document.getElementById("marker").getBoundingClientRect());
      var content = { text: "" };
      var comment = { text: this.state.currentMarks, emoji: this.state.currentMarks };
      var pageNo = this.myRef.current.viewer._location.pageNumber;
      var viewport = this.myRef.current.viewer.getPageView(0).viewport;
      var rect = {
        x1: 100,
        x2: 200,
        y1: this.myRef.current.viewer.scroll.lastY,
        y2: this.myRef.current.viewer.scroll.lastY,
        height: viewport.height,
        width: viewport.width
      }
      var result = scaledToViewport(rect, viewport);


      var location = {
        height: viewport.height,
        width: viewport.width,
        x1: 100,
        x2: 200,
        //  y1:this.myRef.current.viewer.scroll.lastYm,
        //    y1:(this.myRef.current.viewer.scroll.lastY + 50) * (1.25/this.myRef.current.viewer._currentScale),
        y1: 50 + (this.myRef.current.viewer.scroll.lastY) - (viewport.height * (pageNo - 1) * 1.0090010),
        y2: 50 + (this.myRef.current.viewer.scroll.lastY) - (viewport.height * (pageNo - 1) * 1.0090010)
      }
      var position = { boundingRect: location, pageNumber: pageNo, rects: [location] }
      this.addHighlight({ content, position, comment });
      this.setState({ markerFlag: false ,currentMarks: "", disabledBtn:true});
      


    }

    addMarksHighlight(marks) {
      var content = { text: "" };
      var comment = { text: marks, emoji: marks };
      var location = {
        height: 1242,
        width: 960,
        x1: 100,
        x2: 200,
        y1: this.myRef.current.viewer.scroll.lastYm,
        y1: this.myRef.current.viewer.scroll.lastY + 50,
        y2: this.myRef.current.viewer.scroll.lastY + 70
      }
      var position = { boundingRect: location, pageNumber: 1, rects: [location] }
      this.addHighlight({ content, position, comment });
    }
    enterMark = () => {
      this.setState({ markerFlag: true })
    }
    chnageMarks=(e)=>{
      this.setState({ currentMarks: e.target.value })
      //add Marks
      this.setState({disabledBtn:false})
      this.props.chnageMarksWeb(e.target.value);
    }
    renderMarker() {
      if (!this.state.markerFlag) {
        return (
          <div>
            {this.props.renderMarkerForWeb ?
            <div className="row" style={{ position: 'absolute', top: 250, marginLeft:"5px",zIndex: 100, width: 277, fontWeight: 'bold' }}>
            <input id="marker"
            type="number"
            placeholder="Enter Marks"
            value={this.state.currentMarks}
            className="c-btn c-btn-bordered pdf-highlight-btn"
            style={{ marginRight:"5px", zIndex: 1, width: 135, fontWeight: 'bold' ,display:"inline-block" }}
            onChange={this.chnageMarks} /><button className="c-btn prime btn" style={{display:"inline-block", color:"white"}} onClick={this.addMarks.bind(this)} disabled={this.state.disabledBtn}>Add Marks</button>
            </div>
            :
            //for mobile
            <input id="marker"
              placeholder="Enter Marks"
              className="c-btn c-btn-bordered pdf-highlight-btn"
              style={{ position: 'fixed', top: 50, zIndex: 100, width: 135, fontWeight: 'bold' }}
              value={this.state.currentMarks}
              disabled={true} />
            }
            {/* <div id="marker" className="c-btn c-btn-bordered pdf-highlight-btn" style={{position:'fixed',
             top:50,zIndex:100}} onClick={this.enterMark}>
              Add Mark >>>
        </div> */}

            {/* <div>
          <b><input 
              id="markerInput" 
              type="number" 
              onChange={e=>{this.setState({currentMarks:e.target.value})}} 
              className="c-btn c-btn-bordered pdf-highlight-input" 
              autoFocus 
              placeholder="Enter Marks" 
              style={{position:'fixed',zIndex:100,width:135,textAlign:'left',backgroundColor:'white'}}
            />
          </b>
          <button 
             className="c-btn pdf-highlight-btn"              
             style={{position:'fixed',left:115,zIndex:100,width:70,borderTopLeftRadius:'inherit',borderBottomLeftRadius:'inherit',padding:'inherit' }} 
             onClick={this.addMarks.bind(this)}
             disabled={!this.state.currentMarks}
             min={0} >Done
          </button>  
        </div> */}
          </div>
        );
      }

    }
    render() {
      var enableAreaSelection = (event) => event.altKey;
      let divStyle;
      if (this.props.readonly) {
        enableAreaSelection = false;
        divStyle = {
          height: "100vh",
          width: "100vw",
          position: "relative",
          userSelect: 'none',
        }
      } else {
        divStyle = {
          height: "100vh",
          width: "100vw",
          // overflowY: "scroll",
          position: "relative",
        }
      }

      const { highlights } = this.state;
      return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
          {this.props.showSidebar ? this.renderSideBar(highlights) : <div></div>}
          <div style={divStyle}>
            {this.props.renderMarker ? this.renderMarker() : ""}
            <PdfLoader url={this.props.url} beforeLoad={<Spinner />}>
              {pdfDocument => (

                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={enableAreaSelection}
                  // enableAreaSelection={false}
                  onScrollChange={resetHash}
                  ref={this.myRef}
                  scrollRef={scrollTo => {
                    this.scrollViewerTo = scrollTo;

                    this.scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => (
                      <Tip
                        onOpen={transformSelection}
                        onConfirm={comment => {
                          this.addHighlight({ content, position, comment });

                          hideTipAndSelection();
                        }}
                        showTip={this.props.showTip}
                      />
                    )}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {

                    const isTextHighlight = !Boolean(
                      highlight.content && highlight.content.image
                    );

                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                      />
                    ) : (
                        <AreaHighlight
                          highlight={highlight}
                          onChange={boundingRect => {
                            this.updateHighlight(
                              highlight.id,
                              { boundingRect: viewportToScaled(boundingRect) },
                              { image: screenshot(boundingRect) }
                            );
                          }}
                        />
                      );

                    return (
                      <Popup
                        popupContent={<HighlightPopup {...highlight} />}
                        onMouseOver={popupContent =>
                          setTip(highlight, highlight => popupContent)
                        }
                        onMouseOut={hideTip}
                        key={index}
                        children={component}
                      />
                    );
                  }}
                  highlights={highlights}
                />
              )}
            </PdfLoader>
          </div>
        </div>
      );
    }
  }

  export default Viewer;