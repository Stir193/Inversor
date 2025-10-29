import React, {useState} from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

export default function LoginScreen({ navigation }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login(){
    try {
      const res = await fetch('http://192.168.1.100:4000/api/auth/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if(!res.ok) return Alert.alert('Error', data.error || 'Error');
      navigation.replace('Home', { token: data.token });
    } catch(e){
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  }

  return (
    <View style={{ padding:20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{height:40, borderColor:'#ccc', borderWidth:1, marginBottom:10, padding:8}} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={{height:40, borderColor:'#ccc', borderWidth:1, marginBottom:10, padding:8}} />
      <Button title="Entrar / Registrar" onPress={login}/>
    </View>
  );
}
