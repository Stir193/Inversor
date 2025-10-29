import React, {useState} from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

export default function AddTransactionScreen({ route, navigation }){
  const token = route.params?.token;
  const [ticker, setTicker] = useState('');
  const [type, setType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  async function save(){
    if(!ticker || !quantity || !price) return Alert.alert('Completa los campos');
    try {
      const res = await fetch('http://192.168.1.100:4000/api/portfolio/transactions', {
        method:'POST',
        headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({ ticker, type, quantity: Number(quantity), price: Number(price), date: new Date().toISOString() })
      });
      const data = await res.json();
      if(!res.ok) return Alert.alert('Error', data.error || 'Error');
      navigation.goBack();
    } catch(e){
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  }

  return (
    <View style={{ padding:20 }}>
      <TextInput placeholder="Ticker (Ej: AAPL)" value={ticker} onChangeText={setTicker} style={{height:40, borderColor:'#ccc', borderWidth:1, marginBottom:10, padding:8}} />
      <TextInput placeholder="Tipo (buy/sell)" value={type} onChangeText={setType} style={{height:40, borderColor:'#ccc', borderWidth:1, marginBottom:10, padding:8}} />
      <TextInput placeholder="Cantidad" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={{height:40, borderColor:'#ccc', borderWidth:1, marginBottom:10, padding:8}} />
      <TextInput placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" style={{height:40, borderColor:'#ccc', borderWidth:1, marginBottom:10, padding:8}} />
      <Button title="Guardar" onPress={save}/>
    </View>
  );
}
