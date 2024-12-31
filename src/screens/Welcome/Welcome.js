import React from 'react'
import { View, Text, Dimensions, Pressable, Image } from 'react-native'
import {useNavigation} from '@react-navigation/native';

const {height, width}=Dimensions.get('screen')
const Welcome=()=> {
  const navigation = useNavigation()
  return (
    <View style={{flex:1,width:width, height:height, flexDirection:'column',backgroundColor:'#FFF', position:'relative', alignItems:'center'}}>
      <Image source={require('../../assets/image/header-light.png')}
      style={{width:width/2, height:width/4, position:'absolute',top:height*0.25}}
      />
      <View
      style={{width:width,  position:'absolute', bottom:30, flexDirection:'row', justifyContent:'space-around'}}
      >
       <Pressable 
       onPress={()=>navigation.navigate('BottomTabScreen', {
        screen: 'Home',
      })}
       style={{borderRadius:100, padding:15, justifyContent:'center', alignItems:'center', backgroundColor:'#FFBE33', width:width*0.45}}>
        <Text style={{color:'#FFF', fontWeight:'700'}}>Guest</Text>
       </Pressable>
       <Pressable 
       onPress={()=>navigation.navigate('Login')}
       style={{borderRadius:100, padding:15, justifyContent:'center', alignItems:'center', backgroundColor:'#BF0000', width:width*0.45}}>
        <Text style={{color:'#FFF', fontWeight:'700'}}>Login</Text>
       </Pressable>
      </View>
    </View>
  )
}

export default Welcome;