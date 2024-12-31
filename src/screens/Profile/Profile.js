import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Avatar, Divider} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from '../../store/actions/AuthAction';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        statuses =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

const Profile = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation()
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState(auth_mobile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [profileImg, updateProfileImg] = useState(null);

  const [nameError, setErrorName] = useState();
  const [passwordError, setpasswordError] = useState();
  const [isValidNamePattern, setIsValidNamePattern] = useState(true);
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(true);

  const [isInternetConnected, setIsInternetConnected] = useState(false);

  const [refCode, setRefCode] = useState();

  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const onChangeUsername = user_name => {
    user_name = user_name.replace(
      /[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    if (user_name.length < 6) {
      setName(user_name);
      setErrorName('Enter more than 6 Character');
      setIsValidNamePattern(false);
    }
    if (user_name.length >= 6) {
      setName(user_name);
      setErrorName('');
      setIsValidNamePattern(true);
    }
  };

  const onChangePassword = password => {
    if (password.length < 6) {
      setPassword(password);
      setpasswordError('Enter more than 6 Character');
      setIsValidPasswordPattern(false);
    }
    if (password.length >= 6) {
      setpasswordError('');
      setPassword(password);
      setIsValidPasswordPattern(true);
    }
  };

  const uploadProfilePic = async fileUri => {
    if (profileImg != null) {
      ToastAndroid.show('Please wait while data uploading', ToastAndroid.SHORT);
      const formData = new FormData();

      formData.append('file', {
        uri: fileUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      formData.append('mobile', mobile);

      try {
        const response = await fetch(API_BASE_URL + 'uploadProfilePic.php', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.ok) {
          const jsonResponse = await response.json();

          ToastAndroid.show(jsonResponse[0].message, ToastAndroid.LONG);
        } else {
          console.error('Failed to upload file:', response.status);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const updateProfileData = async () => {
    if (isValidNamePattern == true && isValidPasswordPattern == true) {
      try {
        await dispatch(
          authActions.updateProfileData(name, mobile, password, email),
        );
        ToastAndroid.show('Profile Updated', ToastAndroid.SHORT);
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Invalid Name or Password', ToastAndroid.SHORT);
    }
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 500,
      height: 500,
      compressImageQuality: 1,
    })
      .then(image => {
        updateProfileImg(image.path);
        uploadProfilePic(image.path);
        setVisible(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 500,
      height: 500,
      compressImageQuality: 1,
    })
      .then(image => {
        updateProfileImg(image.path);
        uploadProfilePic(image.path);
        setVisible(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchProfileDetails.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: auth_mobile,
    };

    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setPassword(response.data[0].password);
          setName(response.data[0].name);
          setEmail(response.data[0].email);
          updateProfileImg(response.data[0].profilePicturePath);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchRefCodeByMobileNo.php`;
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
        setRefCode(response.ref_code);
      });
  };

  const reloadPage = () => {
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        fetchWalletAmountAPI();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [auth_mobile]);

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1}}>
      <ScrollView>
        <View
          style={styles.avtarConatiner}>
          <Avatar.Image
            size={170}
            source={{uri: profileImg}}
          />
        </View>
        <View
          style={styles.uploadButtonContainer}>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={{padding: 10}}>
            <Icon
              name="camera"
              size={20}
              style={{
                color: 'white',
                position: 'relative',
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: 15}}>
          <View style={styles.inputTextContainer}>
            <Text style={styles.textInputHeading}>{t('referrel_code')}</Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                color={theme.theme.text}
                name="tag-heart"
                size={20}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.theme.title,
                  },
                ]}
                value={refCode}
                readOnly={true}
              />
            </View>
          </View>

          <View style={styles.inputTextContainer}>
            <Text style={styles.textInputHeading}>{t('mobile')}</Text>

            <View style={styles.textInputContainer}>
              <Image
                source={require('../../assets/image/pak.png')}
                style={styles.img}
              />
              <Text
                style={{
                  marginRight: 10,
                  fontFamily: 'JostRegular',
                  color: theme.theme.title,
                }}>
                {t('+92')}
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.theme.title,
                  },
                ]}
                keyboardType="numeric"
                value={mobile}
                readOnly={true}
                onChangeText={user_mobile => onChangeMobile(user_mobile)}
              />
            </View>
          </View>

          <View style={styles.inputTextContainer}>
            <Text style={styles.textInputHeading}>{t('name')}</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                color={theme.theme.text}
                name="account"
                size={20}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.theme.title,
                  },
                ]}
                value={name}
                onChangeText={name => onChangeUsername(name)}
              />
            </View>
            {nameError ? (
              <Text style={styles.termConditionText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputTextContainer}>
            <Text style={styles.textInputHeading}>{t('email')}</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                color={theme.theme.text}
                name="email"
                size={20}
              />
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.theme.title,
                  },
                ]}
                value={email}
                onChangeText={email => setEmail(email)}
                keyboardType="email-address"
              />
            </View>
            {nameError ? (
              <Text style={styles.termConditionText}>{nameError}</Text>
            ) : null}
          </View>

          {/* <TextInput
              allowFontScaling={false}
              label="Password"
              mode="flat"
              placeholder="Enter Password"
              underlinecolor={BaseColor.primary}
              onChangeText={user_password => onChangePassword(user_password)}
              value={password}
              outlinecolor={BaseColor.primary}
              style={{
                color: BaseColor.primary,
                marginVertical: 5,
                backgroundColor: 'white',
                display: 'none',
              }}
              theme={{colors: {primary: BaseColor.primary}}}
              // keyboardType='default'
              secureTextEntry={hidePass ? true : false}
              right={
                <TextInput.Icon
                  name="eye-off"
                  onPress={() => setHidePass(!hidePass)}
                />
              }
              left={<TextInput.Icon name="lock" size={24} />}
            />
            {passwordError ? (
              <Text style={{color: 'red', fontSize: 12}}>{passwordError}</Text>
            ) : null} */}
          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: BaseColor.primary}}}
            onPress={() => updateProfileData()}>
            {t('save')}
          </Button>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.theme.background},
            ]}>
            <View style={styles.btnConatiner}>
              <Button
                icon="camera"
                mode="contained"
                theme={{colors: {primary: BaseColor.primary}}}
                labelStyle={{fontFamily:'JostMedium'}}
                onPress={() => {
                  hasAndroidPermission(), takePhotoFromCamera();
                }}>
                {t('open_camera')}
              </Button>
              <Button
                icon="image"
                mode="contained"
                theme={{colors: {primary: BaseColor.primary}}}
                labelStyle={{fontFamily:'JostMedium'}}
                onPress={() => {
                  hasAndroidPermission(), choosePhotoFromLibrary();
                }}>
                {t('choose_image')}
              </Button>
            </View>
            <View style={styles.inputTextContainer}>
              <Button
                mode="flat"
                theme={{colors: {primary: BaseColor.primary}}}
                labelStyle={{fontFamily:'JostMedium'}}
                onPress={() => setVisible(false)}>
                {t('cancel')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  uploadButtonContainer:{
    backgroundColor: BaseColor.primary,
    borderRadius: 40,
    width: 40,
    height: 40,
    top: -50,
    left: 100,
  },
  avtarConatiner:{
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 15,
    borderColor: BaseColor.primary,
    borderWidth: 1,
    borderRadius: 85,
  },
  panel: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  panelTitle: {
    fontSize: 18,
    height: 35,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  btnConatiner: {flexDirection: 'row', justifyContent: 'space-between'},

  inputTextContainer: {marginTop: 15},
  textInputHeading: {
    color: BaseColor.label,
    fontFamily: 'JostRegular',
    fontSize: 12,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: BaseColor.primary,
  },
  logoIcon: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: BaseColor.backgroundColor,
  },
  textInput: {width: '100%', fontFamily: 'JostRegular'},
  img: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});
