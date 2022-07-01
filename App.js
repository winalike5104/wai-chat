import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
// import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import UserListScreen from "./screens/UserListScreen";
import PhoneCallingScreen from "./screens/PhoneCallingScreen";
import ChatDetailScreen from "./screens/ChatDetailScreen";
import SelectUserScreen from "./screens/SelectUserScreen";


const Stake = createStackNavigator();
const globalScreenOptions = {
    headerStyle: {backgroundColor: "#2c6bed"},
    headerTitleStyle: {color: "white"},
    headerTintColor: "white",

};


import * as Notification from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {useEffect, useState} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import searchBar from "./screens/searchUser";
import searchUser from "./screens/searchUser";


export default function App() {
    // const [userid, setUserID] = useState("");
    // const [messages, setMessages] = useState("");
    // const [hasNewMessage, setHasNewMessage] = useState(false);

    useEffect(() => {
        Permissions.getAsync(Permissions.NOTIFICATIONS)
            .then((statusObj) => {
                if (statusObj.status !== 'granted') {
                    return Permissions.askAsync(Permissions.NOTIFICATIONS);
                }
                return statusObj;
            }).then(statusObj => {
            if (statusObj.status !== 'granted') {
                alert('Notifications will be unavailable now');
                return;
            }
        });
    }, []);

    useEffect(() => {
        //When app is closed
        const backgroundSubscription = Notification.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        //When the app is open
        const foregroundSubscription = Notification.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        return () => {
            backgroundSubscription.remove();
            foregroundSubscription.remove();
        }
    }, []);
    //=======================================================



    return (
        <NavigationContainer>
            <Stake.Navigator
                screenOptions={globalScreenOptions}
            >
                <Stake.Screen
                    name={'login'} component={LoginScreen}
                />
                {/*<Stake.Screen*/}
                {/*    name={'register'} component={RegisterScreen}*/}
                {/*/>*/}
                <Stake.Screen
                    name={'home'} component={HomeScreen}
                />
                <Stake.Screen
                    name={'userList'} component={UserListScreen}
                />
                <Stake.Screen
                    name={'addChat'} component={AddChatScreen}
                />
                <Stake.Screen
                    name={'chat'} component={ChatScreen}
                />
                <Stake.Screen
                    name={'searchuser'} component={searchUser}
                />
                <Stake.Screen
                    name={'phonecall'} component={PhoneCallingScreen}
                />
                <Stake.Screen
                    name={'chatDetail'} component={ChatDetailScreen}
                />
                <Stake.Screen
                    name={'selectUser'} component={SelectUserScreen}
                />
            </Stake.Navigator>

        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
