import React from "react";
import './tickers-list-item.css';

class TickersListItem extends React.Component {
    render() {
        let extraClass = 'ticker-list__item ';
        if (this.props.id === this.props.activeTicker) {
            extraClass += ' active'

        }
        return (
            <li className={extraClass}
                onClick={this.props.onSelectTicker}
            >
                <span className="ticker-list__item_title">{this.props.name} - USD</span>
                <span className="ticker-list__item_price">{this.props.price}</span>
                <button
                    className="btn ticker-list__item_btn"
                    data-id={this.props.id}
                    onClick={this.props.onDeleteTicker()}
                >Удалить</button>
            </li>
        );
    }
}

export default TickersListItem;