import { ProviderRpcClient } from 'everscale-inpage-provider'
const provider = new ProviderRpcClient()
const addresses = await this._wallet.provider.getAccountsByCodeHash({ codeHash: 'e5bc183e3bbc2ef49d380edca5640e3f72fca6416310e9a258dbb53949177785' })
