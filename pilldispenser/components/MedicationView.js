import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, Modal, TouchableOpacity, } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrash, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import ImageRotating from './ImageRotating';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles/styles' 

var BASE_URL = 'https://magicmeds.herokuapp.com/';


class MedicationView extends React.Component {

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

    async deleteMedication() {
        var medInfo = '{"medicationName":"'
            + this.props.medname
            + '","dayTaken":"'
            + this.props.daytaken
            + '","timeTaken":"'
            + props.timetaken
            + '", "userId": "'
            + this.props.userid
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/deletemed',
                { method: 'POST', body: medInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status == 0) {
                Alert.alert('Medication not Deleted', 'Medication was not deleted.');
            }
            else {
                Alert.alert('Medication Deleted', 'Medication was successfully deleted.');
            }
            
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }
    }

    render() {
        const { modalVisible } = this.state;
        const { modalDel } = this.state;
        return (
            <View style={styles.medContainer}>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>Medication: {this.props.medname}</Text>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>Dosage: {this.props.dosage}</Text>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>Taken: {this.props.daytaken != "Everyday" ? this.props.daytaken.concat("s") : "Everyday"}</Text>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>At: {this.props.timetaken}</Text>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        style={styles.editbut}
                        activeOpacity={.5}
                        onPress={ () => this.setModalVisible(true) }
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faEdit} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deletebut}
                        activeOpacity={.5}
                        onPress={() => this.setDelModalVisible(true)}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faTrash} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>Delete</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.hrbelowbut} ></View>


                <Modal visible={modalVisible} animationType='slide'>
                    <View style={styles.signupcontainer}>
                        <View style={{ marginTop: 15, width: 350 }}>
                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                            //onPress={addMedication}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Save Changes</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closebutton}
                                activeOpacity={.5}
                                onPress={() => this.setModalVisible(!modalVisible)}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Close</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={modalDel} animationType='slide'>
                    <View style={styles.signupcontainer}>
                        <View style={{ marginTop: 15, width: 350 }}>
                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                                onPress={() => this.deleteMedication}
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
} export default MedicationView;