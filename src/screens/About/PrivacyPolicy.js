import React, {useEffect, useState} from 'react';
import {View, Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import {API_BASE_URL} from '../../constants/Url';

const PrivacyPolicy = () => {
  const [about, setAbout] = useState();
  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchAllPolicy.php';
    var header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    fetch(authAPIURL, {
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setAbout(response.data[0].privacy_policy);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);
  return (
    <View style={{flex: 1}}>
      <WebView
        source={{html: about}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        onShouldStartLoadWithRequest={request => {
          if (request.url !== 'about:blank') {
            Linking.openURL(request.url);
            return false;
          } else return true;
        }}
      />
    </View>
  );
};

export default PrivacyPolicy;
