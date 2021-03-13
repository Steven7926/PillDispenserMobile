import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrash, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import ImageRotating from './ImageRotating';
import styles from './styles/styles'

var BASE_URL = 'https://magicmeds.herokuapp.com/';


class CaregiverView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        modalDel: false
    };

    setDelModalVisible = (visible) => {
        this.setState({ modalDel: visible });
    }

    async deleteCare(caregiverId) {
        var careInfo = '{"careId":"'
            + caregiverId
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/deletecare',
                { method: 'POST', body: careInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            this.setDelModalVisible(false)
            if (res.status == 0) {
                Alert.alert('Caregiver not Deleted', 'Caregiver was not deleted.');
            }
            else {
                Alert.alert('Caregiver Deleted', 'Caregiver was successfully deleted.');
                console.log(caregiverId);
            }

        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }
    }

    render() {
        const { modalDel } = this.state;
        return (
            <View style={styles.caregiverContainer}>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}> Name: {this.props.carename}</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{width: 290}}>
                        <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}> Phone #: {this.props.phonenum}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.deletebut}
                        activeOpacity={.5}
                        onPress={() => this.setDelModalVisible(true)}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faTrash} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}></Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.hrbelowbut} ></View>


                <Modal visible={modalDel} animationType='slide'>
                    <View style={styles.signupcontainer}>
                        <View style={{ marginTop: 15, width: 350 }}>
                            <ImageRotating />
                            <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Are you sure want to delete this caregiver?</Text>
                            <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>They will no longer recieve SMS messages when your medication drops.</Text>
                            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Name: {this.props.carename}</Text>
                            <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Phone #: {this.props.phonenum}</Text>
                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                                onPress={() => this.deleteCare(this.props.careid)}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Yes</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closebutton}
                                activeOpacity={.5}
                                onPress={() => this.setDelModalVisible(false)}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> No</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
} export default CaregiverView