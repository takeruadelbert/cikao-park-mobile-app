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
  Icon,
  Input,
  Item,
  Label,
  Spinner,
  Text,
  View,
} from 'native-base';
import Modal from 'react-native-modal';
import styles from './styles';

import Constant from '../../constant';
import ToastComponent from '../../component/toastComponent';
import RestApi from '../../rest-api/restApi';
import Endpoint from '../../rest-api/endpoint';
import Session from '../../component/session';

const logo = require('../../../assets/cikaopark.png');

class Login extends Component {
  constructor(props) {
    super(props);
    this.restApi = new RestApi();
    this.session = new Session();
    this.state = {
      username: '',
      password: '',
      loading: false,
      securePassword: true,
    };
    this.initDataSession();
  }

  toggleLoading = (visible) => {
    this.setState({loading: visible});
  };

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
      this.toggleLoading(true);
      if (response.code === 200) {
        this.persistDataLoginIntoSession(username, password);
        this.openApiFetchDataLogin().then((responseFetchDataLogin) => {
          console.log(
            'response fetch data login = ' +
              JSON.stringify(responseFetchDataLogin),
          );
          if (responseFetchDataLogin.code === 200) {
            let profilePictureToken =
              responseFetchDataLogin.data.profilePicture.token;
            let userFullName = responseFetchDataLogin.data.biodata.fullname;
            this.persistDataLoginUser(profilePictureToken, userFullName);
            this.resetState();
            this.toDashboard();
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
      setTimeout(() => {
        this.toggleLoading(false);
      }, 3000);
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
      .then((result) => console.log('persist data login = ' + result));
  };

  openApiCheckTokenValidity = async () => {
    return await this.restApi.get(Endpoint.API_CHECK_TOKEN_VALIDITY);
  };

  persistDataLoginUser = (tokenProfilePicture, fullName) => {
    let data = [
      ['tokenProfilePicture', tokenProfilePicture],
      ['fullName', fullName],
    ];
    this.session
      .persistMultiData(data)
      .then((result) => console.log('persist data login user = ' + result));
  };

  autoLogin = () => {
    this.toggleLoading(true);
    this.openApiCheckTokenValidity().then((response) => {
      if (response.code === 200) {
        let keys = ['password', 'tokenProfilePicture', 'fullName'];
        this.session.fetchMultiData(keys).then((data) => {
          if (data !== null) {
            let dataPassword = data[0][1];
            let dataTokenProfilePicture = data[1][1];
            let dataFullName = data[2][1];
            if (
              dataPassword !== null &&
              dataTokenProfilePicture !== null &&
              dataFullName !== null
            ) {
              this.resetState();
              this.toDashboard();
            } else {
              console.log('unable to auto login.');
            }
          }
        });
      } else {
        ToastComponent.showToast(
          response.data.message,
          ToastComponent.TOAST_TYPE_WARNING,
        );
      }
    });
    setTimeout(() => {
      this.toggleLoading(false);
    }, 1000);
  };

  componentDidMount(): void {
    this.autoLogin();
  }

  toDashboard = () => {
    this.props.navigation.navigate('Dashboard');
  };

  resetState = () => {
    this.setState({
      username: '',
      password: '',
      loading: false,
    });
  };

  viewPassword = () => {
    console.log('masuk');
    this.setState((prevState) => ({
      securePassword: !prevState.securePassword,
    }));
  };

  render() {
    return (
      <Container style={styles.container}>
        <Modal isVisible={this.state.loading}>
          <View style={styles.spinner}>
            <Spinner color="red" />
          </View>
        </Modal>

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
                  <Icon active name="person" />
                </Item>
                <Item floatingLabel style={styles.floatingLabel}>
                  <Label>Password</Label>
                  <Input
                    secureTextEntry={this.state.securePassword}
                    onChangeText={this.handlePassword}
                    value={this.state.password}
                  />
                  <Icon active name="eye" onPress={() => this.viewPassword()} />
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
