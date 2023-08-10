# Wallet Monitoring Agent

## Description

This agent detects and alerts when my wallet sends ETH greater than 0.1

## Supported Chains

- Ethereum

## Alerts

- FORTA-1
  - Fired when a transaction from my wallet sends value over 0.1 ETH
  - Severity is always set to "info"
  - Type is always set to "info"

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x057fea9d4cbed6e2fe4e969d993e667dafaf8cbc0854a0bfb7fbebfcd418a137
