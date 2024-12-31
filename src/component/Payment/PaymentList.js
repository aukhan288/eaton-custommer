import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { List, Card } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as paymentAction from '../../store/actions/PaymentAction';
import { BaseColor, useTheme } from '../../config/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CardField, StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { API_BASE_URL } from '../../constants/Url';

const PaymentList = props => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { paymentMethodeId, paymentMethodeTitle } = useSelector(state => state.PaymentReducer);
  
  // Local state to store card details, loading state, and payment status
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const { confirmPayment } = useStripe();

  const onPressCard = () => {
    dispatch(
      paymentAction.setPaymentMethode(
        props?.id,
        props?.title,
        props?.img,
        props?.api_key,
        props?.description,
      ),
    );
    props.setIsPaymentMethodeSelect(true);
  };

  // Fetch the PaymentIntent and process payment
  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus(null); // Reset previous status
  
    // Prepare the request to create the PaymentIntent
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      amount: 1000,  // Example amount (in cents)
      currency: "gbp",  // Example currency
      card: "card",  // Example currency
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      // Fetch the client_secret from your backend
      const response = await fetch(API_BASE_URL + "create-stripe-payment.php", requestOptions);
      
      
      const result = await response.json();
      console.log('***********',result);
      if (result) {
        console.log('11111111111');
      
        
        // Proceed to confirm the payment with the received client_secret
        const { error, paymentIntent } = await confirmPayment(result?.client_secret,  {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              number: cardDetails?.number,
              cvc: cardDetails?.cvc,
              expiryMonth: cardDetails?.expiryMonth,
              expiryYear: cardDetails?.expiryYear,
              last4: cardDetails?.last4,
            }
          },
        }
        );
        console.log('22222222222');
        if (error) {
          console.log('333333333333');
          setPaymentStatus(`Payment failed: ${error.message}`);
          console.error('Payment failed', error);
        } else if (paymentIntent) {
          console.log('555555555',paymentIntent);
          setPaymentStatus(`Payment status: ${paymentIntent.status}`); // Payment status
          console.log('PaymentIntent status:', paymentIntent.status);
        }
      } else {
        console.log('666666666666');
        setPaymentStatus("Error: No client secret returned from backend.");
      }
    } catch (error) {
      console.log('77777777777');
      setPaymentStatus(`Payment creation failed: ${error.message}`);
      console.error('Error during payment creation', error);
    }
  
    setLoading(false);
  };
  
  

  return (
    <Card style={[styles.card, { backgroundColor: theme.theme.background }]}>
      <TouchableOpacity style activeOpacity={0.7} onPress={() => onPressCard()}>
        <List.Item
          allowFontScaling={false}
          key={props.id}
          title={[props.title]}
          titleNumberOfLines={1}
          description={props.description}
          descriptionNumberOfLines={2}
          descriptionStyle={styles.description}
          titleStyle={[styles.title, { color: theme.theme.title }]}
          left={() => <Image source={{ uri: props.img }} style={styles.image} />}
          right={() =>
            props.id === paymentMethodeId ? (
              <View style={{ flexDirection: 'column', display: 'flex' }}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="checkmark-circle-sharp"
                    style={styles.icon}
                    size={20}
                  />
                </View>
              </View>
            ) : null
          }
          style={[
            styles.listItem,
            {
              borderColor: props.id === paymentMethodeId ? BaseColor.success : theme.theme.textLight,
            },
          ]}
        />
      </TouchableOpacity>

      {paymentMethodeTitle === 'Credit/Debit Card' && props.id === paymentMethodeId ? (
        <StripeProvider publishableKey={props?.api_key}>
          <View style={styles.cardFieldContainer}>
            <CardField
            dangerouslyGetFullCardDetails={true}
              postalCodeEnabled={false}
              placeholders={{ number: '4242 4242 4242 4242' }}
              onCardChange={(cardDetails) => setCardDetails(cardDetails)} // Update card details
              style={styles.cardField}
            />
            <TouchableOpacity
              onPress={handlePayment}
              style={styles.paymentButton}
              disabled={loading || !cardDetails?.complete} // Disable if card details are incomplete
            >
              <Text style={styles.paymentButtonText}>
                {loading ? 'Processing...' : 'Pay Now'}
              </Text>
            </TouchableOpacity>
            {paymentStatus && <Text style={styles.paymentStatus}>{paymentStatus}</Text>}
          </View>
          {console.log('ffffffffffff',cardDetails)
          }
        </StripeProvider>
      ) : null}
    </Card>
  );
};

export default PaymentList;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    marginBottom: 5,
    marginHorizontal: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    textAlign: 'justify',
    fontFamily: 'JostRegular',
  },
  title: {
    fontSize: 14,
    fontFamily: 'JostRegular',
  },
  image: {
    width: 60,
    height: 60,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  iconContainer: {
    justifyContent: 'center',
  },
  icon: {
    color: BaseColor.success,
    alignSelf: 'center',
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 5,
  },
  cardFieldContainer: {
    width: '100%',
    marginTop: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: BaseColor.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    zIndex: 1040,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
  },
  paymentStatus: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: 'green',
  },
});
