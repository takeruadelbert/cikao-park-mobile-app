import React, {Component, Fragment} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Linking, StatusBar, Text, TouchableOpacity, View} from 'react-native';

class ScanQRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
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

  render() {
    const {scan, ScanResult, result} = this.state;
    const desccription =
      'QR code (abbreviated from Quick Response Code) is the trademark for a type of matrix barcode (or two-dimensional barcode) first designed in 1994 for the automotive industry in Japan. A barcode is a machine-readable optical label that contains information about the item to which it is attached. In practice, QR codes often contain data for a locator, identifier, or tracker that points to a website or application. A QR code uses four standardized encoding modes (numeric, alphanumeric, byte/binary, and kanji) to store data efficiently; extensions may also be used.';
    return (
      <View>
        <Fragment>
          <StatusBar barStyle="dark-content" />
          <Text>Welcome To React-Native QR Code Tutorial !</Text>
          {!scan && !ScanResult && (
            <View>
              <Text numberOfLines={8}>{desccription}</Text>

              <TouchableOpacity onPress={this.activeQR}>
                <Text>Click to Scan !</Text>
              </TouchableOpacity>
            </View>
          )}

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
              topContent={
                <Text>
                  Go to <Text>wikipedia.org/wiki/QR_code</Text> on your computer
                  and scan the QR code to test.
                </Text>
              }
              bottomContent={
                <View>
                  <TouchableOpacity onPress={() => this.scanner.reactivate()}>
                    <Text>OK. Got it!</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.setState({scan: false})}>
                    <Text>Stop Scan</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </Fragment>
      </View>
    );
  }
}

export default ScanQRCode;
