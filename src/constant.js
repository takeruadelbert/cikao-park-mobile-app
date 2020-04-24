class Constant {
  static APP_NAME = 'Cikao Park';
  static DEVELOPER = 'PT. Surya Teknologi Nasional';
  static DEVELOPER_URL = 'https://takeruadelbert.github.io/';

  static SERVER_HOST = 'https://cikaoticketing.staging.suryateknologi.com/api/';

  static getCurrentYear = () => {
    return new Date().getFullYear();
  };
}

export default Constant;
