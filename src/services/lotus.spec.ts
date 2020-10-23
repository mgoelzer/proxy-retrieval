import {
  confirmFunds,
  FundsStatus,
  getClientMinerQueryOffer,
  retrieve,
  version,
  walletBalance,
  walletNew,
} from './lotus'

// CIDs
// bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq
// bafykbzacecdt3sxmqj2xi6ntatf4ikycu6korkyv3pd632zot64lah5oonftw

const mock = {
  cid: 'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq',
  dataCid: 'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq',
  miner: 'f033048',
  wallet: 'f1zlclil7vvbhqx5h4wbfevpgc3amhmrtg46dhb7a',
  emptyWallet: 'f1crikx6lnjxwangz5azdkqmpqmj32twrrwr3ncuq',
  retrieveWallet: 'f1xgvqfhauw3r2cuhjp3n3ajlriwvt6m4lofoh2zy',
  minerID: 'f033048',
  requiredFunds: '1000000000000000000',
  notEnoughFunds: '1000000000000000001',
}

describe('services/lotus', () => {
  describe('getClientMinerQueryOffer', () => {
    it('returns the availability for a CID', async () => {
      const { result } = await getClientMinerQueryOffer(mock.miner, mock.cid)

      expect(result.Err).toEqual('')
      expect(+result.MinPrice).toBeGreaterThanOrEqual(0)
    })
  })

  describe('confirmFunds', () => {
    it('checks required funds', async () => {
      const result = await confirmFunds(mock.wallet, mock.requiredFunds, 10)

      expect(result).toEqual(FundsStatus.FundsConfirmed)
    }, 60000)

    it('checks insufficient funds', async () => {
      const result = await confirmFunds(mock.wallet, mock.notEnoughFunds, 10)

      expect(result).toEqual(FundsStatus.ErrorInsufficientFunds)
    }, 60000)
  })

  describe('walletNew', () => {
    it('creates a new wallet', async () => {
      const wallet = await walletNew()

      expect(wallet.error && wallet.error.message).toBeFalsy()
      expect(wallet.result).toContain('f1')
    })
  })

  describe('walletBalance', () => {
    it('returns the wallet balance', async () => {
      const wallet = await walletBalance(mock.emptyWallet)

      expect(wallet.result).toEqual('0')
    })
  })

  describe('version', () => {
    it('returns Lotus API version', async () => {
      const ver = await version()

      expect(ver.result.Version).toBeTruthy()
    })
  })

  describe('retrieve', () => {
    it('returns a file', async () => {
      const file = await retrieve(mock.dataCid, mock.minerID, mock.retrieveWallet)

      expect(file).toBeTruthy()
    })
  })
})
