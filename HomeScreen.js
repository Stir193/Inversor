import React, {useEffect, useState} from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function HomeScreen({ route, navigation }){
  const token = route.params?.token;
  const [txs, setTxs] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(null);

  useEffect(()=>{
    if(!token) return;
    fetch('http://192.168.1.100:4000/api/portfolio/transactions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(setTxs).catch(()=>{});
  },[]);

  useEffect(()=>{
    if(!token) return;
    fetch('http://192.168.1.100:4000/api/portfolio/value', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()).then(j=>{
      if(j && j.total!=null) setPortfolioValue(j.total);
    }).catch(()=>{});
  },[]);


  return (
    <View style={{ flex:1, padding:20 }}>
      <Text style={{ fontSize:22, marginBottom:10 }}>Mi portafolio</Text>
      {portfolioValue!=null && <Text style={{ fontSize:18, marginBottom:10 }}>Valor total: ${portfolioValue.toFixed(2)}</Text>}
      <Button title="Añadir transacción" onPress={()=>navigation.push('AddTransaction', { token })}/>
      <FlatList
        data={txs}
        keyExtractor={i=>String(i.id)}
        renderItem={({item}) => (
          <View style={{ padding:10, borderBottomWidth:1 }}>
            <Text>{item.ticker} • {item.type} • {item.quantity} @ {item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}
