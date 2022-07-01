import React, {useEffect, useLayoutEffect, useState} from 'react';

import {SafeAreaView, ScrollView, Text, View, TextInput, Keyboard,TouchableOpacity, StyleSheet} from 'react-native';
import {Header, ListItem} from 'react-native-elements'

import CustomListItem from "../components/CustomListItem";
import {Avatar} from "react-native-elements";
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// const BASE_URL = 'https://wai-chat-api.herokuapp.com/';
import {BASE_URL} from "../constants";

const UserListScreen = ({navigation, route}) => {
    const {token1, userID} = route.params;
    //console.log(token1)
    //console.log(userID)
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");
    // const [userid, setUserID] = useState("");
    // const [first_name, setFirst_name] = useState("");
    // const [last_name, setLast_name] = useState("");
    const [loading, setLoading] = useState(false);



    const getUsers = async () => {
        await axios.get(BASE_URL + 'api/showAllUsers/', {}).then(function (response) {
            // handle success
            //console.log(response.data.user);
            //console.log(token1)
            setUsers(response.data.user);
            // console.log(response.data.user)
            //console.log(response.data.user[1]);
        }).catch(function (error) {
            // handle error
            //console.log("get rooms no token");
            console.log(error);
            // SecureStore.deleteItemAsync("myToken");
            // navigation.navigate("login");
        });
    }

    useEffect(() => {
        // Add inner async function
        (async () => {
            // console.log("token:"+token);
            try {
                // const token1 = await getMyToken();
                const list = await getUsers(token1);
                // console.log("lastname: "+last_name);
                if (users.length === 0) {
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (err) {
                console.log(err);
            }
        })()
    }, [users])



    const openUserList = (token, userid) => {
        navigation.navigate("userList", {
            token: token1,
            userID: userid,
        })
    }

    const openHome = (token) => {
        navigation.navigate("home", {
            token: token1,
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "User",
            headerStyle: {backgroundColor: "#3B5F41"},
            headerTitleStyle: {color: "white"},
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity activeOpacity={0.5}>
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
                    {/* <TouchableOpacity
                        activeOpacity={0.5}
                        // onPress={()=>navigation.navigate("addChat")}
                        onPress={() => getMyToken()}
                    >
                        <SimpleLineIcons name={"pencil"} size={24} color={"white"}/>
                    </TouchableOpacity> */}
                </View>
            ),

        });
    }, [users]);

    const match = (userID, matchID) => {
        if (userID == matchID) {
            alert("You cannot create a chat room with yourself");
        } else {
            axios.post(BASE_URL + 'api/createChatRoom/',
                {
                    type: 'onetoone',
                    creater: userID,
                    chatters: [userID, matchID]
                }).then(async (response) => {
                navigation.navigate("chat", {
                    chatID: response.data.chatRoomID,
                    chatName: response.data.chatRoomName,//chat room name
                    token: token1,
                    userID: userID,
                })

            })
        }
    }

    const searchUser = (textToSearch) => {
        alert(textToSearch)
        setInput(textToSearch)
    };


    return (


        <SafeAreaView>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search User"
                    onChangeText={text => searchUser(text)}
                    value={input}
                    //onSubmitEditing={sendMessage}
                />
            </View>
            <ScrollView style={styles.container}>
                {loading ?
                    [
                        users.map((user) => (
                            // console.log(userID,user.id)
                            userID != user.id ?
                                <ListItem
                                    Component={TouchableOpacity}
                                    key={user.id}
                                    title={user.first_name + ' ' + user.last_name}
                                    //leftIcon={{ name: item.icon }}
                                    onPress={() => {
                                        match(userID, user.id)
                                    }}

                                    bottomDivider
                                    chevron
                                >
                                    <Avatar
                                        rounded
                                        source={require("../assets/young-user-icon.jpg")}

                                    />
                                    <ListItem.Content>
                                        <ListItem.Title style={{fontWeight: "800"}}>
                                            {user.first_name + ' ' + user.last_name}
                                        </ListItem.Title>
                                    </ListItem.Content>
                                </ListItem> : null


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
                            openHome(token1)
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
                        onPress={() => {
                            openUserList(token1, userID)
                        }}
                    >
                        <SimpleLineIcons name={"people"} size={30} color={"#66A96B"} marginTop={10}/>
                    </TouchableOpacity>
                </View>

            </View>


        </SafeAreaView>


    );
};

export default UserListScreen;

const styles = StyleSheet.create({
    container: {

        height: '100%',
    },

    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 5,
    },

    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        // borderWidth:1,
        padding: 10,
        color: "gray",
        borderRadius: 30,
    },

    bottomBar: {
        backgroundColor: 'yellow',
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