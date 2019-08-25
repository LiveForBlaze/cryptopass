APIreturn = {
  authentication(apiKey) {
    const getUser = APIKeys.findOne({ key: apiKey }, { fields: { owner: 1 } });
    if (getUser) {
      return getUser.owner;
    }
    return false;
  },
  connection(request) {
    const getRequestContents = APIreturn.utility.getRequestContents(request);
    const validUser = getRequestContents.api_key === 'testKey';

    if (validUser) {
      delete getRequestContents.api_key;
      return { owner: validUser, data: getRequestContents };
    }
    return { error: 401, message: 'Invalid API key.' };
  },
  handleRequest(context, resource, method) {
    const connection = APIreturn.connection(context.request);
    if (!connection.error) {
      APIreturn.methods[resource][method](context, connection);
    } else {
      APIreturn.utility.response(context, 401, connection);
    }
  },
  methods: {
    apireturn: {
      GET() {},
      POST(context, connection) {
        const hasData = APIreturn.utility.hasData(connection.data);
        const validData = APIreturn.utility.validate(connection.data, {
          id: String,
          validationStatus: String,
        });
        if (hasData && validData) {
          const { data } = connection;
          const { id, validationStatus } = data;
          Meteor.call('updateUserData', { id, validationStatus });
          APIreturn.utility.response(context, 200, { message: 'User was updated' });
        } else {
          APIreturn.utility.response(context, 403, { error: 403, message: 'POST calls must have data passed in the request body in the correct formats.' });
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
