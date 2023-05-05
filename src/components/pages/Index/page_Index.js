import React, { Component } from 'react';

// Index page (test)
class Index extends Component  {
    constructor(props){
        super(props);
        this.name = "舊的名字";
        this.state = { // 宣告state物件，內包含一個變數percent
            percent: "30%"
        }
        this.changePercent = this.changePercent.bind(this);
    }
    //set state
    changePercent() { //加入changePercent函式
        this.setState({ percent: (this.state.percent === "70%") ? "30%" : "70%" })
    }
    render() {
        return (
            <div>
                <div className="progress-back" style={{ backgroundColor: "rgba(0,0,0,0.2)", width: "200px", height: "7px", borderRadius: "10px" }}>
                    <div className="progress-bar" style={{ backgroundColor: "#fe5196", width: this.state.percent, height: "100%", borderRadius: "10px" }}></div>
                </div>
                <button onClick={this.changePercent}> {this.state.percent} </button>
            </div>
        );
    }
}export default Index;