import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { WebApp } from '@twa-dev/sdk';
import { useTonAddress } from '@tonconnect/ui-react';
import api from '../services/api';
import '../styles/WalletPage.css';

const WalletPage = () => {
  const { user, wallet, tonConnectUI } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userFriendlyAddress = useTonAddress();
  
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      
      try {
        // Fetch user's Pitcoin balance
        const balanceRes = await api.get(`/users/${user.id}/balance`);
        setBalance(balanceRes.data.balance);
        
        // Fetch transaction history
        const txRes = await api.get(`/users/${user.id}/transactions`);
        setTransactions(txRes.data.transactions);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        WebApp.showAlert('Failed to load wallet data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
  }, [user]);
  
  const handleConnectWallet = () => {
    tonConnectUI.openModal();
  };
  
  const handleDisconnectWallet = () => {
    tonConnectUI.disconnect();
  };
  
  const handleTransfer = () => {
    // Open a Telegram native transfer dialog
    WebApp.showPopup({
      title: 'Transfer Pitcoin',
      message: 'Enter amount and recipient',
      buttons: [
        {
          id: 'cancel',
          type: 'cancel',
          text: 'Cancel'
        },
        {
          id: 'transfer',
          type: 'default',
          text: 'Transfer'
        }
      ]
    });
  };

  if (isLoading) {
    return <div className="loading">Loading wallet data...</div>;
  }

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <h1>Your Wallet</h1>
        
        <div className="balance-card">
          <div className="balance-label">Pitcoin Balance</div>
          <div className="balance-amount">{balance} <span className="currency">PIT</span></div>
          <button 
            className="primary-button transfer-button"
            onClick={handleTransfer}
          >
            Transfer
          </button>
        </div>
        
        <div className="ton-wallet-section">
          <h2>TON Wallet</h2>
          {wallet ? (
            <div className="connected-wallet">
              <div className="wallet-address">
                {userFriendlyAddress}
              </div>
              <button 
                className="secondary-button"
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="connect-wallet">
              <p>Connect your TON wallet to make transactions</p>
              <button 
                className="primary-button"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="transaction-history">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className={`transaction-type ${tx.type}`}>
                  {tx.type === 'deposit' ? '↓' : '↑'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-title">{tx.description}</div>
                  <div className="transaction-date">{new Date(tx.timestamp).toLocaleString()}</div>
                </div>
                <div className={`transaction-amount ${tx.type}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount} PIT
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-transactions">
            No transactions yet. Start earning Pitcoin!
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage; 