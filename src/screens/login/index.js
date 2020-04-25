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

const logo = require('../../../assets/cikaopark.png');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      username: '',
      password: '',
    };
    this.restApi = new RestApi();
  }

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
      if (response['code'] === 200) {
        let responseFetchDataLogin = this.openApiFetchDataLogin();
        if (responseFetchDataLogin['code'] === 200) {
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
      } else {
        ToastComponent.showToast(
          response['data']['message'],
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
    let url = Constant.SERVER_HOST + Endpoint.API_LOGIN;
    return await this.restApi.post(url, payload);
  }

  async openApiFetchDataLogin() {
    let url = Constant.SERVER_HOST + Endpoint.API_FETCH_DATA_LOGIN;
    return await this.restApi.get(url);
  }

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
                  <Input onChangeText={this.handleUsername} />
                </Item>
                <Item floatingLabel style={styles.floatingLabel}>
                  <Label>Password</Label>
                  <Input secureTextEntry onChangeText={this.handlePassword} />
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
