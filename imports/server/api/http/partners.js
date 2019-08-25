/* eslint-disable class-methods-use-this, no-param-reassign */
class PartnersAPI {
  authentication(apiKey) {
    const getUser = APIKeys.findOne({ key: apiKey }, { fields: { owner: 1 } });
    if (getUser) {
      return getUser.owner;
    }
    return false;
  }

  getConnection(request) {
    const getRequestContents = this.getRequestContents(request);
    const apiKey = getRequestContents.api_key;
    const validUser = (apiKey === 'MIIJJwIBAAKCAgEAw31+kWrvUzL/RXo8TiCizYA5ScUGnNYxZeEE0wInuMWayQjxBvY2/4onWQE6mgRtTZ2FKsTErlQhRC84llv');
    if (validUser) {
      delete getRequestContents.api_key;
      return { owner: validUser, data: getRequestContents };
    }

    return { error: true, message: 'Invalid API key' };
  }

  handleRequest(context, method) {
    const connection = this.getConnection(context.request);
    if (!connection.error) {
      // TODO: check if method available (implemented)
      this[`handle_${method}`](context, connection);
    } else {
      this.response(context, 401, { message: connection.message });
    }
  }

  handleGet(context, connection) {
    const data = connection.data.email;
    const data2 = 'This is REST API.';
    const hasQuery = this.hasData(connection.data);
    if (hasQuery) {
      connection.data.owner = connection.owner;
      this.response(context, 200, data);
    } else {
      this.response(context, 200, data2);
    }
  }

  // Save data from our partners to a temporary table
  // TODO: rename this method
  handlePost(context, connection) {
    const hasData = this.hasData(connection.data);
    const validData = this.validate(connection.data, {
      partnerUserId: String,
      email: String,
      firstName: String,
      lastName: String,
      country: String,
      city: String,
      address: String,
    });

    if (hasData && validData.valid) {
      connection.data.owner = connection.owner;
      connection.data.createdAt = new Date();
      PartnerUsersTemp.insert(connection.data);
      this.response(context, 200, { message: 'User data accepted' });
    } else {
      this.response(context, 403, { message: validData.error });
    }
  }

  getRequestContents(request) {
    switch (request.method) {
      case 'GET':
        return request.query;
      case 'POST':
      case 'PUT':
      case 'DELETE':
        return request.body;
      default:
        return null;
    }
  }

  hasData(data) {
    return Object.keys(data).length > 0;
  }

  response(context, statusCode, data) {
    context.response.setHeader('Content-Type', 'application/json');
    context.response.statusCode = statusCode;
    context.response.end(JSON.stringify(data));
  }

  validate(data, pattern) {
    try {
      check(data, pattern);
    } catch (err) {
      return { valid: false, error: err.message };
    }
    return { valid: true };
  }
}

export default PartnersAPI;
