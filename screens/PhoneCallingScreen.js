import React, {useEffect, useLayoutEffect, useState} from 'react';

import {KeyboardAvoidingView, ImageBackground, StyleSheet, Text, View, Platform, Linking} from 'react-native';
import {Button, Input, Image} from 'react-native-elements';
import {StatusBar} from "expo-status-bar";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// const BASE_URL = 'https://wai-chat-api.herokuapp.com/';
import {BASE_URL} from "../constants";
const PhoneCallingScreen = ({navigation}) => {

    useEffect(() => {
        Linking.openURL('tel:021685354');
    }, []);

return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        onPress={() => {
          Linking.openURL('tel:021685354');
        }}>
        Call some phone
      </Text>
    </View>
  );
};

export default PhoneCallingScreen;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C5F5C2",
    },
    image: {
        // flex: 1,
        width: '100%',
        height: '100%',
        opacity: 0.9,
        justifyContent: "center",
        alignItems: 'center',
    },
    inputContainer: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        opacity: 0.7,
        marginTop: 20,
    },
    button: {
        width: 200,
        marginTop: 10,
        opacity: 1,
        backgroundColor: 'white'

    }
})

