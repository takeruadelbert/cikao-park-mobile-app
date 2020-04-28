import React, {Component, Fragment} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  BackHandler,
  Linking,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
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
  Text,
  Title,
} from 'native-base';
import ToastComponent from '../../component/toastComponent';
import Modal from 'react-native-modal';
import styles from './styles';

class ScanQRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
      tab1: false,
      tab2: true,
      tab3: false,
    };
  }

  onSuccess = (e) => {
    const check = e.data.substring(0, 4);
    console.log('scanned data' + check);
    this.setState({
      result: e,
      scan: false,
      ScanResult: true,
    });
    if (check === 'http') {
      Linking.openURL(e.data).catch((err) =>
        console.error('An error occured', err),
      );
    } else {
      this.setState({
        result: e,
        scan: false,
        ScanResult: true,
      });
    }
  };

  componentDidMount(): void {
    this.activeQR();
  }

  activeQR = () => {
    this.setState({
      scan: true,
    });
  };
  scanAgain = () => {
    this.setState({
      scan: true,
      ScanResult: false,
    });
  };

  logout = () => {
    let keys = ['password', 'tokenProfilePicture', 'fullName'];
    this.session.removeMultiData(keys).then((result) => {
      if (result) {
        console.log('Discard Data Session Success.');
        console.log('Logout ...');
        this.props.navigation.navigate('SignIn');
      } else {
        ToastComponent.showToast('an Error occurred when logout.', 'danger');
      }
    });
  };

  toggleModalLogout = (visible) => {
    this.setState({modalLogout: visible});
  };

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    return true;
  };

  render() {
    const {scan, ScanResult, result} = this.state;
    return (
      <Container style={styles.container}>
        <Modal isVisible={this.state.modalLogout}>
          <Card style={styles.mb}>
            <CardItem header bordered first>
              <Text>Logout Confirmation</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Are you sure you want to logout?</Text>
              </Body>
            </CardItem>
            <CardItem footer bordered last style={styles.modalCard}>
              <Text onPress={() => this.logout()}>Yes</Text>
              <Text
                style={styles.no}
                onPress={() => this.toggleModalLogout(false)}>
                No
              </Text>
            </CardItem>
          </Card>
        </Modal>
        <Header noLeft>
          <Body>
            <Title>Scan QR Code</Title>
          </Body>
        </Header>
        <Content style={styles.content}>
          <View>
            <Fragment>
              <StatusBar barStyle="dark-content" />

              {ScanResult && (
                <Fragment>
                  <Text>Result !</Text>
                  <View>
                    <Text>Type : {result.type}</Text>
                    <Text>Result : {result.data}</Text>
                    <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                    <TouchableOpacity onPress={this.scanAgain}>
                      <Text>Click to Scan again!</Text>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )}

              {scan && (
                <QRCodeScanner
                  reactivate={true}
                  showMarker={true}
                  ref={(node) => {
                    this.scanner = node;
                  }}
                  onRead={this.onSuccess}
                />
              )}
            </Fragment>
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              active={this.state.tab1}
              onPress={() => this.props.navigation.navigate('Dashboard')}>
              <Icon active={this.state.tab1} name="grid" />
              <Text styles={styles.text}>Dashboard</Text>
            </Button>
            <Button active={this.state.tab2}>
              <Icon active={this.state.tab2} name="barcode" />
              <Text>Redeem Item</Text>
            </Button>
            <Button
              active={this.state.tab3}
              onPress={() => this.toggleModalLogout(true)}>
              <Icon active={this.state.tab3} name="shuffle" />
              <Text>Logout</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default ScanQRCode;
