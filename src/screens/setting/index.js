import React, {Component} from 'react';
import styles from '../setting/styles';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Footer,
  FooterTab,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Text,
  Title,
  View,
  Left,
  Right,
} from 'native-base';
import {ImageBackground, Linking} from 'react-native';
import Session from '../../component/session';
import Constant from '../../constant';
import ToastComponent from '../../component/toastComponent';

const logo = require('../../../assets/cikaopark.png');
const pattern = /^((http|https|ftp):\/\/)/;

class Setting extends Component {
  constructor(props) {
    super(props);
    this.session = new Session();
    this.state = {
      host: '',
    };
    this.initData();
  }

  initData = () => {
    this.session.fetchSingleData('host').then((result) => {
      if (result !== null) {
        this.setState({host: result});
      }
    });
  };

  handleHost = (input) => {
    this.setState({host: input});
  };

  saveSetting = (input) => {
    if (input === '') {
      ToastComponent.showToast(
        'Server Host Must be Filled.',
        ToastComponent.TOAST_TYPE_WARNING,
      );
      return;
    }

    if (!this.checkValidURL(input)) {
      ToastComponent.showToast(
        'Invalid URL Host.',
        ToastComponent.TOAST_TYPE_WARNING,
      );
      return;
    }

    if (input.slice(-1) !== '/') {
      ToastComponent.showToast(
        "Field Host must be end with character '/'.",
        ToastComponent.TOAST_TYPE_WARNING,
      );
      return;
    }
    this.storeHostIntoSession(input);
  };

  checkValidURL = (input) => {
    if (!pattern.test(input)) {
      return false;
    }
    return true;
  };

  storeHostIntoSession = (input) => {
    this.session.persistSingleData('host', input).then((result) => {
      if (result) {
        ToastComponent.showToast(
          'Setting has been saved successfully.',
          ToastComponent.TOAST_TYPE_SUCCESS,
        );
        this.props.navigation.replace('SignIn');
      } else {
        ToastComponent.showToast(
          "Something's wrong when saving setting.",
          ToastComponent.TOAST_TYPE_DANGER,
        );
      }
    });
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Setting</Title>
          </Body>
          <Right />
        </Header>

        <View style={styles.imageView}>
          <ImageBackground source={logo} style={styles.logoContainer} />
        </View>

        <View>
          <Card style={styles.mb}>
            <CardItem>
              <Body style={styles.body}>
                <Item floatingLabel style={styles.floatingLabel}>
                  <Label>Server Host</Label>
                  <Input
                    onChangeText={this.handleHost}
                    value={this.state.host}
                    style={styles.fieldHost}
                  />
                  <Icon active name="wifi" />
                </Item>
                <Button
                  block
                  style={{margin: 15, marginTop: 20}}
                  onPress={() => this.saveSetting(this.state.host)}>
                  <Text>Save</Text>
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

export default Setting;
