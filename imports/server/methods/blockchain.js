const ANDIT_GATEWAY_ADDR = 'http://80.232.171.254:5002/api/InvokeSmartContract';

const MAINNET = 'http://80.232.171.254:10332';

const METHODS = {
  GET_CLIENT: 'GetClient',
  KYC_CLIENT: 'KycClient',
  ADD_VERIFIER: 'AddVerifier',
  REWRITE_ADMIN: 'RewriteAdmin',
  CREATE_PASS: 'CreatePass',
};

const getData = (query, method, params) => (
  {
    data: {
      PrivateKey: query.privateKey,
      SmartContract: query.contractId,
      Address: query.address ? query.address : 'Acdy3RGNkRssAx7EXwWemkjjsAZJhC2sb6',
      SmartContractParameters: [
        { Param: [method] },
        { Param: [...params] },
      ],
      Invoke: true,
    },
  }
);

const getBlockchainData = (query, method, params) => (
  {
    data: {
      PrivateKey: '8a858d2549c5f032456ff4444f4e56800e8240806a37beaefc1974cdf1286bd6',
      SmartContract: query.contractId,
      Address: 'Acdy3RGNkRssAx7EXwWemkjjsAZJhC2sb6',
      SmartContractParameters: [
        { Param: [method] },
        { Param: [...params] },
      ],
      Invoke: false,
      OutputParameter: [
        {
          Name: 'ResultArray',
          OutputType: 'Array',
          Array: [
            {
              Name: 'Flag',
              OutputType: 'Number',
            },
            {
              Name: 'Timestamp',
              OutputType: 'Fixed',
            },
            {
              Name: 'Hash',
              OutputType: 'String',
            },
          ],
        }],
    },
  }
);

Meteor.methods({
  // params: clientId
  invokeGetClient(query, params) {
    try {
      return HTTP.call('POST', ANDIT_GATEWAY_ADDR, getBlockchainData(query, METHODS.GET_CLIENT, params));
    } catch (e) {
      return { error: true, message: e };
    }
  },

  // params: VerifierId, ClientId, Flag, FileHash(ex ValidUntil)
  invokeKycClient(query, params) {
    try {
      console.log(">>>>>>>>", params);
      return HTTP.call('POST', ANDIT_GATEWAY_ADDR, getData(query, METHODS.KYC_CLIENT, params));
    } catch (e) {
      return { error: true, message: e };
    }
  },

  // params: VerifierAddress
  invokeAddVerifier(query, params) {
    try {
      return HTTP.call('POST', ANDIT_GATEWAY_ADDR, getData(query, METHODS.ADD_VERIFIER, params));
    } catch (e) {
      return { error: true, message: e };
    }
  },

  // params: VerifierAddress
  invokeRewriteAdmin(query, params) {
    try {
      return HTTP.call('POST', ANDIT_GATEWAY_ADDR, getData(query, METHODS.REWRITE_ADMIN, params));
    } catch (e) {
      return { error: true, message: e };
    }
  },

  // params: UserId, UserHash
  invokeCreatePass(query, params) {
    try {
      return HTTP.call('POST', ANDIT_GATEWAY_ADDR, getData(query, METHODS.CREATE_PASS, params));
    } catch (e) {
      return { error: true, message: e };
    }
  },

  getTopBlock() {
    try {
      return HTTP.call('POST', MAINNET, {
        data: {
          jsonrpc: '2.0', method: 'getblockcount', params: [], id: 1,
        },
      });
    } catch (e) {
      return { error: true, message: e };
    }
  },

  getBlock(index) {
    try {
      return HTTP.call('POST', MAINNET, {
        data: {
          jsonrpc: '2.0', method: 'getblock', params: [index, 1], id: 1,
        },
      });
    } catch (e) {
      return { error: true, message: e };
    }
  },
});
