import React ,{useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,ImageBackground} from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [PedometerAvailability, setPedometerAvailability] = useState("");
  const [stepCount, updateStepCount] = useState(0)

  useEffect(()=>{
    subscribe();
  },[])

  subscribe = () =>{
    const subscription = Pedometer.watchStepCount((result)=>{
      updateStepCount(result.steps);
    })

    Pedometer.isAvailableAsync().then(
      (result) => {
        setPedometerAvailability(String(result));
      },
      (error) => {
        setPedometerAvailability(error);
      }
  );
}

  
  return (
    <View style={styles.container}>
      <ImageBackground 
      style= {{flex:1}}
      resizeMode='cover'
      source={require('./assets/back.png')}>
    <View style= {{
      flex : 1,
      justifyContent : "center"
    }}>
      <Text style={styles.heading}>
        걸음수 측정중... : 
        {PedometerAvailability}
      </Text>
      <Text>
        {stepCount}
      </Text>
    </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading : {
    color: "white",
    backgroundColor: 'rgba(155,89,182,0.5)',
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
  }
});
