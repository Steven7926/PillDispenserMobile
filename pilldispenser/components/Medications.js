import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, Picker, ScrollView, Alert } from 'react-native';
import { useHistory } from "react-router-native";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faUser, faHashtag, faSignature, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageRotating from './ImageRotating';
import ImageRotatingSmall from './ImageRotatingSmall';
import styles from './styles/styles';
import MedicationView from './MedicationView';
import Loading from './Loading';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


var BASE_URL = 'https://magicmeds.herokuapp.com/';
var medicationsView = [];


function Medications(props) {

    useEffect(() => {
        AsyncStorage.getItem('user_data').then((udata) => {
            setIsLoading(false);
            if (udata != null) {
                setUserData(JSON.parse(udata))
                //console.log(udata);
            }
            else
                setUserData(null);
        });

    });

    useEffect(() => {
        getMedication()

    }, []);


    const [isLoading, setIsLoading] = React.useState(true);
    const [usersData, setUserData] = React.useState('');
    const userid = usersData.id;
   
    const [pillsbeingtaken, setPills] = useState([]);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = () => {
        showMode('time');
    };

    // For picking a day of the week
    const [dayTaken, setSelectedValue] = useState("Day Taken...");
    const [medName, onChangeMedName] = useState('');
    const [dosage, onChangeDosage] = useState('');

    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);



    const addMedication = async event => {
        event.preventDefault();


        if (medName === "" || dayTaken === "" || date === "" || dayTaken == "invalid") {
            Alert.alert('Invalid Inputs', 'Please fill in all of the blanks.');
            return;
        }
        var timeTaken = date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }).replace(/(:\d{2}| [AP]M)$/, "");

        var userInfo = '{"medicationName":"'
            + medName
            + '","dayTaken":"'
            + dayTaken
            + '","timeTaken":"'
            + timeTaken
            + '", "dosage":"'
            + dosage
            +'", "userId": "'
            + userid
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/addmed',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status === "That medication has already been added for that time!")
                Alert.alert('Medication already added for that time.', 'It seems that medication is already taken at that time, please add a different one or ensure the day/time taken is correct.');

            else if (res.status == 'Ensure medications on the same day are set to drop at the same time!')
                Alert.alert('Medication time mismatch', 'Please ensure medications on the same day are set to drop at the same time!');

            else {
                // Case for when the med does not exist in DB
                Alert.alert("Success!", "Medication Added! " + medName + " will now be dispensed at " + timeTaken + " on " + dayTaken + "(s)");
                setModalOpen(false);
                getMedication();
            }
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }
    };

    const getMedication = async event => {    
        var userInfo = '{"userId":"'
            + userid
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/getmed',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status == 1) {
                for (var i = 0; i < (res.meds.length); i++) {
                    var unique = i;
                    var newtime = calculateTime(res.meds[i].TimeTaken);
                    medicationsView[i] = <MedicationView key={unique} medid={res.meds[i]._id.toString()} medname={res.meds[i].MedicationName} dosage={res.meds[i].Dosage} daytaken={res.meds[i].DayTaken} timetaken={newtime} userid={res.meds[i].UserId} />
                }

                setPills(medicationsView);
            }
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }

    };

    function calculateTime(thetime) {
        var sub = thetime.split(":");
        var hour = sub[0];
        var minutes = sub[1];
        var newtime = "";

        if (parseInt(hour) > 12 && parseInt(hour) < 24)
            newtime = (parseInt(hour) - 12).toString() + ':' + minutes + ' PM'

        else if (parseInt(hour) == 0)
            newtime = '12' + ':' + minutes + ' AM'

        else if (parseInt(hour) == 12)
            newtime = '12' + ':' + minutes + ' PM'

        return newtime;
    }
    if (isLoading) {
        return (
            <Loading />
        );
    }
    else {
        // Return this View
        return (
            <View style={styles.userpage}>
                <View>
                    <View style={styles.welcome}>
                        <View style={styles.welcomeuser}>
                            <Text style={styles.welcometext}>Welcome {usersData.firstName} </Text>
                        </View>
                        <ImageRotatingSmall />
                        <View style={{ marginTop: 20, marginLeft: 55 }}>

                        </View>
                    </View>
                    <View style={styles.hr}></View>

                    <View style={styles.addcare}>
                        <TouchableOpacity
                            style={styles.loginbut}
                            activeOpacity={.5}
                            onPress={() => setModalOpen(true)}
                        >
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <FontAwesomeIcon icon={faPills} size={20} style={{ color: '#ffffff' }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Add Medication </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.caregiver}>
                        {pillsbeingtaken}
                    </ScrollView>
                </View>

                <View style={styles.container} >
                    <Modal visible={modalOpen} animationType='slide' >
                        <View style={styles.signupcontainer}>
                            <ImageRotating />
                            <View style={{ flex: 1 }}>
                                <View style={{ width: 250, marginLeft: 25 }}>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <FontAwesomeIcon icon={faPills} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                        <View style={{ width: 260 }}>
                                            <TextInput
                                                placeholder=" Medication Name..."
                                                onChangeText={text => onChangeMedName(text)}
                                                underlineColorAndroid="transparent"
                                                style={styles.userInputs}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <FontAwesomeIcon icon={faPills} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                        <View style={{ width: 260 }}>
                                            <TextInput
                                                placeholder=" Dosage..."
                                                onChangeText={text => onChangeDosage(text)}
                                                underlineColorAndroid="transparent"
                                                style={styles.userInputs}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <FontAwesomeIcon icon={faCalendar} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                        <View style={{ width: 260, borderWidth: 3, borderColor: 'gray', borderRadius: 10 }}>
                                            <Picker
                                                selectedValue={dayTaken}
                                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                                                style={{ color: 'white' }}
                                            >
                                                <Picker.Item label="Everyday" value="Everyday" />
                                                <Picker.Item label="Sunday" value="Sunday" />
                                                <Picker.Item label="Monday" value="Monday" />
                                                <Picker.Item label="Tueday" value="Tuesday" />
                                                <Picker.Item label="Wednesday" value="Wednesday" />
                                                <Picker.Item label="Thursday" value="Thursday" />
                                                <Picker.Item label="Friday" value="Friday" />
                                                <Picker.Item label="Saturday" value="Saturday" />
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <FontAwesomeIcon icon={faClock} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                        <View>
                                            <TouchableOpacity
                                                style={styles.timebut}
                                                activeOpacity={.5}
                                                onPress={showTimepicker}
                                            >
                                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                    <Text style={{ textAlign: 'center', color: 'white' }}> {calculateTime(date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }).replace(/(:\d{2}| [AP]M)$/, ""))} </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {show && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={mode}
                                                is24Hour={false}
                                                display="default"
                                                onChange={onChange}
                                            />
                                        )}
                                    </View>
                                </View>
                                <View style={{ marginTop: 15, width: 350 }}>
                                    <TouchableOpacity
                                        style={styles.loginbut}
                                        activeOpacity={.5}
                                        onPress={addMedication}
                                    >
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Add Medication!</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.closebutton}
                                        activeOpacity={.5}
                                        onPress={() => setModalOpen(false)}
                                    >
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <FontAwesomeIcon icon={faWindowClose} size={20} style={{ color: '#ffffff' }} />
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Close</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
    
} export default Medications