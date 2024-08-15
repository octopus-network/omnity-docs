---
sidebar_position: 2
---

# Hub

## Query

### get_add_runes_token_requests
### get_self_service_fee
### get_fee_account
### get_chains
### get_chain
### get_tokens
### get_fee
### get_chain_tokens
### get_token_position_size
### get_tx
### get_txs_with_chain
### get_txs_with_account
### get_txs
### get_total_tx

### query_tx_hash
### get_chain_metas
### get_chain_size
### get_token_metas
### get_token_size
### sync_ticket_size
### sync_tickets
### get_tx_hash_size
### get_tx_hashes
### get_pending_ticket_size
### get_pending_tickets
### query_tickets


### get_token_list
### getRuneTokenBalance
### get_btc_address
### release_token_status
### generate_ticket_status
### mint_token_status
### get_token_ledger
### get_redeem_fee




## Update
### add_runes_token
### add_dest_chain_for_token

### resubmit_ticket
### update_tx_hash




### add_runes_token(args: AddRunesTokenReq)
Back-end usage example:
```bash
dfx canister call omnity_hub get_pending_tickets '(0:nat64,5:nat64)'
```
Font-end usage example:
```bash
const res = await actor.add_runes_token({
        dest_chain,
        icon,
        rune_id,
        symbol,
      });
```