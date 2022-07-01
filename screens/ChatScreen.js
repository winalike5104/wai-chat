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
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// import {AudioRecorder, AudioUtils} from 'react-native-audio';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const firebaseConfig = {
  apiKey: "AIzaSyBKutAIM8JNqz5vRhOqNEcseptvDOk7Kpw",
  authDomain: "entarome-15d8a.firebaseapp.com",
  projectId: "entarome-15d8a",
  storageBucket: "entarome-15d8a.appspot.com",
  messagingSenderId: "779364504573",
  appId: "1:779364504573:web:4c76e66828cfbcc8b2ff94",
  measurementId: "G-E8LDCESXK3"
};

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

let scrollView;
const ChatScreen = ({ navigation, route }) => {
  // const BASE_URL = 'https://wai-chat-api.herokuapp.com/';

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState("");
  const [messages, setMessages] = useState("");
  const { chatID, chatName, token, userID, phoneNumber } = route.params;
  const [hasPhoneNumber, sethasPhoneNumber] = useState(false);
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);

  const [sound, setSound] = React.useState();

  const getMessages = async (token1) => {
    await axios.get(BASE_URL + 'api/messagebyroom/?room=' + chatID, {
      headers: {
        'Authorization': `Token ` + token1
      }
    }).then(function (response) {
      // handle success
      setMessages(response.data);
    }).catch(function (error) {
      // handle error
      console.log("no token");
      console.log(error);
      // navigation.navigate("login");
    });
  }

  const sentMessageToReader = async (messageID) => {
    axios.get(BASE_URL + 'api/chatroom/' + chatID, {
      headers: {
        'Authorization': `Token ` + token
      }
    }).then(async function (response) {
      // handle success
      const chatters = response.data.chatters;
      let i = 0;
      while (i < chatters.length) {
        let chatter = chatters[i];
        if (chatter != userID) {
          console.log(chatter);
          await setToUnread(chatter, messageID);
        }
        i = i + 1;
      }
    }).catch(function (error) {
      // handle error
      console.log("no token");
    });
  }

  const sentNotification = async (chatterID, messageID) => {
    axios.post(BASE_URL + 'api/sendNotification/',
      {
        "userID": chatterID,
        "messageID": messageID
      }).then(async (response) => {
        // console.log(response.data.token);
        console.log("set success");
      }).catch(err => console.log("sent failed"))
  }

  const setToUnread = async (chatterID, messageID) => {
    await sentNotification(chatterID, messageID);
    axios.post(BASE_URL + 'api/messagereader/',
      {
        "read": false,
        "message": messageID,
        "reader": chatterID,
        "room": chatID
      }).then(async (response) => {
        // console.log(response.data.token);
        console.log("set success");
      }).catch(err => alert("set failed"))
  }

  const setToRead = async (unReadMessageID, token1) => {
    let url = BASE_URL + "api/messagereader/" + unReadMessageID + "/";
    console.log(url);
    axios.patch(url, {
      "read": true
    }, {
      headers: {
        'Authorization': `Token ` + token1
      }
    }
    ).then(r => console.log(r.data)).catch(error => console.log(error))
  }

  const clearUnread = async (chatID, userid, token1) => {
    await axios.get(BASE_URL + 'api/messagereader/?read=false&reader=' + userid + '&room=' + chatID, {
      headers: {
        'Authorization': `Token ` + token1
      }
    }).then(function (response) {
      // handle success
      let unReadMessages = response.data;
      let i = 0;
      while (i < unReadMessages.length) {
        let unReadMessageID = unReadMessages[i].id;
        setToRead(unReadMessageID, token1)
        i = i + 1;
      }
    }).catch(function (error) {
      // handle error
      console.log("no token");
      console.log(error);
      // navigation.navigate("login");
    });
  }

  useEffect(() => {
    if (phoneNumber !== "") {
      sethasPhoneNumber(true);
    }
    (async () => {
      try {
        // const token1 = await getMyToken();
        const ms = getMessages(token)
        const ms1 = clearUnread(chatID, userID, token)
        if (messages === "") {
          setLoading(false);
        } else {
          setLoading(true);
          console.log(chatID);
        }
      } catch (err) {
        console.log(err);
      }
    })()
  }, [messages, chatID])

  const phonecall = () => {
    Linking.openURL('tel:' + phoneNumber);
  }

  const chatDetail = () => {
    navigation.navigate("chatDetail", {
      chatID: chatID,
      chatName: chatName,
      token: token,
      userID: userID,
      phoneNumber: phoneNumber,
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
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
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20
          }}
        >
          <TouchableOpacity>
            <FontAwesome name={"video-camera"} size={24} color={"white"} />
          </TouchableOpacity>
          {hasPhoneNumber ?
            <TouchableOpacity onPress={phonecall}>
              <Ionicons name={"call"} size={24} color={"white"} />
            </TouchableOpacity>
            : null
          }
          <TouchableOpacity onPress={chatDetail}>
            <Ionicons name={"ellipsis-horizontal-outline"} size={24} color={"white"} />
          </TouchableOpacity>
        </View>
      )
    })
  }, [messages]);


  const sendMessage = () => {
    Keyboard.dismiss();
    if (input === "") {
      alert("Please enter a message");
    } else {
      // create message
      axios.post(BASE_URL + 'api/createmessage/',
        {
          "content": input,
          "type": "text",
          "sender": userID,
          "room": chatID
        }, {
        headers: {
          'Authorization': `Token ` + token
        }
      },
      ).then(async response => {
        console.log(response.data);
        await sentMessageToReader(response.data.id).then(r => console.log(r));
      }).catch(err => alert("Send Failed"))
      // find other users
    }
    setInput('')
  };

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    return blob;
  };


  const clickRecord = async () => {
    let isr = !isRecording;
    setIsRecording(isr);
    if (isr) {
      startRecording();
    } else {
      stopRecording();
    }
  }

  async function playSound(url) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: url});
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    let fileBlob = await getBlobFroUri(uri);
    const filName = "audio-" + new Date().getTime();

    const storageRef = ref(storage, `${filName}`);

    const metadata = {
      // contentType: "image/jpeg,image/png",
    };

    uploadBytes(storageRef, fileBlob, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {

        let params = {
          "content": downloadURL,
          "type": "voice",
          "sender": userID,
          "room": chatID
        };
        console.log('params', params);
        axios.post(BASE_URL + 'api/createmessage/',
          params, {
          headers: {
            'Authorization': `Token ` + token
          }
        },
        ).then(async response => {
          console.log("send Success", response.data);
          await sentMessageToReader(response.data.id).then(r => console.log(r));
        }).catch(err => {
          console.log("send Success", err);
          alert("Send Failed")
        })


      });

    });

  }



  const chooseImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaType: "photo", // 'photo' or 'video' or 'mixed'
      selectionLimit: 1,// 1为一张，0不限制数量
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      includeBase64: true
    });

    const imgName = "img-" + new Date().getTime();

    const storageRef = ref(storage, `${imgName}.jpg`);

    console.log("uploading file", imgName);

    // Create file metadata including the content type
    const metadata = {
      contentType: "image/jpeg,image/png",
    };

    console.log("fileBlob...", result.uri);
    let fileBlob = await getBlobFroUri(result.uri);
    

    uploadBytes(storageRef, fileBlob, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {

        let params = {
          "content": downloadURL,
          "type": "picture",
          "sender": userID,
          "room": chatID
        };
        console.log('params', params);
        axios.post(BASE_URL + 'api/createmessage/',
          params, {
          headers: {
            'Authorization': `Token ` + token
          }
        },
        ).then(async response => {
          console.log("send Success", response.data);
          await sentMessageToReader(response.data.id).then(r => console.log(r));
        }).catch(err => {
          console.log("send Success", err);
          alert("Send Failed")
        })


      });

    });

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
          {loading ?
            <>
              <ScrollView
                contentContainerStyle={{ paddingTop: 15, backgroundColor: '#F2F2F2' }}
                //自动到最下
                ref={ref => {
                  scrollView = ref
                }}
                onContentSizeChange={() => scrollView.scrollToEnd({ animated: true })}>

                {messages.map((message) => (
                  message.sender.id === userID ? (
                    //收
                    <View key={message.id} style={styles.reciever}>
                      <Avatar
                        source={require("../assets/young-user-icon.jpg")}
                        rounded
                        //Web
                        containerStyle={{
                          position: "absolute",
                          bottom: 30,
                          right: -40,
                        }}
                        size={30}
                      />
                      {message.type === "text" ? (<Text style={styles.recieverText}>{message.content}</Text>) : (message.type === "picture" && message.content ? <Image style={styles.picture} source={{ uri: message.content }}></Image> : (message.type === "voice" ?  <Button title="Play Sound" onPress={()=>{
                        playSound(message.content)
                      }} /> : ""))}

                    </View>
                  ) : (
                    //发
                    <View key={message.id} style={styles.sender}>
                      <Avatar
                        source={require("../assets/young-user-icon.jpg")}
                        rounded
                        //Web
                        containerStyle={{
                          position: "absolute",
                          bottom: 30,
                          left: -40,
                        }}
                        size={30}
                      />
                      <Text style={styles.senderName}>{message.sender.username}</Text>

                      {message.type === "text" ? (<Text style={styles.senderText}>{message.content}</Text>) : (message.type === "picture" && message.content ? <Image style={styles.picture} source={{ uri: message.content }}></Image> : (message.type === "voice" ?  <Button title="Play Sound" onPress={()=>{
                        playSound(message.content)
                      }} /> : ""))}
                    </View>
                  )
                ))}
              </ScrollView>
              <View style={styles.footer}>
                <TouchableOpacity onPress={clickRecord} activeOpacity={0.5}>
                  <View style={styles.micOutline}>
                    <Ionicons name={!recording ? "mic-outline" : "mic-off-outline"} size={24} color={"#66A96B"} />
                  </View>
                </TouchableOpacity>
                <TextInput
                  placeholder={"Message"}
                  style={styles.textInput}
                  value={input}
                  onChangeText={(text) => setInput(text)}
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                  <Ionicons name={"send"} size={24} color={"#66A96B"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={chooseImage} activeOpacity={0.5}>
                  <View style={styles.imageOutline}>
                    <Ionicons name={"image-outline"} size={24} color={"#66A96B"} />
                  </View>
                </TouchableOpacity>
              </View>
            </>
            : <Text>loading</Text>}

        </TouchableWithoutFeedback>


      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

export default ChatScreen;

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
  recieverText: {
    color: "white",
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
    backgroundColor: "#66A96B",
    alignSelf: "flex-end",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 45,
    marginLeft: 20,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
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