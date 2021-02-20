import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrash, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/styles'

var BASE_URL = 'https://magicmeds.herokuapp.com/';


class CaregiverView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        modalVisible: false,
        modalDel: false
    };

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    setDelModalVisible = (visible) => {
        this.setState({ modalDel: visible });
    }

    render() {
        const { modalVisible } = this.state;
        const { modalDel } = this.state;
        return (
            <View style={styles.caregiverContainer}>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}> Name: {this.props.carename}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}> Phone #: {this.props.phonenum}</Text>
                    <TouchableOpacity
                        style={styles.deletebut}
                        activeOpacity={.5}
                        //onpress: delete
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
                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                            //onPress={addMedication}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Yes</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closebutton}
                                activeOpacity={.5}
                                onPress={() => this.setDelModalVisible(!modalVisible)}
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