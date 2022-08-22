package config

import (
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/richardwilkes/toolbox/collection"
)

// ContractConfig defines the config for a specific contract.
type ContractConfig struct {
	// Address is the address of the contract.
	Address string `toml:"Address"`
	// StartBlock is the block number to start indexing events from.
	StartBlock uint64 `toml:"StartBlock"`
}

// ContractConfigs contains a map of name->contract config.
type ContractConfigs map[string]ContractConfig

// IsValid validates the contract configs by asserting no two contracts appear twice.
// It also calls IsValid on each individual ContractConfig.
func (c ContractConfigs) IsValid(ctx context.Context) (ok bool, err error) {
	addressSet := collection.NewStringSet()

	for _, cfg := range c {
		address := common.HexToAddress(cfg.Address).String()
		if addressSet.Contains(address) {
			return false, fmt.Errorf("duplicate contract address %s was found: %w", address, ErrDuplicateAddress)
		}

		ok, err = cfg.IsValid(ctx)
		if !ok {
			return false, err
		}

		addressSet.Add(address)
	}

	return true, nil
}

// IsValid validates the contract config.
func (c ContractConfig) IsValid(ctx context.Context) (ok bool, err error) {
	if c.Address == "" {
		return false, fmt.Errorf("field Address: %w", ErrRequiredField)
	}
	// the `+2` is for the 0x prefix
	if len(c.Address) != (common.AddressLength*2)+2 {
		return false, fmt.Errorf("address not correct length: %w", ErrAddressLength)
	}
	return true, nil
}
