// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    FlatList,
    TextInput,
} from 'react-native';
import axios from "axios";
import {BASE_URL} from "../constants";

const App = ({navigation, route}) => {
    const {token1, userID} = route.params;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    const getUsers = async () => {
        await axios.get(BASE_URL + 'api/showAllUsers/', {}).then(function (response) {
            // handle success
            // console.log(response.data.user);
            //console.log(token1)
            setUsers(response.data.user);
            setFilteredDataSource(response.data.user);
            setMasterDataSource(response.data.user);
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
    }, [])

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

    // useEffect(() => {
    //     fetch('https://jsonplaceholder.typicode.com/posts')
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log(responseJson);
    //             setFilteredDataSource(responseJson);
    //             setMasterDataSource(responseJson);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                // Applying filter for the inserted text in search bar
                const itemData = item.first_name + " " + item.last_name
                    ? item.first_name.toUpperCase() + item.last_name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const ItemView = ({item}) => {
        return (
            // Flat List Item
            <Text style={styles.itemStyle} onPress={() => getItem(item)}>
                {item.first_name} {item.last_name}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };

    const getItem = (item) => {
        // Function for click on an item
        // alert('Id : ' + item.id + ' Title : ' + item.first_name);
        match(userID, item.id);
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInputStyle}
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                    underlineColorAndroid="transparent"
                    placeholder="Search Here"
                />
                <FlatList
                    data={filteredDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    itemStyle: {
        padding: 10,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: '#009688',
        backgroundColor: '#FFFFFF',
    },
});

export default App;
