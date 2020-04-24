class RestApi {
  constructor() {
    this.code = '';
    this.hasAnyContent = false;
    this.data = {};
  }

  async post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
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
      })
      .then((responseJson) => {
        console.log('res = ' + JSON.stringify(responseJson));
        this.data = this.hasAnyContent ? JSON.stringify(responseJson) : {};
        return {
          code: this.code,
          data: this.data,
        };
      })
      .catch((error) => {
        console.error('error = ' + error);
        return {
          code: 500,
          data: error,
        };
      });
  }
}

export default RestApi;
