import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageRotating from './ImageRotating';
import styles from './styles/styles';

function Loading() {
    return (
        <View style={styles.container}>
            <ImageRotating />          
        </View>
    );
} export default Loading;
