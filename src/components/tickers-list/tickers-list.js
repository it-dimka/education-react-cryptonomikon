import React from "react";
import TickersListItem from "../tickers-list-item/tickers-list-item";
import './tickers-list.css';

class TickersList extends React.Component {
    renderTicker(item) {
        return (
            <TickersListItem
                key={item.id}
                name={item.name}
                price={item.price}
                id={item.id}
                activeTicker={this.props.activeTicker}
                onDeleteTicker={() => this.props.onDeleteTicker}
                onSelectTicker={() => this.props.onSelectTicker(item.id)}
            />
        );
    }

    render() {
        const trackedTickersList = this.props.list.map(ticker => this.renderTicker(ticker));

        return (
            <ul className="ticker-list">
                {trackedTickersList}
            </ul>
        );
    }
}

export default TickersList;