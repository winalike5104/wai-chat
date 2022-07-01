import React, {useEffect, useLayoutEffect, useState} from 'react';

import {KeyboardAvoidingView, ImageBackground, StyleSheet, Text, View, Platform} from 'react-native';
import {Button, Input, Image} from 'react-native-elements';
import {StatusBar} from "expo-status-bar";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// const BASE_URL = 'https://wai-chat-api.herokuapp.com/';
import {BASE_URL} from "../constants";
const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [expoPushToken, setExpoPushToken] = useState('');
    const [token, setToken] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "WAI-CHAT",
            headerStyle: {backgroundColor: "#3B5F41"},
            headerTitleStyle: {color: "white"},
            headerTintColor: "black",
        })
    }, [navigation]);

    useEffect(async () => {
        let result = await SecureStore.getItemAsync("myToken");
        if (result) {
            navigation.navigate("home", {token: result});
        }

    }, []);

    async function registerForPushNotificationsAsync(token1) {
        let expoToken;
        if (Constants.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            expoToken = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(expoToken);
            console.log("before sent to db Token:"+token);
            console.log("before sent to db expoToken:"+expoToken);
            await registerNotificationsToBackend(token1, expoToken);
            console.log(expoToken);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return expoToken;
    }

    async function registerNotificationsToBackend(token, expoToken){
        console.log("inside sent to db Token:"+token);
        console.log("inside sent to db expoToken:"+expoToken);
        await axios.post(BASE_URL + 'api/createNotificationToken/', {
            token:token,
            expoToken:expoToken
        }).then(response=>console.log(response)).catch(error=> console.log(error));
    }

    const login = (username, password) => {
        if (!username || !password) {
            alert("Please enter all the required fields");
        } else {
            axios.post(BASE_URL + 'login/',
                {
                    username: username,
                    password: password
                }).then(async (response) => {
                await SecureStore.setItemAsync("myToken", response.data.token);
                await registerForPushNotificationsAsync(response.data.token).then(token => console.log(token));
                // console.log("expoToken: "+expoPushToken);
                navigation.navigate("home", {token: response.data.token});
            }).catch(err => {alert("Login Failed"); console.log(err)})
        }
    }

    return (
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <ImageBackground
                source={require('../assets/WechatIMG51.jpeg')}
                resizeMode="cover"
                style={styles.image}>
                {/* <StatusBar
                    animated={true}
                    backgroundColor="#61dafb"
                    barStyle={statusBarStyle}
                    showHideTransition={statusBarTransition}
                    hidden={hidden}/> */}

                <Image
                    source={require('../assets/chat.png')}
                    style={{
                        // backgroundColor:'white',
                        // opacity:0.4,
                        width: 210,
                        height: 200,
                    }}
                />
                <View style={styles.inputContainer}>
                    <Input
                        placeholder={"Username"}
                        autoFocus
                        type={"text"}
                        value={username}
                        onChangeText={(text => setUsername(text))}
                    />
                    <Input
                        placeholder={"Password"}
                        secureTextEntry
                        type={"password"}
                        value={password}
                        onChangeText={(text => setPassword(text))}
                        onSubmitEditing={() => {
                            login(username, password);
                        }}
                    />

                </View>
                <Button
                    color="#f194ff"
                    style={styles.button}
                    title={"Login"}
                    onPress={() => {
                        login(username, password);
                    }}
                />

                {/* <View style={{height: 100}}/> */}
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

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

