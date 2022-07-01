import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
//import { GiftedChat } from 'react-native-gifted-chat'
import { BASE_URL } from "../constants";
import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Button,
  Platform, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback, Linking,
  Image
} from 'react-native';
import { Avatar, ListItem } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

// import {AudioRecorder, AudioUtils} from 'react-native-audio';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";



const ChatDetailScreen = ({ navigation, route }) => {
  // const BASE_URL = 'https://wai-chat-api.herokuapp.com/';
  const [room, setRoom] = useState({
    chatters: []
  })
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true);
  const { chatID, chatName, token, userID, phoneNumber } = route.params;
  //const { state, navigate } = ChatDetailScreen.props.route;
  useEffect(() => {

    (async () => {
      loadData();
    })()
  }, [room])

  const loadData = async ()=>{
    console.log("token", token);
      await axios.get(BASE_URL + 'api/chatroom/' + chatID, {
        headers: {
          'Authorization': `Token ` + token
        }
      }).then(async function (response) {
        let rm = response.data;
       

        await axios.get(BASE_URL + 'api/showAllUsers/', {
          headers: {
            'Authorization': `Token ` + token
          }
        }).then(function (response) {
          setRoom(rm)
          setLoading(false);
          let us = response.data.user.filter((item)=>{
            return rm.chatters.includes(item.id);
          })
          console.log("response.data2222", response.data,us,rm.chatters);

          setUsers(us)
          // handle success
        }).catch(function (error) {
          // handle error
          console.log("no token");
          console.log(error);
          // navigation.navigate("login");
        });

        // handle success
      }).catch(function (error) {
        // handle error
        console.log("no token");
        console.log(error);
        // navigation.navigate("login");
      });
  }

  


  const addUser = () => {
    navigation.navigate("selectUser", {
      chatID: chatID,
      chatName: chatName,
      token: token,
      userID: userID,
      phoneNumber: phoneNumber,
    })

    navigation.callBack=()=>{
      loadData();
    }
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Detail",
      headerStyle: { backgroundColor: "#3B5F41" },
      headerTitleStyle: { color: "white" },
      headerTintColor: "black",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Avatar
            rounded
            source={require("../assets/young-user-icon.jpg")}
          />
          <Text style={{
            color: "white",
            marginLeft: 10,
            fontWeight: "700"
          }}>
            {chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={{
          marginLeft: 10,
        }} onPress={navigation.goBack}>
          <AntDesign name={"arrowleft"} size={24} color={'white'} />
        </TouchableOpacity>
      )
    })
  }, [])



  const deleteUser = (i) => {
    room.chatters.sort(function(a, b){return a-b});
    console.log(room.chatters);
    room.chatters.splice(i, 1);
    console.log(room.chatters);
    // create message
    axios.patch(BASE_URL + 'api/chatroom/' + room.id + "/",
      {
        "chatters": room.chatters
      }, {
      headers: {
        'Authorization': `Token ` + token
      }
    },
    ).then(async response => {
      console.log(response.data);
      navigation.goBack();
    }).catch(err => alert("Send Failed"))
  };


  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "#F2F2F2"
    }}>
      <StatusBar style={"light"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {!loading ?
            <>
              <ScrollView
                contentContainerStyle={{ paddingTop: 15, backgroundColor: '#F2F2F2' }}>
                <View>
                  {users.map((user, i) => (
                    <View key={user.id} style={styles.reciever}>
                      <Avatar
                        source={require("../assets/young-user-icon.jpg")}
                        rounded
                        size={30}
                      />
                      <Text style={styles.nicknameText}>{user.first_name + ' '+user.last_name}</Text>
                      <TouchableOpacity onPress={() => {
                        deleteUser(i);
                      }} activeOpacity={0.5}>
                        <View style={styles.imageOutline}>
                          <Text style={styles.deleteText}>delete</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Button title="Add user" onPress={() => {
                  addUser()
                }} />

              </ScrollView>
            </>
            : <Text>loading</Text>}



        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
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
  imageOutline: {
    marginLeft: 10
  },
  micOutline: {

  },
  picture: {
    width: 150,
    height: 150
  },
  nicknameText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    flex: 1
  },
  deleteText: {
    color: "#6576ff",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  reciever: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  sender: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 45,
    marginRight: 20,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "grey",
  }
})