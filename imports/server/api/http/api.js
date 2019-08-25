import '../../../collections/validation.js';

API = {
  authentication(apiKey) {
    const getUser = APIKeys.findOne({ key: apiKey }, { fields: { owner: 1 } });
    if (getUser) {
      return getUser.owner;
    }
    return false;
  },
  connection(request) {
    const getRequestContents = API.utility.getRequestContents(request);
    const validUser = getRequestContents.api_key === 'testKey';

    if (validUser) {
      delete getRequestContents.api_key;
      return { owner: validUser, data: getRequestContents };
    }
    return { error: 401, message: 'Invalid API key.' };
  },
  handleRequest(context, resource, method) {
    const connection = API.connection(context.request);
    if (!connection.error) {
      API.methods[resource][method](context, connection);
    } else {
      API.utility.response(context, 401, connection);
    }
  },
  methods: {
    kyc: {
      GET() {},
      POST(context, connection) {
        const hasData = API.utility.hasData(connection.data);
        const validData = API.utility.validate(connection.data, {
          id: String,
          username: String,
          identity: Object,
          address: Object,
          phone: String,
          dataHash: String,
          zipHash: String,
        });
        if (hasData && validData) {
          const { data } = connection;
          const {
            id, username, identity, address, phone, dataHash, zipHash,
          } = data;
          console.log('API-data: ', data);
          Validation.insert({
            id,
            username,
            identity,
            address,
            phone,
            dataHash,
            zipHash,
            validationStatus: 'pending',
          });
          API.utility.response(context, 200, { message: `User: ${username} was updated` });
        } else {
          API.utility.response(context, 403, { error: 403, message: 'POST calls must have data passed in the request body in the correct formats.' });
        }
      },
      PUT() {},
      DELETE() {},
    },
  },
  utility: {
    getRequestContents(request) {
      switch (request.method) {
        case 'GET':
          return request.query;
        case 'POST':
        case 'PUT':
        case 'DELETE':
        default:
          return request.body;
      }
    },
    hasData(data) {
      return Object.keys(data).length > 0;
    },
    response(context, statusCode, data) {
      // eslint-disable-next-line no-param-reassign
      context.response.setHeader('Content-Type', 'application/json');
      // eslint-disable-next-line no-param-reassign
      context.response.statusCode = statusCode;
      // eslint-disable-next-line no-param-reassign
      context.response.end(JSON.stringify(data));
    },
    validate(data, pattern) {
      return Match.test(data, pattern);
    },
  },
};
