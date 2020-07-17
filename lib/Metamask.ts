// Running on the page, in the browser
// This API will go live in early 2020
// It will be the only API available after a 6-week deprecation period

import BaseError from './BaseError';

interface ErrorWithCode extends Error {
  code: number;
}

export class Metamask {
  private ethereum: any;
  private _currentChainId?: number = undefined;
  private _currentAccount?: string = undefined;

  constructor(ethereum: any) {
    this.ethereum = ethereum;
  }

  /**
   * Handle chain (network) and chainChanged, per EIP 1193
   */
  private handleChainChanged = (chainId: number) => {
    if (this._currentChainId !== chainId) {
      this._currentChainId = chainId;
      // Run any other necessary logic...
    }
  };

  // For now, 'eth_accounts' will continue to always return an array
  private handleAccountsChanged = (accounts: string[]) => {
    console.log('handleAccountsChanged', accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      throw new MetamaskNotReadyError('Please connect to MetaMask.');
    } else if (accounts[0] !== this._currentAccount) {
      this._currentAccount = accounts[0];
      // Run any other necessary logic...
    }
  };

  public async init() {
    const { ethereum } = this;
    if (!ethereum || !ethereum.isMetaMask) {
      console.log('Please install MetaMask.');
      throw new MetamaskNotReadyError('Please install MetaMask.');
    }

    try {
      const chainId = await ethereum.send('eth_chainId');
      this.handleChainChanged(chainId);
      const accounts = await ethereum.send('eth_accounts');
      this.handleAccountsChanged(accounts);
    } catch (err) {
      // In the future, maybe in 2020, this will return a 4100 error if
      // the user has yet to connect
      if (err.code === 4100) {
        // EIP 1193 unauthorized error
        throw new MetamaskNotReadyError('Please connect to MetaMask.');
      }
    }

    ethereum.on('chainChanged', this.handleChainChanged);
    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on('accountsChanged', this.handleAccountsChanged);
  }

  public async connect() {
    console.log('metamask connect');
    // This is equivalent to ethereum.enable()
    try {
      const accounts = await this.ethereum.send('eth_requestAccounts');
      this.handleAccountsChanged(accounts);
    } catch (err) {
      if (err.code === 4001) {
        // EIP 1193 userRejectedRequest error
        throw new MetamaskNotReadyError('Please connect to MetaMask.');
      }
    }
  }

  public async initAndConnect(silent = false) {
    console.log('metamas initAndConnect', silent);
    try {
      await this.init();
      if (!silent) {
        await this.connect();
      }
      return this.ethereum;
    } catch (err) {
      console.log(err);
      if (!silent) {
        throw err;
      }
    }
  }

  public disconnect() {
    this.ethereum.disable();
  }

  get currentChainId() {
    return this._currentChainId;
  }

  get currentAccount() {
    console.log('metamask current account');
    return this._currentAccount;
  }

  get connected() {
    return this._currentAccount !== undefined;
  }
}

export class MetamaskNotReadyError extends BaseError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, MetamaskNotReadyError.prototype);
  }
}
