import React from 'react';
import './App.css';
import '../index.css';


class blueLine extends React.Component {

  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  render() {
    return (
          <svg  width={3000} height={3000}>
            <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2} stroke="blue" strokeWidth="5"/>
          </svg>
        );
  }
    
}

class greenLine extends React.Component {

  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  render() {
    return (
          <svg  width={3000} height={3000}>
            <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2} stroke="green" strokeWidth="5"/>
          </svg>
        );
  }
    
}





class Vertex extends React.Component {

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.radius = 6;
  }

  render () {
    return (
        <svg width="3000" height="3000">
          <circle cx={this.x} cy={this.y} r={this.radius}/>
        </svg>
      );
      
  }
    
}


class Photo extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.selectedPhoto = "./img/ExampleGraph.png";
    this.state = {
      startPosx: -1,
      startPosy: -1,
      finishPosy: -1,
      finishPosx: -1,
      numClicks: 0,
      width: -1,
      height: -1
    }
    this.rect = false;
    this.vectors = [];


    // these two functions hold the <Line/> objects for the rows and columns respectively.
    // These are modified within the photo based off the tvalues sent in from <App/>
    this.rowList = [];
    this.colList = [];

  }

  handleClick() {

    if (this.state.numClicks < 4) {
      // this intiallizes the whole grid.
      // first, add the last corner vector
      var newVert = new Vertex(this.props.position.x, this.props.position.y);
      this.vectors.push(newVert)

      this.props.vertexChange(newVert);
      if (this.state.numClicks === 3) {
          // now have to fill in lists for new vectors.

        this.rect = true;
      }


      this.setState({ numClicks: this.state.numClicks + 1 })

      
    }
  }


  indexSelected(index, selector) {
    // boolean function
    if (this.props.startSelector > 0) {
      var adjustedIndex = index + 1;
      if (selector === "cols" && this.props.useColumns) {
        if (adjustedIndex >= this.props.startSelector && adjustedIndex <= this.props.endSelector) {
          return true;
        }
      }
      if (selector === "rows" && !this.props.useColumns) {
        if (adjustedIndex >= this.props.startSelector && adjustedIndex <= this.props.endSelector) {
          return true;
        }
      }
    }
    
    return false;
  }

  addGridVerticies() {
    this.colList = [];
    this.rowList = [];

    for (let i = 0; i < this.props.numCols - 1; i++) {
          let t = this.props.tCols[i];
          if (this.indexSelected(i, "cols")) {
            this.colList.push(new greenLine(this.vectors[1].x * t + this.vectors[0].x * (1 - t),
              this.vectors[1].y * t + this.vectors[0].y * (1 - t),
              this.vectors[2].x * t + this.vectors[3].x * (1 - t),
              this.vectors[2].y * t + this.vectors[3].y * (1 - t)));

          } else {
            this.colList.push(new blueLine(this.vectors[1].x * t + this.vectors[0].x * (1 - t),
              this.vectors[1].y * t + this.vectors[0].y * (1 - t),
              this.vectors[2].x * t + this.vectors[3].x * (1 - t),
              this.vectors[2].y * t + this.vectors[3].y * (1 - t)));
          }
          
    };
    for (let i = 0; i < this.props.numRows - 1; i++) {
          let t = this.props.tRows[i];
          if (this.indexSelected(i, "rows")) {
            this.rowList.push(new greenLine(this.vectors[2].x * t + this.vectors[1].x * (1 - t),
              this.vectors[2].y * t + this.vectors[1].y * (1 - t),
              this.vectors[3].x * t + this.vectors[0].x * (1 - t),
              this.vectors[3].y * t + this.vectors[0].y * (1 - t)));
          } else {
            this.rowList.push(new blueLine(this.vectors[2].x * t + this.vectors[1].x * (1 - t),
              this.vectors[2].y * t + this.vectors[1].y * (1 - t),
              this.vectors[3].x * t + this.vectors[0].x * (1 - t),
              this.vectors[3].y * t + this.vectors[0].y * (1 - t)));
          }
          
    };
        
  }

  addOuterLines() {
    this.lines = [];
    var firstVect = -1;
    var lastVect = -1;
    this.vectors.forEach((vector) => {
        
        if (firstVect === -1) {
            firstVect = vector;
        } else {
            this.lines.push(new blueLine(lastVect.x, lastVect.y, vector.x, vector.y));
        }
        lastVect = vector;
        
      })
      this.lines.push(new blueLine(lastVect.x, lastVect.y, firstVect.x, firstVect.y));
  }

  render() {

    //first thing to do is render all the vercicies
    this.selectedPhoto = this.props.selectedPhoto;
    let image = null;
    if (this.selectedPhoto == null) {
      image = <img alt="" onClick={() => this.handleClick()} src={require("./ExampleGraph.png")}/>;
    } else {
      image = <img alt="" src = {URL.createObjectURL(this.selectedPhoto)} onClick={() => this.handleClick()}/>;
    }

    if (this.rect) {
      // outer frame
      this.addOuterLines();
      this.addGridVerticies();

      return (

        <div className="img-overlay-wrap">
          {image}
          {this.colList.map((line, index) => (
              <React.Fragment key={index}>
                {line.render()}
              </React.Fragment>
          ))}
          {this.rowList.map((line, index) => (
              <React.Fragment key={index}>
                {line.render()}
              </React.Fragment>
          ))}
          {this.lines.map((line, index) => (
              <React.Fragment key={index}>
                {line.render()}
              </React.Fragment>
          ))}
          {this.vectors.map((vect, index) => (
              <React.Fragment key={index}>
                {vect.render()}
              </React.Fragment>
          ))}
        </div>
        );
    } else {
      return (
        image
      );
    }
    
  }
}

export default Photo;