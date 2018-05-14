import React, { Component } from 'react';
import Binance from './Binance';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateTickers } from '../actions/market';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      // post to dashboard/tickers to retrive list of tickers
      let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token: jwt})
      };
      fetch('/api/tickers', config)
      .then(response =>
        response.json())
        .then(tickers => {
          (console.log(tickers))
          // dispatch tickers to redux store
          this.props.updateTickers(tickers.payload);
        })
      }
    }

    render() {
      console.log("render tickers", this.props.tickers);
      const ticks = this.props.tickers.map((tick) => {
        if (tick.source === "binance") {
          return (
            <Binance tickData={tick} key={tick.ticker}/>
          )
        }
      });
      return (
        <div>
          {ticks}
        </div>
      );
    }
  }

  Dashboard.propTypes = {
    updateTickers: PropTypes.func.isRequired,
    tickers: PropTypes.array.isRequired
  };

  const mapStateToProps = state => ({
    tickers: state.market.tickers
  });

  export default connect(mapStateToProps, { updateTickers })(Dashboard);
