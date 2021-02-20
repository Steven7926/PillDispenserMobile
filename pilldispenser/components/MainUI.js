import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, Picker, ScrollView, Alert } from 'react-native';
import { useHistory } from "react-router-native";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faUser, faHashtag, faSignature, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageRotating from './ImageRotating';
import ImageRotatingSmall from './ImageRotatingSmall';
import styles from './styles/styles';
import MedicationView from './MedicationView';
import CaregiverView from './CaregiverView';
import Medications from './Medications';
import User from './Caregivers';


var BASE_URL = 'https://magicmeds.herokuapp.com/';

function Tabs() {

    const Tab = createMaterialBottomTabNavigator();
    return (

        <Tab.Navigator
            initialRouteName="Medications"
            activeColor="#f2f2f2"
            labelStyle={{ fontSize: 12 }}
            lazy= "false"
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
                name="Caregivers"
                component={User}
                options={{
                    tabBarLabel: 'Caregivers',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>

    );
}


function MainUI() {

   

    const navTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#8c2f39',
        },
    }

    return (
        <NavigationContainer theme={navTheme}>
            <Tabs />
        </NavigationContainer>
    ); 
} export default MainUI