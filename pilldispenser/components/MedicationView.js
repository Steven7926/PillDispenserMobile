import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, } from 'react-native';
import styles from './styles/styles' 

var BASE_URL = 'https://magicmeds.herokuapp.com/';


class MedicationView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={{ marginBottom: 10, fontSize: 15 }}>{this.props.medname} taken every {this.props.daytaken} at {this.props.timetaken}</Text>
            </View>
        );
    } 
} export default MedicationView;