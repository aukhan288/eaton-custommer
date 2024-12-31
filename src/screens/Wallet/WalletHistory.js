import {
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {DataTable} from 'react-native-paper';
import {useSelector} from 'react-redux';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import Styles from './styles';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';
import { useTranslation } from 'react-i18next';

const WalletHistory = () => {
  const styles = Styles();
  const {t} = useTranslation()
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const [walletList, setWalletList] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWalletHistoryAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchWalletHistory.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: auth_mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        setWalletList(response.walletlist);
        setLoading(false)
      });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchWalletHistoryAPI();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [auth_mobile]);

  if (isInternetConnected) {
    return <NetworkError reloadPage={fetchWalletHistoryAPI} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.contentContainer}>
      <DataTable>
        <FlatList
          data={walletList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NotFound text="No History Found" />}
          ListHeaderComponent={() =>
            walletList.length > 0 ? (
              <DataTable.Header>
                <DataTable.Title textStyle={styles.tableTital}>
                  {t('date')}
                </DataTable.Title>
                <DataTable.Title textStyle={styles.tableTital}>
                  {t('amount')}
                </DataTable.Title>
                <DataTable.Title numeric textStyle={styles.tableTital}>
                  {t('remark')}
                </DataTable.Title>
              </DataTable.Header>
            ) : null
          }
          renderItem={({item}) => (
            <DataTable.Row>
              <DataTable.Cell textStyle={styles.tableCell}>
                {item.date}
              </DataTable.Cell>
              <DataTable.Cell textStyle={styles.tableCell}>
                {item.amount}
              </DataTable.Cell>
              <DataTable.Cell numeric textStyle={styles.tableCell}>
                {item.remark}
              </DataTable.Cell>
            </DataTable.Row>
          )}
          keyExtractor={item => item.id}
          key={item => item.id}
        />
      </DataTable>
    </SafeAreaView>
  );
};

export default WalletHistory;

const styles = StyleSheet.create({});
