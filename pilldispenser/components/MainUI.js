import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity } from 'react-native';
import { NativeRouter, Route, Switch, useHistory } from "react-router-native";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import ImageRotating from './ImageRotating';
import styles from './styles/styles';

var firstname;
var lastname;
var userid;
var login;

AsyncStorage.getItem('user_data', (err, result) => {
    console.log(result);
    var userdata = JSON.parse(result);
    console.log(userdata);
    firstname = userdata.firstName;
    lastname = userdata.lastName;
});


function Medications() {
    const history = useHistory();
    const doLogout = event => {
        event.preventDefault();
        history.push('/');
        removeItemValue;
        console.log(AsyncStorage.getItem('user_data'));
    };

    const removeItemValue = async event => {
        try {
            await AsyncStorage.removeItem('user_data');
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    return (
        <View style={styles.container}>
            <ImageRotating />
            <Text>Welcome {firstname} </Text>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    style={styles.loginbut}
                    activeOpacity={.5}
                    onPress={doLogout}
                >
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <FontAwesomeIcon icon={faSignOutAlt} size={20} style={{ color: '#ffffff' }} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Out </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function User() {

    return (
        <View style={styles.container}>
        </View>

    );
}

function MainUI() {
     
    const navTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: 'rgb(199, 97, 86)',
        },
    }
    const Tab = createMaterialBottomTabNavigator();

    return (      
        <NavigationContainer theme={navTheme}>
            <Tab.Navigator
                initialRouteName="Medications"
                activeColor="#f2f2f2"
                labelStyle={{ fontSize: 12 }}
            >

                <Tab.Screen
                    name="Medications"
                    component={Medications}
                    options={{
                        tabBarLabel: 'Medications',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="pill" color={color} size={26} />
                        ),
                    }}
                />

                <Tab.Screen
                    name="User"
                    component={User}
                    options={{
                        tabBarLabel: 'User',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                    }}
                />
                  
            </Tab.Navigator>
        </NavigationContainer>
     );

} export default MainUI