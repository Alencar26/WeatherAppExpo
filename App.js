import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';

//import Icon from 'react-native-vector-icons/Ionicons'
import { Feather } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'

import MainCard from './components/MainCard'
import InfoCard from './components/InfoCard'
import getCurrentWeather from './api/Consultapi'

import * as Location from 'expo-location'


export default function App() {

  
  const [darkTheme, setDarkTheme] = useState(true)
  const [currentTemperature, setCurrentTemperature] = useState('27')
  const [location, setLocation] = useState('BR, Paraná')
  const [currentHour, setCurrentHour] = useState('13:00')

  const [wind, setWind] = useState('65')
  const [umidity, setHumidity] = useState('80')
  const [tempMin, setTempMin] = useState('22')
  const [tempMax, setTempMax] = useState('31')
  const [locationCoords, setLocationCoords] = useState([])


  // o Style deve ficar abaixo da variáveis
  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#232634' : '#f2f2f2',
      alignItems: "center", // alinha ao centro da tela no topo
      // justifyContent: "center", // alinha no CENTRO da tela
    },

    temperature: {

      alignItems: "center",
      flexDirection: "row", // para o itens ficaram um do lado do outro
      marginTop: 10,

    },

    temperatureText: {

      color: darkTheme ? '#e0e0e0' : 'black',
      fontSize: 50,

    },

    refreshButton: {

      position: 'absolute',
      margin: 30,
      alignSelf: 'flex-start', // para posicionar o elemento no início da tela do app, sem depender dos outros componentes

    },

    cardView: {

      color: darkTheme ? '#000' : '#fff',
      margin: 10,
      flexDirection: 'row', // deixa os cards um do lado do outros
      // alinhar tudo ao centro da telas
      alignItems: 'center',

    },

    info: {

      alignItems: 'center',
      backgroundColor: darkTheme ? '#393e54' : '#8f8f8f',
      borderRadius: 20,
      width:350,
      height:230,

    },

    infoText: {

      color: darkTheme ? '#e0e0e0' : '#fff',
      margin: 15,
      fontSize: 20,
      fontWeight: 'bold',

    },

    infoCards: {

      flexDirection: 'row', // deixar todos os itens um do lado do outros. "Em linha reta"
      flexWrap: 'wrap', // quebra a "linha de itens" quando a view acaba.

    },

    themeButton: {

      margin: 10,
      marginLeft: 300,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,

    },

    squareButton: {

      backgroundColor: darkTheme ? '#f2f2f2' : '#8f8f8f',
      justifyContent: 'center',
      borderRadius: 20,
      marginRight: 20,
      width: 50,
      height: 25,

    },

    circleButton: {

      backgroundColor: darkTheme ? '#232634' : '#f2f2f2',
      alignSelf: darkTheme ? 'flex-end' : 'flex-start',
      margin: 5,
      width: 20,
      height: 20,
      borderRadius: 50,

    },

  })

  async function setCurrentWeather() {

    await getLocation()
   
    let date = new Date()
    setCurrentHour(date.getHours() + ':' + date.getMinutes())

    const data = await getCurrentWeather(locationCoords)
    
    setCurrentTemperature(convertKelvinInC(data[0]))
    setTempMin(convertKelvinInC(data[1]))
    setTempMax(convertKelvinInC(data[2]))
    setLocation(data[3])
    setWind(data[4])
    setHumidity(data[5])

  }
  function convertKelvinInC(kelvin) {
    return parseInt(kelvin - 273)
  }

  async function getLocation() {

    let { status } = await Location.requestPermissionsAsync()
    if(status !== 'granted') {
      setErrorMsg('Sem Permição')
    }
    else{
      let location = await Location.getCurrentPositionAsync({})
      await setLocationCoords(location.coords)
      
    }

    // current, min, max, location, wind, humidity

  }

  useEffect(() => {
    setCurrentWeather()
  }, [])

  return(

    //style <== SEMPRE COM S MINUSCULO
    <View style={styles.container}>

      <TouchableOpacity onpress={() => setCurrentWeather()} style={styles.refreshButton}>
        <EvilIcons name="refresh" size={30} color={darkTheme ? '#fff' : '#000'} />
      </TouchableOpacity>

      <Feather name="sun" style={{ marginTop: 55 }} size={40} color="orange" />

      <View style={styles.temperature}>
        <Text style={styles.temperatureText}>{ currentTemperature }</Text>
        <Text style={[styles.temperatureText, {fontSize: 14}]}>°C</Text>
      </View>

      <Text style={[styles.temperatureText, {fontSize: 14}]}>{ location }, { currentHour }</Text>

      <View style={styles.cardView}>
        <MainCard title={ 'Manhã' } backgroundColor={ darkTheme ? '#ff873d' : '#cc6e30' } temperature={'24°'} icon={'morning'}></MainCard>
        <MainCard title={ 'Tarde' } backgroundColor={ darkTheme ? '#d29600' : '#fcc63f' } temperature={'31°'} icon={'afternoom'}></MainCard>
        <MainCard title={ 'Noite' } backgroundColor={ darkTheme ? '#008081' : '#38b7b8' } temperature={'15°'} icon={'nigth'}></MainCard>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>Informações adicionais</Text>
        <View style={styles.infoCards} >
          <InfoCard  title={'Vento'} value={wind + ' km/h'}/>
          <InfoCard  title={'Umidade'} value={umidity + '%'}/>
          <InfoCard  title={'Temp. Min'} value={tempMin + '°'}/>
          <InfoCard  title={'Temp. Max'} value={tempMax + '°'}/>
        </View>
      </View>

      <View style={styles.themeButton}>
        <View style={styles.squareButton}>
          <TouchableOpacity style={styles.circleButton} onPress={ () => darkTheme ? setDarkTheme(false) : setDarkTheme(true)}></TouchableOpacity>
        </View>
      </View>

    </View>

  )

}



