import React, {Component} from 'react';
import {Linking, ImageBackground} from 'react-native';
import {
  Button,
  Container,
  Content,
  Footer,
  FooterTab,
  Input,
  Item,
  Label,
  Text,
  View,
  Card,
  CardItem,
  Body,
} from 'native-base';
import styles from './styles';

import Constant from '../../constant';
import TakeruHelper from '../../takeruHelper';
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
      TakeruHelper.showToast('Username must be filled.', 'warning');
      return;
    }

    if (password === '') {
      TakeruHelper.showToast('Password must be filled.', 'warning');
      return;
    }

    this.openApi(username, password).then((response) => {
      // const result = Object.keys(response).map((key) => ({
      //   [key]: response[key],
      // }));
      console.log(response);
    });
  };

  async openApi(username, password) {
    let payload = {
      username: username,
      password: password,
    };
    console.log('payload = ' + JSON.stringify(payload));
    let url = Constant.SERVER_HOST + Endpoint.API_LOGIN;
    let response;
    response = await this.restApi.post(url, payload);
    return response;
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
