import React from 'react';
import './App.css';
import '../index.css';
import ReactCursorPosition from 'react-cursor-position';
import GridLayout from 'react-grid-layout';
import Toggle from 'react-toggle';
import NumericInput from 'react-numeric-input';
import Photo from './Photo.js';
import axios from 'axios';
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget';

const backendUrl = 'http://localhost:8000';

function downloadCsv(csvString) {
  // Convert the CSV string to a Blob
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary <a> element to initiate the download
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "data.csv");

  // Append the <a> element to the DOM
  document.body.appendChild(link);

  // Initiate the download
  link.click();

  // Remove the <a> element from the DOM
  document.body.removeChild(link);

  // Release the URL object
  URL.revokeObjectURL(url);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numCols: 2,
      numRows: 3,
      useCustomDims: false,
      tNumerator: -1,
      tDenominator: 1000,
      startSelector: 0,
      endSelector: 0,
      startSelLastChange: false,
      useColumns: false,
      tRows: [1/3, 2/3],
      tCols: [1/2],
      vertices: [],
      selectedFile: null
    };

    // start of methods

    this.handleColChange = this.handleColChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleDimChange = this.handleDimChange.bind(this);
    this.handletNumChange = this.handletNumChange.bind(this);
    this.handletDomChange = this.handletDomChange.bind(this);
    this.handleStartSelChange = this.handleStartSelChange.bind(this);
    this.handleEndSelChange = this.handleEndSelChange.bind(this);
    this.handleDirectionChange = this.handleDirectionChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDatasetSubmit = this.handleDatasetSubmit.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
    this.appendVertex = this.appendVertex.bind(this);

    // end of methods
    


    // tRows and tCols hold the t interpolation value from the start of the line for that column/ row.
    // the first value of the list is the bottom/ right edge of the first row/ column.
    this.tCols = [];
    this.tRows = [];
    this.photo = null
  }
  
  setUniformTCols() {
    let ret = [];
    for (let i = 1; i < this.state.numCols; i++) {
      ret.push(i/this.state.numCols);
    }
    this.tCols = ret;
  }

  setUniformTRows() {
    let ret = [];
    for (let i = 1; i < this.state.numRows; i++) {
      ret.push(i/this.state.numRows);
    }
    this.tRows = ret;
  }

  ensureSelectorsValid() {
    if (this.state.startSelector >= this.state.endSelector) {
      this.setState({endSelector: this.state.startSelector}, () => {
        if (this.state.useColumns) {
          this.ensureColumnsValid();
        } else {
          this.ensureRowsValid();
        }
      });
    } else {
      if (this.state.useColumns) {
        this.ensureColumnsValid();
      } else {
        this.ensureRowsValid();
      }
    }

  }

  ensureColumnsValid() {
      let newStartSel = -1;
      let newEndSel = -1;
      let newTNumerator;
      if (this.state.startSelector >= this.state.numCols) {
        newStartSel = this.state.numCols - 1;
      }
      if (this.state.startSelector <= 0) {
        newStartSel = 0;
      }
      if (this.state.endSelector >= this.state.numCols) {
        newEndSel = this.state.numCols - 1;
      }
      if (this.state.endSelector <= 0) {
        newEndSel = 0;
      }
      if (this.state.startSelector > this.state.endSelector) {
        newEndSel = this.state.startSelector;
      }

      if (newStartSel === -1) {
        newStartSel = this.state.startSelector;
      }

      if (newEndSel === -1) {
        newEndSel = this.state.endSelector;
      }

      if (this.state.startSelector === 0) {
        newTNumerator = -1;
      } else {
        newTNumerator = this.tCols[newStartSel - 1] * this.state.tDenominator;
      }




      this.setState({
        startSelector: newStartSel,
        endSelector: newEndSel,
        tNumerator: newTNumerator
      });
      
  }

  ensureRowsValid() {
    let newStartSel = -1;
    let newEndSel = -1;
    let newTNumerator;

    if (this.state.startSelector >= this.state.numRows) {
      newStartSel = this.state.numRows - 1;
    }
    if (this.state.startSelector <= 0) {
      newStartSel = 0;
    }
    if (this.state.endSelector >= this.state.numRows) {
      newEndSel = this.state.numRows - 1;
    }
    if (this.state.endSelector <= 0) {
      newEndSel = 0;
    }
    if (this.state.startSelector > this.state.endSelector) {
      newEndSel = this.state.startSelector;
    }

    if (newStartSel === -1) {
      newStartSel = this.state.startSelector;
    }

    if (newEndSel === -1) {
      newEndSel = this.state.endSelector;
    }

    if (this.state.startSelector === 0) {
      newTNumerator = -1;
    } else {
      newTNumerator = this.tRows[newStartSel - 1] * this.state.tDenominator;
    }

    this.setState({
      startSelector: newStartSel,
      endSelector: newEndSel,
      tNumerator: newTNumerator
    });
  }

  handleColChange(event) {
    if (event < 0) {
      this.setState({numCols: 0});
    } else {
      this.setState({numCols: event})
    }
  }

  handleRowChange(event) {
    if (event < 0) {
        this.setState({numRows: 0});
    } else {
      this.setState({numRows: event})
    }
  }

  handleDimChange() {
    if (this.state.useCustomDims){
      this.setState({useCustomDims: false});
    } else {
      this.setState({useCustomDims: true});
    }
  }

  handletNumChange(event) {
    var ret;
    var diff;
    if (this.state.useCustomDims) {
      if (this.state.useColumns) {
        ret = this.tCols;
        diff = (event / this.state.tDenominator) - this.tCols[this.state.startSelector - 1];

        for (let i = this.state.startSelector; i <= this.state.endSelector; i++) {

          ret[i - 1] += diff;
        }
        this.setState({tNumerator: event, tCols: ret}, () => {
          this.ensureSelectorsValid();
        });
      } else {
        ret = this.tRows;
        diff = (event / this.state.tDenominator) - this.tRows[this.state.startSelector - 1];
        for (let i = this.state.startSelector; i <= this.state.endSelector; i++) {

          ret[i - 1] += diff;
        }

        this.setState({tNumerator: event, tRows: ret}, () => {
          this.ensureSelectorsValid();
        });
      };
      
    };

  }

  handletDomChange(event) {
    var newtNum = (this.state.tNumerator / this.state.tDenominator) * event
    this.setState({tDenominator: event, tNumerator: newtNum});
    this.ensureSelectorsValid();
  }

  handleStartSelChange(event) {

    this.setState({startSelector: event}, () => {
      this.ensureSelectorsValid();
    });

  }

  handleEndSelChange(event) {
    
    this.setState({endSelector: event}, () => {
      this.ensureSelectorsValid();
    });

  }

  deleteRows() {

    var numLines = this.state.endSelector - this.state.startSelector + 1;
    var lst;
    if (this.state.useColumns) {
      lst = this.state.tCols;
      var currNumCols = this.state.numCols;
      lst.splice(this.state.startSelector - 1, numLines);
      this.setState({tCols: lst, numCols: currNumCols - numLines, endSelector: this.state.startSelector},
          () => {
        this.ensureSelectorsValid()
          });
    } else {
      lst = this.state.tRows;
      var currNumRows = this.state.numRows;
      lst.splice(this.state.startSelector - 1, numLines);
      this.setState({tRows: lst, numRows: currNumRows - numLines, endSelector: this.state.startSelector},
          () => {
        this.ensureSelectorsValid()
          });
    }
  }

  handleDirectionChange() {

      this.setState({
        useColumns: !this.state.useColumns,
        tNumerator: this.state.tRows[this.state.startSelector - 1] * this.state.tDenominator
          },
          () => {
        this.ensureSelectorsValid()
      });
    
  }

  handleFileChange(event) {
    console.log("lets gooo func up");
    this.setState({selectedFile: event.info.url});
  }

  async handleDatasetSubmit() {
    // Create an object of formData

    let packet = {
      numCols: this.state.numCols,
      numRows: this.state.numRows,
      tRows: this.state.tRows,
      tCols: this.state.tCols,
      selectedFile: this.state.selectedFile,
      vertices: this.state.vertices,
      username: "biggin123"
    };

    console.log(backendUrl);

    const response = await axios.post(`${backendUrl}/`, packet);
    console.log(response);

    downloadCsv(response.data.result)




  }

  appendVertex(vertex) {
    let newVertices = this.state.vertices;
    newVertices.push(vertex);
    this.setState({vertices: newVertices})
  }

  render() {
    //ensuring that they are the same at the start of the loop
    
    const layout = [
      { i: "photo", x: 0, y: 0, w: 1, h: 5, static: true },
      { i: "title", x: 1, y: 0, w: 1, h: 1, static: true },
      { i: "cols", x: 1, y: 1, w: 1, h: 1, static: true },
      { i: "rows", x: 1, y: 2, w: 1, h: 1, static: true },
      { i: "gridDimToggle", x: 1, y: 3, w: 1, h: 3, static: true },
      { i: "tValDisplay", x: 1, y: 6, w: 1, h: 3, static: true },
      { i: "colOrRow", x: 1, y: 9, w: 1, h: 3, static: true },
      { i: "descriptor", x: 1, y: 12, w: 1, h: 2, static: true },
      { i: "startSelector", x: 1, y: 14, w: 1, h: 1, static: true },
      { i: "endSelector", x: 1, y: 15, w: 1, h: 1, static: true },
      { i: "tModifier", x: 1, y: 16, w: 1, h: 1, static: true },
      { i: "rowDeleteButton", x: 1, y: 17, w: 1, h: 1, static: true },
      { i: "fileChoiceButton", x: 1, y: 18, w: 1, h: 1, static: true },
      { i: "fileSubmitButton", x: 1, y: 20, w: 1, h: 1, static: true }
      
    ];
    if (!this.state.useCustomDims) {
      this.setUniformTCols();
      this.setUniformTRows();
    } else {
      this.tRows = this.state.tRows;
      this.tCols = this.state.tCols;
    }
    
    this.photo = <Photo numCols={this.state.numCols} numRows={this.state.numRows}
                    tCols={this.tCols} tRows={this.tRows}
                    startSelector={this.state.startSelector} endSelector={this.state.endSelector}
                    useColumns={this.state.useColumns} selectedPhoto={this.state.selectedFile}
                    vertexChange = {this.appendVertex}/>;

    return (<article>
      <GridLayout
        className="layout"
        layout={layout}
        cols={2}
        rowHeight={30}
        width={2300}
      >
        <div key="photo">
          <ReactCursorPosition>
            {this.photo}
          </ReactCursorPosition>
        </div>
        <div key="title">
          Table Scanner -> Super Fun
        </div>
        <div key="cols">
          <label>
            # Columns:
            <NumericInput precision={0} value={this.state.numCols} step={1} onChange={this.handleColChange}/>
          </label>
        </div> 
        <div key="rows">
          <label>
            # Rows:
            <NumericInput precision={0} value={this.state.numRows} step={1} onChange={this.handleRowChange}/>
          </label>
        </div>

        <div key="gridDimToggle">
          <Toggle
              id='dimToggle'
              defaultChecked={this.state.useCustomDims}
              onChange={this.handleDimChange} />
            <label htmlFor='dimToggle'>Use Custom Grid Dimensions</label>
        </div>
        <div key="tValDisplay">
            Column t values:<br/>
            {JSON.stringify(this.tCols.map(x => x.toPrecision(3)))}<br/>
            Row t values:<br/>
            {JSON.stringify(this.tRows.map(x => x.toPrecision(3)))}
        </div>
        <div key="colOrRow">
          <Toggle
              id='colToggle'
              defaultChecked={this.state.useColumns}
              onChange={this.handleDirectionChange} />
            <label htmlFor='colToggle'>Move Column/ Columns (otherwise moving rows)</label>
        </div>
        <div key="descriptor">
          <label>
            Row/ Column Numbers start from either top 
            <br/> 
            or left not including the outside boundaries.
            <br/>
            (first line inside is 1)
          </label>
        </div>
        <div key="startSelector">
          <label>
            Row/ Column Number Min:
            <NumericInput precision={0} value={this.state.startSelector} step={1} onChange={this.handleStartSelChange}/>
          </label>
        </div>
        <div key="endSelector">
          <label>
            Row/ Column Number Max:
            <NumericInput precision={0} value={this.state.endSelector} step={1} onChange={this.handleEndSelChange}/>
          </label>
        </div>
        <div key="tModifier">
          <label>
            t = 
            <NumericInput precision={0} value={this.state.tNumerator} step={1} onChange={this.handletNumChange}/>
             / 
            <NumericInput precision={0} value={this.state.tDenominator} step={1} onChange={this.handletDomChange}/>
          </label>
        </div>
        <div key="rowDeleteButton">
          <label>
            <button onClick={this.deleteRows}>
              Delete Selected Rows
            </button>
          </label>
        </div>
        <div key="fileChoiceButton">
          <label>
            <WidgetLoader />
            <Widget 
              sources={['local']}
              resourceType={'image'}
              cloudName={'tablescanner420'}
              uploadPreset={'iC1hAFzm3fTsMp1xMbg2WFv29Dfw8z8MPUakLC07'}
              onSuccess={this.handleFileChange}
            />
            {/*<FileUploader handleChange={this.handleFileChange} name="file"/>*/}
            {/*<input type="file" onChange={this.handleFileChange} />*/}
          </label>
        </div>
        <div key="fileSubmitButton">
          <button onClick={this.handleDatasetSubmit}>
              Submit and Download Data
          </button>
        </div>
      </GridLayout>
      
    </article>);
    
  }
}

export default App;
