import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity } from 'react-native';
import { NativeRouter, Route, Switch, useHistory } from "react-router-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import ImageRotating from './ImageRotating';
import styles from './styles/styles';


    var firstName;
    var lastName;
    var userid;
    var login;

AsyncStorage.getItem('user_data').then((_ud) => {
    var ud = JSON.parse(_ud);
    firstName = ud.firstName;
    lastName = ud.lastName;
    userid = ud.id;
    login = ud.username;
});


function MainUI() {

    const history = useHistory();
    const doLogout = event => {
        event.preventDefault();
        history.push('/');
    };

    return (
        <View style={styles.container}>
            <Text> Welcome { firstName } </Text>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    style={styles.loginbut}
                    activeOpacity={.5}
                    onPress={doLogout}
                >
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <FontAwesomeIcon icon={faSignOutAlt} size={20} style={{ color: '#ffffff' }} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
     );

} export default MainUI