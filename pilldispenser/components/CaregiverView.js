import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, } from 'react-native';
import styles from './styles/styles'

var BASE_URL = 'https://magicmeds.herokuapp.com/';


class CaregiverView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={{ marginBottom: 10, fontSize: 15 }}>{this.props.carename}:  {this.props.phonenum}</Text>
            </View>
        );
    }
} export default CaregiverView;