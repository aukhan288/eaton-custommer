import React,{useState} from 'react'
import { View, Text,Button, Dimensions, Pressable, Image, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import {Card,  Subheading} from 'react-native-paper';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const {height, width}=Dimensions.get('screen')
const Stripe=()=> {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { confirmPayment, initPaymentSheet } = useStripe();

  // Mock API to fetch client secret from your backend
  const fetchClientSecret = async () => {
    try {
      const response = await fetch('https://your-backend.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // You can pass user email or other data here
        }),
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error;
    }
  };

  // Handle payment submission
  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Fetch the client secret from your backend
      const clientSecret = await fetchClientSecret();

      if (!clientSecret) {
        Alert.alert('Error', 'Failed to get client secret.');
        setLoading(false);
        return;
      }

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) {
        setMessage('Failed to initialize payment sheet');
        setLoading(false);
        return;
      }

      // Confirm the payment
      const { error } = await confirmPayment(clientSecret, {
        type: 'Card',
        billingDetails: { email: email }, // Billing details for the customer
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
      } else {
        setMessage('Payment successful!');
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <StripeProvider publishableKey="pk_test_51QG3LkFdLRsHMkAfR6q4YuxDM2Fn3uFK9wRJKoGbCTaoxwoXisGJAKXvVdDscwzmWY3kTNiDYwT6MHcSUhAksA5600FeHN17HG">
      <View style={styles.container}>
        <Text style={styles.title}>Stripe Payment</Text>

        {/* Input for email */}
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Pay button */}
        <Button
          title={loading ? 'Processing...' : 'Pay Now'}
          onPress={handleSubmit}
          disabled={loading || !email}
        />

        {/* Display loading spinner or message */}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
  

export default Stripe;




