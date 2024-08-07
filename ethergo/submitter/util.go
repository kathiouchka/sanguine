package submitter

import (
	"fmt"
	"math/big"
	"sort"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/synapsecns/sanguine/core"
	"github.com/synapsecns/sanguine/ethergo/chain/gas"
	"github.com/synapsecns/sanguine/ethergo/submitter/db"
	"github.com/synapsecns/sanguine/ethergo/util"
	"go.opentelemetry.io/otel/attribute"
)

// copyTransactOpts creates a deep copy of the given TransactOpts struct
// with big ints wrapped in core.CopyBigInt().
func copyTransactOpts(opts *bind.TransactOpts) *bind.TransactOpts {
	copyOpts := &bind.TransactOpts{
		From:      opts.From,
		Nonce:     core.CopyBigInt(opts.Nonce),
		Signer:    opts.Signer,
		Value:     core.CopyBigInt(opts.Value),
		GasPrice:  core.CopyBigInt(opts.GasPrice),
		GasFeeCap: core.CopyBigInt(opts.GasFeeCap),
		GasTipCap: core.CopyBigInt(opts.GasTipCap),
		GasLimit:  opts.GasLimit,
		Context:   opts.Context,
		NoSend:    opts.NoSend,
	}
	return copyOpts
}

const (
	uuidAttr      = "tx.UUID"
	hashAttr      = "tx.Hash"
	fromAttr      = "tx.From"
	toAttr        = "tx.To"
	dataAttr      = "tx.Data"
	valueAttr     = "tx.Value"
	nonceAttr     = "tx.Nonce"
	gasLimitAttr  = "tx.GasLimit"
	chainIDAttr   = "tx.ChainID"
	gasPriceAttr  = "tx.GasPrice"
	gasFeeCapAttr = "tx.GasFeeCap"
	gasTipCapAttr = "tx.GasTipCap"
)

// txToAttributes converts a transaction to a slice of attribute.KeyValue.
func txToAttributes(transaction *types.Transaction, uuid string) []attribute.KeyValue {
	var from string
	call, err := util.TxToCall(transaction)
	if err != nil {
		from = fmt.Sprintf("could not be detected: %v", err)
	} else {
		from = call.From.Hex()
	}
	var attributes = []attribute.KeyValue{
		attribute.String(uuidAttr, uuid),
		attribute.String(hashAttr, transaction.Hash().Hex()),
		attribute.String(fromAttr, from),
		attribute.String(toAttr, addressPtrToString(transaction.To())),
		attribute.String(dataAttr, fmt.Sprintf("%x", transaction.Data())),
		attribute.String(valueAttr, bigPtrToString(transaction.Value())),
		// TODO: this could be downcast to int64, but it's unclear how we should handle overflows.
		// since this is only for tracing, we can probably ignore it for now.
		attribute.Int64(nonceAttr, int64(transaction.Nonce())),
		attribute.Int64(gasLimitAttr, int64(transaction.Gas())),
		attribute.String(chainIDAttr, bigPtrToString(transaction.ChainId())),
	}

	if transaction.Type() == types.LegacyTxType && transaction.GasPrice() != nil {
		attributes = append(attributes, attribute.String(gasPriceAttr, bigPtrToString(transaction.GasPrice())))
	}

	if transaction.Type() == types.DynamicFeeTxType && transaction.GasFeeCap() != nil {
		attributes = append(attributes, attribute.String(gasFeeCapAttr, bigPtrToString(transaction.GasFeeCap())))
	}

	if transaction.Type() == types.DynamicFeeTxType && transaction.GasTipCap() != nil {
		attributes = append(attributes, attribute.String(gasTipCapAttr, bigPtrToString(transaction.GasTipCap())))
	}

	return attributes
}

const nullFieldAttribute = "null"

func addressPtrToString(address *common.Address) string {
	if address == nil {
		return nullFieldAttribute
	}
	return address.Hex()
}

func bigPtrToString(num *big.Int) string {
	if num == nil {
		return nullFieldAttribute
	}
	return num.String()
}

// sortTxesByChainID sorts a slice of transactions by nonce.
func sortTxesByChainID(txs []db.TX, maxPerChain int) map[uint64][]db.TX {
	txesByChainID := make(map[uint64][]db.TX)
	// put the transactions in a map by chain id
	for _, t := range txs {
		txesByChainID[t.ChainId().Uint64()] = append(txesByChainID[t.ChainId().Uint64()], t)
	}

	for key := range txesByChainID {
		key := key // capture range variable
		// sort the transactions by nonce
		sort.Slice(txesByChainID[key], func(i, j int) bool {
			iNonce := txesByChainID[key][i].Nonce()
			jNonce := txesByChainID[key][j].Nonce()

			if iNonce == jNonce {
				gasCmp := gas.CompareGas(txesByChainID[key][i].Transaction, txesByChainID[key][j].Transaction, nil)
				if gasCmp == 0 || gasCmp == 1 {
					return false
				}
				return true
			}
			return iNonce < jNonce
		})
	}

	// cap the number of txes per chain
	for chainID, txes := range txesByChainID {
		if len(txes) > maxPerChain {
			txesByChainID[chainID] = txes[:maxPerChain]
		}
	}

	return txesByChainID
}

// groupTxesByNonce groups a slice of transactions by nonce.
// this will not differentiate between transactions with different chain ids.
func groupTxesByNonce(txs []db.TX) map[uint64][]db.TX {
	txesByNonce := make(map[uint64][]db.TX)
	for _, t := range txs {
		txesByNonce[t.Nonce()] = append(txesByNonce[t.Nonce()], t)
	}

	return txesByNonce
}

// Function to check if a slice contains a given big integer.
func contains(slice []*big.Int, elem *big.Int) bool {
	for _, v := range slice {
		if v.Cmp(elem) == 0 {
			return true
		}
	}
	return false
}

// Function to get the outersection of two slices of big.Int.
func outersection(set, superset []*big.Int) []*big.Int {
	var result []*big.Int
	for _, elem := range superset {
		if !contains(set, elem) {
			result = append(result, elem)
		}
	}
	return result
}

// Generic function to convert a map[uint64]T to []*big.Int.
func mapToBigIntSlice[T any](m map[uint64]T) []*big.Int {
	var result []*big.Int
	for k := range m {
		bigIntKey := new(big.Int).SetUint64(k)
		result = append(result, bigIntKey)
	}
	return result
}
