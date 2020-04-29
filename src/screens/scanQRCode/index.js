import React, {Component, Fragment} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BackHandler, Linking, View} from 'react-native';
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
  ListItem,
} from 'native-base';
import Modal from 'react-native-modal';
import NumericInput from 'react-native-numeric-input';
import styles from './styles';

import Logout from '../../component/logout';
import RestApi from '../../rest-api/restApi';
import Endpoint from '../../rest-api/endpoint';
import ToastComponent from '../../component/toastComponent';

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
      modalLogout: false,
      modalFailScan: false,
      code: '',
      message: '',
      listBonusItem: [],
      redeemItems: {},
    };
    this.logout = new Logout(this.props);
    this.restApi = new RestApi();
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
        console.error('An error occurred', err),
      );
    } else {
      this.setState({
        result: e,
        scan: false,
        ScanResult: true,
      });
      this.openApiScanQRCode(e.data);
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

  toggleModalLogout = (visible) => {
    this.setState({modalLogout: visible});
  };

  toggleModalFailScan = (visible, message) => {
    this.setState({modalFailScan: visible, message: message});
  };

  failScan = () => {
    this.setState({modalFailScan: false});
    this.scanAgain();
  };

  editRedeemItem = (key, itemId, itemQuantity) => {
    let newRedeemItems = this.state.redeemItems;
    newRedeemItems[key] = {bonusItemId: itemId, quantity: itemQuantity};
    this.setState({redeemItems: newRedeemItems});
  };

  openApiScanQRCode = (qrCode) => {
    this.setState({code: qrCode});
    let payload = {code: qrCode};
    this.restApi.post(Endpoint.API_SCAN_QR_CODE, payload).then((response) => {
      console.log('resp api = ' + JSON.stringify(response));
      if (typeof response.data.status === 'undefined') {
        this.renderListBonusItems(response);
        this.setupStateRedeemItems(response);
      } else {
        if (response.data.status === 200) {
        } else {
          this.toggleModalFailScan(true, response.data.message);
        }
      }
    });
  };

  renderListBonusItems = (response) => {
    this.setState({
      listBonusItem: response.data.details.map((item, key) => {
        return (
          <ListItem button key={item.bonusItemId}>
            <Text>
              {item.quantity} pc(s) {item.bonusItemLabel}
            </Text>
            <View style={styles.inputNumber}>
              <NumericInput
                minValue={0}
                maxValue={item.quantity}
                rounded
                onChange={(value) =>
                  this.editRedeemItem(key, item.bonusItemId, value)
                }
              />
            </View>
          </ListItem>
        );
      }),
    });
  };

  setupStateRedeemItems = (response) => {
    let temp = [];
    response.data.details.map((item) => {
      temp.push({
        bonusItemId: item.bonusItemId,
        quantity: 0,
      });
      return temp;
    });
    this.setState({redeemItems: temp});
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

  redeemBonusItem = () => {
    console.log('redeem items = ' + JSON.stringify(this.state.redeemItems));
    let calculateRedeemItems = this.removeZeroQuantityRedeemBonusItem();
    if (calculateRedeemItems.length <= 0) {
      ToastComponent.showToast('No Item to Redeem.', 'warning');
    } else {
      ToastComponent.showToast(
        'There are ' +
          calculateRedeemItems.length +
          ' item(s) being redeemed. (' +
          this.state.code +
          ')',
        'success',
      );
    }
  };

  removeZeroQuantityRedeemBonusItem = () => {
    let result = [];
    for (let bonusItem of this.state.redeemItems) {
      if (bonusItem.quantity > 0) {
        result.push(bonusItem);
      }
    }
    return result;
  };

  render() {
    const {scan, ScanResult} = this.state;
    return (
      <Container style={styles.container}>
        <Modal isVisible={this.state.modalFailScan}>
          <Card style={styles.mb}>
            <CardItem>
              <Body>
                <Text>{this.state.message}</Text>
              </Body>
            </CardItem>
            <CardItem footer bordered last style={styles.modalCard}>
              <Text onPress={() => this.failScan()} style={styles.ok}>
                Scan Again
              </Text>
            </CardItem>
          </Card>
        </Modal>
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
              <Text onPress={() => this.logout.signOut()}>Yes</Text>
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
            <Title>Redeem Bonus Item</Title>
          </Body>
        </Header>
        <Content style={styles.content}>
          <View>
            <Fragment>
              {ScanResult && (
                <View style={{flexDirection: 'column'}}>
                  {this.state.listBonusItem}
                  <Button
                    block
                    style={{margin: 15, marginTop: 50}}
                    onPress={() => this.redeemBonusItem()}>
                    <Text>Redeem Bonus Item</Text>
                  </Button>
                </View>
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
