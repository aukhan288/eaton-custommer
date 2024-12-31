import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Linking,
  FlatList,
} from 'react-native';
import {Card, List} from 'react-native-paper';
import {API_BASE_URL} from '../../constants/Url';
import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';

const ContactUs = () => {
  const style = Styles();
  const theme = useTheme();
  const [contact, setContact] = useState([]);
  const openLink = url => {
    Linking.openURL(url)
      .then(data => {})
      .catch(() => {});
  };

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'appContactList.php';
    var header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    fetch(authAPIURL, {
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setContact(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    apiCall();
  }, []);

  const Item = props => (
    <Card
      style={style.cardConatiner}
      onPress={() => {
        props.link ? openLink(props.link) : null;
      }}>
      <List.Section>
        <List.Item
          left={prop => (
            <List.Icon {...prop} icon={props.icon} color={BaseColor.primary} />
          )}
          title={props.title}
          description={props.description}
          titleNumberOfLines={3}
          titleStyle={{
            color: theme.theme.text,
            fontFamily: 'JostRegular',
          }}
          descriptionStyle={{
            color: theme.theme.text,
            fontFamily: 'JostRegular',
          }}
        />
      </List.Section>
    </Card>
  );

  const contactItem = ({item}) => (
    <Item
      id={item.id}
      title={item.title}
      description={item.description}
      link={item.link}
      icon={item.icon}
    />
  );

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        data={contact}
        keyExtractor={(item, index) => String(index)}
        renderItem={contactItem}
      />
    </SafeAreaView>
  );
};

export default ContactUs;
