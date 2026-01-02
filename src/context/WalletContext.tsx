'use client';

import React, { FC, ReactNode, useMemo, useCallback, useEffect } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

// Component to hide non-Solana wallets like MetaMask
const WalletFilter: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Hide MetaMask from wallet modal using MutationObserver
    const hideMetaMask = () => {
      const walletButtons = document.querySelectorAll('.wallet-adapter-modal-list li');
      walletButtons.forEach((li) => {
        const img = li.querySelector('img[alt="MetaMask icon"]');
        if (img) {
          (li as HTMLElement).style.display = 'none';
        }
      });
    };

    // Run on mount and observe for modal opening
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        hideMetaMask();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial hide
    hideMetaMask();

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  // Use devnet for development, mainnet-beta for production
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet'),
    []
  );

  // Only use Phantom wallet adapter
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const onError = useCallback((error: Error) => {
    console.error('Wallet error:', error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect
        onError={onError}
      >
        <WalletModalProvider>
          <WalletFilter>{children}</WalletFilter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
