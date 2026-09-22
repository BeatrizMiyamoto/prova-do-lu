import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [devices, setDevices] = useState([]);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(500);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const buscarDispositivosMock = () => {
    const simulados = [
      { id: '1', name: 'Fone Bluetooth BD-01' },
      { id: '2', name: 'Smartwatch BT-02' },
      { id: '3', name: 'Caixa de Som BT-03' }
    ];
    setDevices(simulados);
  };

  const abrirWhatsApp = () => {
    const url = 'https://wa.me/?text=Olá!%20Mensagem%20enviada%20pelo%20meu%20App';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acelerômetro (Sensor)</Text>
      <Text style={styles.text}>X: {data.x.toFixed(2)} | Y: {data.y.toFixed(2)} | Z: {data.z.toFixed(2)}</Text>

      <Text style={styles.title}>Conexão Bluetooth</Text>
      <Button title="Buscar Dispositivos" onPress={buscarDispositivosMock} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.deviceItem}>{item.name}</Text>
        )}
      />

      <Text style={styles.title}>Interação Externa</Text>
      <TouchableOpacity style={styles.button} onPress={abrirWhatsApp}>
        <Text style={styles.buttonText}>Compartilhar no WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  deviceItem: {
    padding: 8,
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});