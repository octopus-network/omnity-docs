---
sidebar_position: 11
---

# Dogecoin

|  | Canister ID | Chain Id |
| --- | --- | --- |
| OMNITY_SETTLEMENT_DOGECOIN | nnqqa-aaaaa-aaaar-qamla-cai | Dogecoin |

## Update
### generate_ticket
```md title="generate_ticket(req: GenerateTicketArgs) -> Result<Vec<String>, CustomsError>"
Generate an cross-chain transaction from the dogecoin network on Omnity.
It does not pass the txid. Instead, the dogecoin custom will query the most recent transactions for this address, filter out the transactions that involve transfers to the deposit address, and then generate tickets.
```
***Sources*** : 
[`GenerateTicketArgs`](https://github.com/octopus-network/omnity-interoperability/)
[`CustomsError`](https://github.com/octopus-network/omnity-interoperability/)

### generate_ticket_by_txid
```md title="generate_ticket_by_txid(req: GenerateTicketWithTxidArgs)-> Result<(), CustomsError>"
When the txid is known, it will be used as input to generate a ticket.
```
***Sources*** : 
[`GenerateTicketWithTxidArgs`](https://github.com/octopus-network/omnity-interoperability/)
[`CustomsError`](https://github.com/octopus-network/omnity-interoperability/)


## Query
### get_fee_payment_address
```md title="get_fee_payment_address() -> Result<String, CustomsError>"
The dogecoin custom is responsible for covering transaction fees during the redeem. To manage these fees, a dedicated fee payment address is utilized. This API is designed to retrieve information about that address.
```
***Sources*** : [`CustomsError`](https://github.com/octopus-network/omnity-interoperability/)

### get_deposit_address
```md title="get_deposit_address(target_chain_id: String, receiver: String) -> Result<String, CustomsError>"
The function accepts target_chain_id and address as input and returns an address on the dogecoin chain. If you deposit dogecoin into this returned address, it is considered a cross-chain transfer to the specified address on the target chain. This works similarly to a proxy.
```
***Sources*** : [`CustomsError`](https://github.com/octopus-network/omnity-interoperability/)

### get_platform_fee
```md title="get_platform_fee(target_chain: ChainId) -> (Option<u128>, Option<String>)"
Retrieve the transaction fee.
```
***Sources*** : [`ChainId`](https://github.com/octopus-network/omnity-interoperability/)

### get_finalized_unlock_ticket_results
```md title="get_finalized_unlock_ticket_results() -> Vec<SendTicketResult>"
Retrieve the list of finalized redeem tickets where the source chain is the dogecoin chain.
```
***Sources*** : [`SendTicketResult`](https://github.com/octopus-network/omnity-interoperability/)

### get_finalized_lock_ticket_txids
```md title="get_finalized_lock_ticket_txids() -> Vec<String>"
Retrieve the list of finalized transfer tickets where the target chain is the dogecoin chain.
```
