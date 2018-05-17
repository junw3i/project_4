import React, { Component } from 'react';
import Binance from './Binance';
import CmcPrice from './CmcPrice';
import CmcVolume from './CmcVolume';
import Yahoo from './Yahoo';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateTickers } from '../actions/market';

class MarketData extends Component {
  constructor(props) {
    super(props);
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token: jwt})
      };
      fetch('/api/tickers', config)
      .then(response =>
        response.json())
        .then(tickers => {
          // dispatch tickers to redux store
          this.props.updateTickers(tickers.payload);
        })
      }
    }

    render() {
      const ticks = this.props.tickers.map((tick) => {
        if (tick.source === "binance") {
          return (
            <Binance tickData={tick} key={tick.ticker}/>
          )
        } else if (tick.source === "coinmarketcap-price") {
          return (
            <CmcPrice tickData={tick} key={tick.ticker}/>
          )
        } else if (tick.source === "yahoo-price") {
          return (
            <Yahoo tickData={tick} key={tick.ticker}/>
          )
        } else if (tick.source === "coinmarketcap-volume") {
          return (
            <CmcVolume tickData={tick} key={tick.ticker}/>
          )
        }
      });
      return (
        <div className="container-market">
          {ticks}
        </div>
      );
    }
  }

MarketData.propTypes = {
  updateTickers: PropTypes.func.isRequired,
  tickers: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  tickers: state.market.tickers
});

export default connect(mapStateToProps, { updateTickers })(MarketData);
