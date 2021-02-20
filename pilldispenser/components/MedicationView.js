import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, Modal, TouchableOpacity, } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrash, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import ImageRotating from './ImageRotating';
import styles from './styles/styles' 

var BASE_URL = 'https://magicmeds.herokuapp.com/';

var medicationsView = [];

class MedicationView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        modalDel: false
    };
   
    setDelModalVisible = (visible) => {
        this.setState({ modalDel: visible });
    }

    async deleteMedication(medicationId) {
        var medInfo = '{"medicationId":"'
            + medicationId
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/deletemed',
                { method: 'POST', body: medInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            this.setDelModalVisible(false)
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
        const { modalDel } = this.state;
        return (
            <View style={styles.medContainer}>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>Medication: {this.props.medname}</Text>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>Dosage: {this.props.dosage}</Text>
                <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>Taken: {this.props.daytaken != "Everyday" ? this.props.daytaken.concat("s") : "Everyday"}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold" }}>At: {this.props.timetaken}</Text>
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
                            <ImageRotating/>
                            <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Are you sure want to delete this medication?</Text>
                            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Medication: {this.props.medname}</Text>
                            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Dosage: {this.props.dosage}</Text>
                            <Text style={{ marginBottom: 5, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>Taken: {this.props.daytaken != "Everyday" ? this.props.daytaken.concat("s") : "Everyday"}</Text>
                            <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: '#ffffff' }}>At: {this.props.timetaken}</Text>

                            <TouchableOpacity
                                style={styles.loginbut}
                                activeOpacity={.5}
                                onPress={() => this.deleteMedication(this.props.medid)}
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
} export default MedicationView;