import React, {Component} from 'react';
import {ImageBackground, Linking} from 'react-native';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Footer,
  FooterTab,
  Input,
  Item,
  Label,
  Text,
  View,
} from 'native-base';
import styles from './styles';

import Constant from '../../constant';
import ToastComponent from '../../component/toastComponent';
import RestApi from '../../rest-api/restApi';
import Endpoint from '../../rest-api/endpoint';
import Session from '../../component/session';

const logo = require('../../../assets/cikaopark.png');

class Login extends Component {
  static SESSION_USERNAME = 'username';
  static SESSION_PASSWORD = 'password';
  static SESSION_API_TOKEN = 'api-token';

  constructor(props) {
    super(props);
    this.restApi = new RestApi();
    this.autoLogin();
    this.session = new Session();
    this.state = {
      showToast: false,
      username: '',
      password: '',
    };
    this.initDataSession();
  }

  initDataSession = () => {
    let keys = ['username', 'password'];
    this.session.fetchMultiData(keys).then((data) => {
      if (data !== null) {
        let dataUsername = data[0][1];
        let dataPassword = data[1][1];
        if (dataUsername !== null) {
          this.setState({username: dataUsername});
        }
        if (dataPassword !== null) {
          this.setState({password: dataPassword});
        }
      }
    });
  };

  handleUsername = (text) => {
    this.setState({username: text});
  };

  handlePassword = (text) => {
    this.setState({password: text});
  };

  signIn = (username, password) => {
    if (username === '') {
      ToastComponent.showToast(
        'Username must be filled.',
        ToastComponent.TOAST_TYPE_WARNING,
      );
      return;
    }

    if (password === '') {
      ToastComponent.showToast(
        'Password must be filled.',
        ToastComponent.TOAST_TYPE_WARNING,
      );
      return;
    }

    this.openApiLogin(username, password).then((response) => {
      if (response.code === 200) {
        this.persistDataLoginIntoSession(username, password);
        this.openApiFetchDataLogin().then((responseFetchDataLogin) => {
          console.log(
            'response fetch data login = ' +
              JSON.stringify(responseFetchDataLogin),
          );
          if (responseFetchDataLogin.code === 200) {
            ToastComponent.showToast(
              'Login Success',
              ToastComponent.TOAST_TYPE_SUCCESS,
            );
          } else {
            ToastComponent.showToast(
              'an Error occurred when fetching data user.',
              ToastComponent.TOAST_TYPE_DANGER,
            );
          }
        });
      } else {
        ToastComponent.showToast(
          response.data.message,
          ToastComponent.TOAST_TYPE_WARNING,
        );
      }
    });
  };

  async openApiLogin(username, password) {
    let payload = {
      username: username,
      password: password,
    };
    console.log('payload = ' + JSON.stringify(payload));
    return await this.restApi.post(Endpoint.API_LOGIN, payload);
  }

  async openApiFetchDataLogin() {
    return await this.restApi.get(Endpoint.API_FETCH_DATA_LOGIN);
  }

  persistDataLoginIntoSession = (username, password) => {
    let data = [
      ['username', username],
      ['password', password],
    ];
    this.session
      .persistMultiData(data)
      .then((result) => console.log('persist = ' + result));
  };

  openApiCheckTokenValidity = async () => {
    return await this.restApi.get(Endpoint.API_CHECK_TOKEN_VALIDITY);
  };

  autoLogin = () => {
    this.openApiCheckTokenValidity().then((response) => {
      if (response.code === 200) {
        ToastComponent.showToast(
          'Login Success',
          ToastComponent.TOAST_TYPE_SUCCESS,
        );
      } else {
        ToastComponent.showToast(
          response.data.message,
          ToastComponent.TOAST_TYPE_WARNING,
        );
      }
    });
  };

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.imageView}>
          <ImageBackground source={logo} style={styles.logoContainer} />
        </View>

        <View>
          <Card style={styles.mb}>
            <CardItem>
              <Body style={styles.body}>
                <Item floatingLabel style={styles.floatingLabel}>
                  <Label>Username</Label>
                  <Input
                    onChangeText={this.handleUsername}
                    value={this.state.username}
                  />
                </Item>
                <Item floatingLabel style={styles.floatingLabel}>
                  <Label>Password</Label>
                  <Input
                    secureTextEntry
                    onChangeText={this.handlePassword}
                    value={this.state.password}
                  />
                </Item>
                <Button
                  block
                  style={{margin: 15, marginTop: 50}}
                  onPress={() =>
                    this.signIn(this.state.username, this.state.password)
                  }>
                  <Text>Sign In</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        </View>

        <Content padder />

        <Footer>
          <FooterTab>
            <Button>
              <Text
                style={styles.footerText}
                onPress={() => Linking.openURL(Constant.DEVELOPER_URL)}>
                Copyright © {Constant.getCurrentYear()} Surya Teknologi Nasional{' '}
                {'\n'} Developed & Maintenance by {Constant.DEVELOPER}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Login;
