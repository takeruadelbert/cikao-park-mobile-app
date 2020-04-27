import Endpoint from './endpoint';
import Constant from '../constant';
import Session from '../component/session';

interface IRestApi {
  get: (string) => Object;
  post: (string, string) => Object;
  put: (string, string) => Object;
}

class RestApi implements IRestApi {
  static HTTP_METHOD_GET = 'GET';
  static HTTP_METHOD_POST = 'POST';

  constructor() {
    this.code = '';
    this.hasAnyContent = false;
    this.data = {};
    this.session = new Session();
    this.httpHeader = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    };
  }

  async get(url) {
    await this.setupHttpHeader();
    return fetch(Constant.SERVER_HOST + url, {
      method: RestApi.HTTP_METHOD_GET,
      headers: this.httpHeader,
    })
      .then((response) => {
        return this.buildDataResponse(url, response);
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
    if (url !== Endpoint.API_LOGIN) {
      await this.setupHttpHeader();
    }
    return fetch(Constant.SERVER_HOST + url, {
      method: RestApi.HTTP_METHOD_POST,
      headers: this.httpHeader,
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return this.buildDataResponse(url, response);
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

  buildDataResponse = (url, response) => {
    console.log('response = ' + JSON.stringify(response));
    this.code = response.status;
    if (this.code === 200 && url === Endpoint.API_LOGIN) {
      this.persistTokenBearer(response);
    }

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

  persistTokenBearer = (response) => {
    let tokenBearer = response.headers.get('authorization');
    this.session.persistSingleData('api-token', tokenBearer).then((result) => {
      if (result) {
        console.log('Persist Token Bearer Into Session Success.');
      }
    });
  };

  setupHttpHeader = async () => {
    await this.session.fetchSingleData('api-token').then((token) => {
      this.httpHeader.Authorization = token;
      return true;
    });
  };
}

export default RestApi;
