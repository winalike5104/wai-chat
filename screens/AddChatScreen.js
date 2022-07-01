import React, {useEffect, useLayoutEffect, useState} from 'react';

import {StyleSheet, Text, View} from 'react-native';
import {Button, Input} from "react-native-elements";
import MultiSelect from 'react-native-multiple-select';
import Icon from "react-native-vector-icons/FontAwesome";
//import {db} from "../firebase";
import axios from 'axios';

import {BASE_URL} from "../constants";

const AddChatScreen = ({navigation, route}) => {
    const {token1, userID} = route.params;
    const [input, setInput] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUsers = async () => {
        await axios.get(BASE_URL + 'api/showAllUserNames/', {}).then(function (response) {

            setUsers(response.data.user);
            //console.log(response.data.user)
        }).catch(function (error) {
            console.log(error);
        });
    }

    const getSelectedUsers  = (sUsers) => {
        // sUsersArray
        // sUsers.forEach((v, i) => console.log(v));

        //console.log(sUsers.)
        //sUsersArray = sUsers.Array();
        setSelectedUsers(sUsers);
        console.log(selectedUsers)
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

    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Add a new chat",
            headerStyle: {backgroundColor: "#3B5F41"},
            headerTitleStyle: {color: "white"},
            headerTintColor: "black",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerBackTile: "Chats",
        })
    },[navigation]);

    const createChat = async () => {

        if (selectedUsers.includes(userID)) {
            console.log(input);
            console.log(userID);
            console.log(selectedUsers);
            axios.post(BASE_URL + 'api/chatroom/',
            {
                name: input,
                chatroomtype: 'group',
                creator: userID,
                chatters: selectedUsers,
            }).then(async (response) => {
            navigation.navigate("chat", {
                chatID: response.data.id,
                chatName: input,//chat room name
                token: token1,
                userID: userID,
                })

            })

        } else {
            alert("You cannot create a chat room with yourself");


        }
    }

    return (
        <View style={styles.container}>
        <Input
            placeholder={"Enter a chat name"}
            value={input}
            onChangeText={(text => setInput(text))}
            leftIcon={
                <Icon name={"wechat"} type={"antdesign"} size={24} color={"black"} />
            }
            onSubmitEditing={createChat}
        />
        <MultiSelect
          hideTags
          items={users}
          uniqueKey="id"
          //ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={getSelectedUsers}
          selectedItems={selectedUsers}
          selectText="Select Users"
          searchInputPlaceholderText="Search Users..."
          altFontFamily="ProximaNova-Light"
          //tagRemoveIconColor="green"
          //tagBorderColor="green"
          //tagTextColor="green"
          selectedItemTextColor="green"
          selectedItemIconColor="green"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <View>
          
        </View>
            <Button
                disabled={!input}
             onPress={createChat} title={'Create new Chat'}
            />
            </View>
    );
};

export default AddChatScreen;

const styles=StyleSheet.create({
    container:{
        backgroundColor:"white",
        padding: 30,
        height:"100%"
    }
})