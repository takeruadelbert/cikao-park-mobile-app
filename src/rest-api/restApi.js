interface IRestApi {
  get: (string) => Object;

  post: (string, string) => Object;

  put: (string, string) => Object;
}

class RestApi implements IRestApi {
  static HTTP_METHOD_GET = 'GET';
  static HTTP_METHOD_POST = 'POST';
  static HTTP_HEADER = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  constructor() {
    this.code = '';
    this.hasAnyContent = false;
    this.data = {};
  }

  async get(url) {
    return fetch(url, {
      method: RestApi.HTTP_METHOD_GET,
      headers: RestApi.HTTP_HEADER,
    })
      .then((response) => {
        return this.buildDataResponse(response);
      })
      .then((responseJson) => {
        return this.buildDataResponseJson(responseJson);
      })
      .catch((error) => {
        console.error('error = ' + error);
        return {
          code: 500,
          data: error,
        };
      });
  }

  async post(url, payload) {
    return fetch(url, {
      method: RestApi.HTTP_METHOD_POST,
      headers: RestApi.HTTP_HEADER,
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return this.buildDataResponse(response);
      })
      .then((responseJson) => {
        return this.buildDataResponseJson(responseJson);
      })
      .catch((error) => {
        console.error('error = ' + error);
        return {
          code: 500,
          data: error,
        };
      });
  }

  buildDataResponse = (response) => {
    console.log('response = ' + JSON.stringify(response));
    this.code = response.status;

    let contentType = response.headers.get('Content-Type');
    this.hasAnyContent =
      contentType && contentType.indexOf('application/json') !== -1;
    if (this.hasAnyContent) {
      return response.json();
    } else {
      this.data = {};
      return {
        code: this.code,
        data: this.data,
      };
    }
  };

  buildDataResponseJson = (responseJson) => {
    console.log('res = ' + JSON.stringify(responseJson));
    this.data = this.hasAnyContent ? responseJson : {};
    return {
      code: this.code,
      data: this.data,
    };
  };
}

export default RestApi;
