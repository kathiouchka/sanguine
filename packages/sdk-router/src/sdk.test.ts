import { Provider } from '@ethersproject/abstract-provider'
import { providers as etherProvider } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'

import { SynapseSDK } from './sdk'
jest.setTimeout(30000)
// TODO add more tests checking parity of to and from values
// as well as more token/chain combinations
describe('SynapseSDK', () => {
  const ethProvider: Provider = new etherProvider.JsonRpcProvider(
    'https://rpc.builder0x69.io	'
  )
  const arbitrumProvider: Provider = new etherProvider.JsonRpcProvider(
    'https://arb1.arbitrum.io/rpc'
  )
  const avalancheProvider: Provider = new etherProvider.JsonRpcProvider(
    'https://api.avax.network/ext/bc/C/rpc'
  )
  const optimisimProvider: Provider = new etherProvider.JsonRpcProvider(
    'https://mainnet.optimism.io'
  )
  const bscProvider: Provider = new etherProvider.JsonRpcProvider(
    'https://endpoints.omniatech.io/v1/bsc/mainnet/public'
  )
  // test constructor
  describe('#constructor', () => {
    it('fails with unequal amount of chains to providers', () => {
      const chainIds = [42161, 43114, 10]
      const providers = [arbitrumProvider]
      expect(() => new SynapseSDK(chainIds, providers)).toThrowError(
        'Amount of chains and providers does not equal'
      )
    })
  })

  // test arb usdc > op usdc
  describe('bridgeQuote', () => {
    it('test', async () => {
      const chainIds = [42161, 10]
      const providers = [arbitrumProvider, optimisimProvider]
      const Synapse = new SynapseSDK(chainIds, providers)
      const { feeConfig, originQuery, destQuery, routerAddress } =
        await Synapse.bridgeQuote(
          42161,
          10,
          '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
          '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
          BigNumber.from('100000000')
        )
      expect(feeConfig?.bridgeFee).toBeGreaterThan(0)
      expect(originQuery?.length).toBeGreaterThan(0)
      expect(destQuery?.length).toBeGreaterThan(0)
      expect(routerAddress?.length).toBeGreaterThan(0)

      const { data, to } = await Synapse.bridge(
        '0x0AF91FA049A7e1894F480bFE5bBa20142C6c29a9',
        42161,
        10,
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        BigNumber.from('100000000'),
        originQuery!,
        destQuery!
      )
      expect(data?.length).toBeGreaterThan(0)
      expect(to?.length).toBeGreaterThan(0)
    })
  })

  // test avax usdc.e > bsc usdc
  describe('bridgeQuote', () => {
    it('test', async () => {
      const chainIds = [43114, 56]
      const providers = [avalancheProvider, bscProvider]
      const Synapse = new SynapseSDK(chainIds, providers)
      const { feeConfig, destQuery, originQuery } = await Synapse.bridgeQuote(
        43114,
        56,
        '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        BigNumber.from('100000000')
      )
      expect(feeConfig?.bridgeFee).toBeGreaterThan(0)
      expect(originQuery?.length).toBeGreaterThan(0)
      expect(destQuery?.length).toBeGreaterThan(0)
      const { data, to } = await Synapse.bridge(
        '0x0AF91FA049A7e1894F480bFE5bBa20142C6c29a9',
        43114,
        56,
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        BigNumber.from('100000000'),
        originQuery!,
        destQuery!
      )
      expect(data?.length).toBeGreaterThan(0)
      expect(to?.length).toBeGreaterThan(0)
    })
  })

  // test gohn arb > gohn avax
  describe('bridge', () => {
    it('test', async () => {
      const chainIds = [42161, 43114]
      const providers = [arbitrumProvider, avalancheProvider]
      const Synapse = new SynapseSDK(chainIds, providers)
      const { feeConfig, originQuery, destQuery } = await Synapse.bridgeQuote(
        42161,
        43114,
        '0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1',
        '0x321E7092a180BB43555132ec53AaA65a5bF84251',
        BigNumber.from('10000000000000000000')
      )
      expect(feeConfig?.bridgeFee).toBeGreaterThan(0)
      expect(originQuery?.length).toBeGreaterThan(0)
      expect(destQuery?.length).toBeGreaterThan(0)
      const { data, to } = await Synapse.bridge(
        '0x0AF91FA049A7e1894F480bFE5bBa20142C6c29a9',
        42161,
        43114,
        '0x321E7092a180BB43555132ec53AaA65a5bF84251',
        BigNumber.from('10000000000000000000'),
        originQuery!,
        destQuery!
      )
      expect(data?.length).toBeGreaterThan(0)
      expect(to?.length).toBeGreaterThan(0)
    })
  })
  describe('bridge', () => {
    it('test', async () => {
      const chainIds = [1, 42161]
      const providers = [ethProvider, arbitrumProvider]
      const Synapse = new SynapseSDK(chainIds, providers)
      const { feeConfig, originQuery, destQuery } = await Synapse.bridgeQuote(
        1,
        42161,
        '',
        '',
        BigNumber.from('1000000000000000000')
      )

      expect(feeConfig?.bridgeFee).toBeGreaterThan(0)
      expect(originQuery?.length).toBeGreaterThan(0)
      expect(destQuery?.length).toBeGreaterThan(0)
      const { data, to } = await Synapse.bridge(
        '0x0AF91FA049A7e1894F480bFE5bBa20142C6c29a9',
        42161,
        43114,
        '0x321E7092a180BB43555132ec53AaA65a5bF84251',
        BigNumber.from('10000000000000000000'),
        originQuery!,
        destQuery!
      )
      expect(data?.length).toBeGreaterThan(0)
      expect(to?.length).toBeGreaterThan(0)
    })
  })
})