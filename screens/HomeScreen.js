import React, {useEffect, useLayoutEffect, useState} from 'react';

import {SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import CustomListItem from "../components/CustomListItem";
import {Avatar} from "react-native-elements";
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// const BASE_URL = 'https://wai-chat-api.herokuapp.com/';
import {BASE_URL} from "../constants";

const HomeScreen = ({route, navigation}) => {
    const {token} = route.params;
    const [chats, setChats] = useState([]);
    // const [token, setToken] = useState("");
    const [userid, setUserID] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [loading, setLoading] = useState(false);

    const getName = async (token1) => {
        await axios.get(BASE_URL + 'user/', {
            headers: {
                'Authorization': `Token ` + token1
            }
        }).then(function (response) {
            // handle success
            setUserID(response.data.id);
            setFirst_name(response.data.first_name);
            setLast_name(response.data.last_name);
        }).catch(function (error) {
            // handle error
            console.log("getName no token");
            console.log(error);
            SecureStore.deleteItemAsync("myToken");
            navigation.navigate("login");
        });
    }
    const getRooms = async (token1) => {
        //console.log(token1);
        await axios.get(BASE_URL + 'api/getUserChatrooms/', {
            headers: {
                'Authorization': `Token ` + token1
            }
        }).then(function (response) {
            // handle success
            // console.log("chat rooms:"+response.data[0].id);
            setChats(response.data.rooms);
        }).catch(function (error) {
            // handle error
            console.log("get rooms no token");
            console.log(error);
            SecureStore.deleteItemAsync("myToken");
            navigation.navigate("login");
            
        });
    }

    useEffect(() => {
        // Add inner async function
        (async () => {
            // console.log("token:"+token);
            try {
                // const token1 = await getMyToken();
                const id1 = await getName(token);
                const room = await getRooms(token);
                // console.log("lastname: "+last_name);
                if (last_name === "" && chats.length === 0) {
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (err) {
                console.log(err);
            }
        })()

        // Call function immediately
        // fetchName().then(r => console.log("r:"+r));
    }, [last_name, chats])

    async function removeNotificationsToBackend(token) {
        console.log("remove:" + token);
        await axios.post(BASE_URL + 'api/removeNotificationToken/', {
            token: token,
        }).then(response => console.log(response)).catch(error => console.log(error));
    }

    const signOutUser = async () => {
        await axios.post(BASE_URL + 'logout/', token, {
            headers: {
                'Authorization': `Token ` + token
            }
        }).then(async (response) => {
            await removeNotificationsToBackend(token);
            SecureStore.deleteItemAsync("myToken");
            navigation.navigate("login");
        }).catch(err => alert("Logout Failed"))

    }


    const openUserList = (token1, userid) => {
        navigation.navigate("userList", {
            token1: token,
            userID: userid,
        })
        //console.log(token)
    }

    const addChat = (token1, userid) => {
        navigation.navigate("addChat", {
            token1: token,
            userID: userid,
        })
        //console.log(token)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chats",
            headerStyle: {backgroundColor: "#3B5F41"},
            headerTitleStyle: {color: "white"},
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Avatar
                            rounded
                            source={require("../assets/young-user-icon.jpg")} size={40}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20,
                }}
                >
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name={"camerao"} size={24} color={"white"}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        // onPress={()=>navigation.navigate("addChat")}
                        onPress={() => {
                            addChat(token, userid)
                        }}
                    >
                        <SimpleLineIcons name={"pencil"} size={24} color={"white"}/>
                    </TouchableOpacity>
                </View>
            )

        });
    }, [last_name, chats]);


    const enterChat = (chatID, chatName, token, userid, phoneNumber) => {
        navigation.navigate("chat", {
            chatID: chatID,
            chatName: chatName,
            token: token,
            userID: userid,
            phoneNumber: phoneNumber,
        })
    }

    return (


        <SafeAreaView>

            <ScrollView style={styles.container}>
                {loading ?
                    [<View style={styles.topBar}>
                        <Text style={{
                            marginLeft: 15, color: '#696969', fontSize: 16,
                        }}>Welcome back {first_name}</Text>
                    </View>,
                        chats.map((chat) => (
                            <CustomListItem
                                key={chat.id}
                                chatID={chat.id}
                                chatName={chat.name}
                                token={token}
                                userid={userid}
                                enterChat={enterChat}
                            />
                        ))]
                    :
                    <Text>Loading</Text>
                }
            </ScrollView>
            <View style={styles.bottomBar}>
                <View
                    style={styles.BottomMenu1}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.button}
                        onPress={() => {
                            HomeScreen
                        }}
                    >
                        <SimpleLineIcons name={"bubble"} size={30} color={"#66A96B"} marginTop={10}/>
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.BottomMenu1}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.button}
                        // onPress={() => {
                        //     openUserList(token, userid)
                        // }}
                        onPress={() => {
                            navigation.navigate("searchuser", {
                                token1: token,
                                userID: userid,
                            })
                        }}
                    >
                        <SimpleLineIcons name={"people"} size={30} color={"#66A96B"} marginTop={10}/>
                    </TouchableOpacity>
                </View>

            </View>


        </SafeAreaView>


    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {

        height: '100%',
    },
    topBar: {
        backgroundColor: '#D3D3D3',
        borderWidth: 1,
        borderColor: '#696969',
        width: '100%',
        height: '10%',
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
    },

    bottomBar: {
        // backgroundColor: 'yellow',
        width: '100%',
        height: '25%',
        flexDirection: "row",
        flexWrap: "wrap",

    },
    button: {
        alignItems: "center",
        justifyContent: 'space-around',
        padding: 10
    },

    BottomMenu1: {
        backgroundColor: '#DDDDDD',
        width: '50%',
        height: '100%',
        alignItems: 'center',
    },
})