import React, {useEffect, useState} from 'react';

import {Text, View} from 'react-native';
import {Avatar, ListItem} from "react-native-elements";
import axios from "axios";
import {BASE_URL} from "../constants";

const CustomListItem = ({chatID, chatName, token, userid, enterChat}) => {

    const [chatMessages, setChatMessages] = useState("");
    const [loading, setLoading] = useState("");
    const [hasNoMessage, setHasNoMessage] = useState(false);
    const [unReadNumber, setUnReadNumber] = useState(0);
    const [roomName, setRoomName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const getMessages = async (token1) => {
        await axios.get(BASE_URL + 'api/messagebyroom/?room=' + chatID, {
            headers: {
                'Authorization': `Token ` + token1
            }
        }).then(function (response) {
            // handle success
            if (response.data.length == 0) {
                setChatMessages([]);
                setHasNoMessage(true);
            } else {
                setChatMessages(response.data);
            }
        }).catch(function (error) {
            // handle error
            console.log("no token");
            console.log(error);
            // navigation.navigate("login");
        });
    }

    const getUnreadMessages = async (token1) =>{
        await axios.get(BASE_URL + 'api/messagereader/?read=false&reader='+userid+'&room='+chatID, {
            headers: {
                'Authorization': `Token ` + token1
            }
        }).then(function (response) {
            // handle success
            setUnReadNumber(response.data.length);
        }).catch(function (error) {
            // handle error
            console.log("no token");
            console.log(error);
            // navigation.navigate("login");
        });
    }

    const getChatname = async (userid, chatID) => {

        //console.log("userid" + userid)
        //console.log("chatID" + chatID)
        await axios.post(BASE_URL + 'api/getChatname/', {
            "userID": userid,
            "chatID": chatID
        }).then(function (r) {
            setRoomName(r.data.chatname);
            setPhoneNumber(r.data.phonenumber)
        })
            .catch(err => console.log("cannot find name"))
    }

    useEffect(() => {
        (async () => {
            try {
                // const token1 = await getMyToken();
                const ms = getMessages(token);
                const num = getUnreadMessages(token);
                const na = getChatname(userid, chatID);
                // console.log("messages: " + chatMessages);
                if (chatMessages === "" || roomName ==="") {
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (err) {
                console.log(err);
            }
        })()
    }, [chatMessages, roomName]);

    return (
        <ListItem onPress={() => enterChat(chatID, roomName, token, userid, phoneNumber)} key={chatID} bottomDivider>
            <Avatar
                rounded
                source={require("../assets/young-user-icon.jpg")}

            />
            {unReadNumber?
                <View style={{backgroundColor:'red',width:20,height:20,borderRadius:10,borderWidth:1,borderColor:'white', justifyContent:'center', alignItems:'center',position: 'absolute',marginLeft:38,}}>
                <Text style={{color:'white',fontSize:16,justifyContent:'center',alignItems:'center'}}>{unReadNumber}</Text>
            </View>
                :<Text></Text>}

            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "800"}}>
                    {roomName}
                </ListItem.Title>
                {loading ?
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode={"tail"}>

                        {hasNoMessage ?
                            "no message"
                                :
                            chatMessages[chatMessages.length-1].sender.first_name + ":" +
                        chatMessages[chatMessages.length-1].content
                            }

                    </ListItem.Subtitle>
                    : <Text>loading</Text>}

            </ListItem.Content>
        </ListItem>
    );
};

export default CustomListItem;
