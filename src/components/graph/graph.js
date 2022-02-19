import React from "react";
import './graph.css';

class Graph extends React.Component {
    getMaxValue() {
        return Math.max(...this.props.renderList)
    }

    getMinValue() {
        return Math.min(...this.props.renderList)
    }

    renderBlock(item, idx) {
        let height = null
        if (this.getMaxValue() === this.getMinValue()) {
            height = '50%'
        } else {
            height = (5 + ((item - this.getMinValue()) * 95) / (this.getMaxValue() - this.getMinValue())) + '%'
        }

        return (
            <div className="graph__block"
                 key={`${item}` + idx}
                 style={{height: height}}
            />
        )
    }

    render() {
        const graph = this.props.renderList.map((price, idx) => this.renderBlock(price, idx))

        return (
            <div className="graph">
                <div className="graph__info">
                    <span className="graph__title">{this.props.selectedTicker.name}</span>
                    <button className="btn graph_btn"
                            onClick={this.props.onClick}
                    />
                </div>
                <div className="graph__wrapper">
                    {graph}
                </div>
            </div>
        );
    }
}

export default Graph;