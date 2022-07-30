import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { View , Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Fontisto } from "@expo/vector-icons";

const { width : SCREEN_WIDTH } = Dimensions.get("window"); // const SCREEN_WIDTH = Dimensions.get("window").width와 같음.

const API_KEY = "a8e9a22affce1e1775f11d2e00e4f821";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Atmosphere: "cloudy-gusts",
  Thunderstorm: "lightning",
};

export default function App() {
  const [region, setRegion] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps:false});
    setRegion(location[0].region);
    const response = await  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(()=>{
   getWeather();
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{region}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
        <View style={{...styles.day, alignItems: "center"}}>
          <ActivityIndicator color='black' style={{marginTop:10}}size='large'/>
        </View>
        ) : (
          days.map((day,index) => (
          <View key={index} style={styles.day}>
            <View style={{
              flexDirection: "row",
              alignItems:"center",
              justifyContent:"space-around",
              width : "100%",
              marginLeft:-40,
              }}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="black" />
            </View>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>
        ))
      )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
      
  );
}

const styles = StyleSheet.create({
 container:{
  flex: 1, 
  backgroundColor :"#FFD700",
 },
 city: {
  flex: 1.2,
  justifyContent:"center",
  alignItems:"center",
 },
 cityName:{
  fontSize:68,
  fontWeight:"500",
 },
 day:{
  width : SCREEN_WIDTH,
  marginLeft: 20,
 },
 temp:{
  marginTop:50,
  fontSize:88,
 },
 description:{
  marginTop:-20,
  fontSize:30,
 },
 tinyText:{
  fontSize:20,
  marginTop:-10,
 },
});