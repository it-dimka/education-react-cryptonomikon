import React from "react";
import TickerAddForm from "../ticker-add-form/ticker-add-form";
import SearchPanel from "../search-panel/search-panel";
import TickersList from "../tickers-list/tickers-list";
import Graph from "../graph/graph";
import './app.css';

class App extends React.Component {
    static id = 1;

    constructor(props) {
        super(props);
        this.state = {
            trackedTickersList: [],
            availableTickers: [],
            graph: [],
            inputValueAddForm: '',
            filterValue: '',
            repeatTicker: false,
            selectedTicker: null
        };
    }

    componentDidMount() {
        if (localStorage.getItem('appID')) {
            App.id = Number(localStorage.getItem('appID'));
            this.setState({
                trackedTickersList: JSON.parse(localStorage.getItem('trackedTickersList'))
            });
        }

        this.downloadAvailableTickers();

        this.updateInterval = setInterval(this.updatePriceTickers, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    addTicker(event) {
        event.preventDefault();
        const trackedTickersName = this.getTrackedTickersNameList();
        const noRepeat = !trackedTickersName?.includes(this.state.inputValueAddForm.toUpperCase());
        const tickerAvailable = this.state.availableTickers.includes(this.state.inputValueAddForm.toUpperCase());
        if (noRepeat && tickerAvailable) {
            const trackedTickersList = this.state.trackedTickersList.slice();
            const newTicker = {id: App.id++, name: this.state.inputValueAddForm.toUpperCase(), price: '-'};
            trackedTickersList.push(newTicker);
            this.saveDataToLocalStorage(trackedTickersList);
            this.setState({
                trackedTickersList: trackedTickersList,
                inputValueAddForm: ''
            });
        }
    }

    deleteTicker(event) {
        event.stopPropagation();
        const id = Number(event.target.getAttribute('data-id'));

        const trackedTickersList = this.state.trackedTickersList.slice();
        const newTrackedTickersList = trackedTickersList.filter(ticker => ticker.id !== id);
        const newTrackedTickersListName = newTrackedTickersList.map(ticker => ticker.name);

        this.saveDataToLocalStorage(newTrackedTickersList);

        if (newTrackedTickersListName.includes(this.state.inputValueAddForm.toUpperCase())) {
            this.setState({
                trackedTickersList: newTrackedTickersList
            });
        } else {
            this.setState({
                trackedTickersList: newTrackedTickersList,
                repeatTicker: false
            });
        }

        if (id === this.state.selectedTicker) {
            this.setState({
                selectedTicker: null
            });
        }
    }

    selectTicker(id) {
        this.setState({
            selectedTicker: id,
            graph: []
        });
    }

    updatePriceTickers = async () => {
        const trackedTickersNames = this.getTrackedTickersNameList();
        const API_KEY = '5a12aecee1cde2235ae74f20da99ce4442aa59299bc0cdda271142dc6535a252';

        if (trackedTickersNames) {
            try {
                const trackedTickersList = this.state.trackedTickersList.slice();
                const graph = this.state.graph;

                const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${trackedTickersNames}&tsyms=USD&api_key=${API_KEY}`);
                const data = await response.json();

                const newTrackedTickersList = trackedTickersList.map(ticker => {
                    if (data[ticker.name]?.USD) {
                        ticker.price = data[ticker.name].USD > 1 ? data[ticker.name].USD.toFixed(2) : data[ticker.name].USD.toPrecision(2);
                        if (this.state.selectedTicker === ticker.id) {
                            graph.push(ticker.price);
                        }
                    } else {
                        ticker.price = 'Недоступно'
                    }
                    return ticker
                });

                this.saveDataToLocalStorage(newTrackedTickersList);

                this.setState({
                    trackedTickersList: newTrackedTickersList,
                    graph: graph
                });
            } catch (e) {
                console.log(e.message);
            }
        }
    };

    downloadAvailableTickers = async () => {
        const API_URL = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true';
        const availableTickers = this.state.availableTickers;
        try {
            if (!availableTickers.length) {
                const response = await fetch(`${API_URL}`);
                const data = await response.json();

                const newAvailableTickers = Object.keys(data.Data);
                this.setState({
                    availableTickers: newAvailableTickers
                });
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    saveDataToLocalStorage(tickersList) {
        localStorage.setItem('appID', String(App.id));
        localStorage.setItem('trackedTickersList', JSON.stringify(tickersList));
    }

    inputAddFormHandler(event) {
        const trackedTickersName = this.getTrackedTickersNameList();
        if (trackedTickersName?.includes(event.target.value.toUpperCase().trim())) {
            this.setState({
                inputValueAddForm: event.target.value.trim(),
                repeatTicker: true
            });
        } else {
            this.setState({
                inputValueAddForm: event.target.value.trim(),
                repeatTicker: false
            });
        }
    }

    inputSearchHandler(event) {
        this.setState({
            filterValue: event.target.value,
            selectedTicker: null
        });
    }

    filteredTickersList(value) {
        return this.state.trackedTickersList.filter(ticker => ticker.name.startsWith(value.toUpperCase()));
    }

    getTrackedTickersNameList() {
        if (this.state.trackedTickersList.length) {
            return this.state.trackedTickersList.map(ticker => ticker.name);
        }
    }

    closeGraphHandler() {
        this.setState({
            selectedTicker: null
        });
    }

    getSelectedTicker() {
        return this.state.trackedTickersList.find(ticker => ticker.id === this.state.selectedTicker);
    }

    getTickerOptionsAvailable() {
        if (this.state.inputValueAddForm) {
            return this.state.availableTickers.filter(name => name.startsWith(this.state.inputValueAddForm.toUpperCase())).slice(0, 4);
        }
    }

    availableTickerHandler(event) {
        const trackedTickersName = this.getTrackedTickersNameList();
        this.setState({
            inputValueAddForm: event.target.textContent
        });

        if (!trackedTickersName?.includes(event.target.textContent)) {
            const trackedTickersList = this.state.trackedTickersList;
            const newTicker = {id: App.id++, name: event.target.textContent, price: '-'};
            trackedTickersList.push(newTicker);

            this.saveDataToLocalStorage(trackedTickersList);

            this.setState({
                trackedTickersList: trackedTickersList,
                inputValueAddForm: '',
                repeatTicker: false
            });
        } else {
            this.setState({
                repeatTicker: true
            });
        }
    }

    render() {
        return (
            <div className="app">
                <TickerAddForm
                    value={this.state.inputValueAddForm}
                    errorInput={this.state.repeatTicker}
                    tickerOptionsAvailable={this.getTickerOptionsAvailable()}
                    onSubmit={this.addTicker.bind(this)}
                    onChangeInput={this.inputAddFormHandler.bind(this)}
                    onAvailableTickerClick={this.availableTickerHandler.bind(this)}
                />
                <SearchPanel
                    value={this.state.filterValue}
                    onChange={this.inputSearchHandler.bind(this)}
                />
                <TickersList
                    list={this.filteredTickersList(this.state.filterValue)}
                    onDeleteTicker={this.deleteTicker.bind(this)}
                    onSelectTicker={this.selectTicker.bind(this)}
                    activeTicker={this.state.selectedTicker}
                />
                {this.state.selectedTicker &&
                    <Graph
                        onClick={this.closeGraphHandler.bind(this)}
                        selectedTicker={this.getSelectedTicker()}
                        renderList={this.state.graph}
                    />
                }
            </div>
        );
    }
}

export default App;