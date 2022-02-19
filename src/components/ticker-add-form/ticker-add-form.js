import React from "react";
import './ticker-add-form.css';

class TickerAddForm extends React.Component {
    tickerOptionsAvailable() {
        return Boolean(this.props.tickerOptionsAvailable?.length)
    }

    renderAvailableTicker(list) {
        return list.map(item => <span className="add-form__options-ticker-list_item"
                                      key={item}
                                      onClick={this.props.onAvailableTickerClick}
            >{item}</span>
        )
    }

    render() {
        return (
            <form className="add-form"
                  onSubmit={this.props.onSubmit}
            >
                <label className="add-form__label">
                    Тикер
                    <input
                        className="add-form__input"
                        type="text"
                        placeholder="Например BTC"
                        value={this.props.value.toUpperCase()}
                        onChange={this.props.onChangeInput}
                    />
                </label>
                {this.tickerOptionsAvailable() &&
                    <div className="add-form__options-ticker-list">
                        {this.renderAvailableTicker(this.props.tickerOptionsAvailable)}
                    </div>
                }
                {this.props.errorInput &&
                    <span className="errorSpan">Такой тикер уже добавлен</span>

                }
                <button
                    className="btn add-form__button"
                >Добавить
                </button>
            </form>
        )
    }
}

export default TickerAddForm;