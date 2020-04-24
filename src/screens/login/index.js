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
  Image,
} from 'native-base';
import styles from './styles';
import Constant from '../../constant';
import TakeruHelper from '../../takeruHelper';

const logo = require('../../../assets/cikaopark.png');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      username: '',
      password: '',
    };
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

    TakeruHelper.showToast(
      'username : ' + username + ' password : ' + password,
      'success',
    );
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
                onPress={() => Linking.openURL(Constant.developerURL)}>
                Copyright © {Constant.getCurrentYear()} Surya Teknologi Nasional{' '}
                {'\n'} Developed & Maintenance by {Constant.developer}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Login;
