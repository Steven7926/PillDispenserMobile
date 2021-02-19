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

var BASE_URL = 'https://magicmeds.herokuapp.com/';

var firstname;
var userid;


var medicationsView = [];
var careView = [];


function Medications() { 

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

    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        getMedication();
    });

    // History for sign out process
    const history = useHistory();
    const doLogout = event => {
        event.preventDefault();
        history.push('/');
        AsyncStorage.removeItem('user_data');
        console.log(AsyncStorage.getItem('user_data'));
    };

    const addMedication = async event => {
        event.preventDefault();


        if (medName === "" || dayTaken === "" || date === "" || dayTaken == "invalid") {
            Alert.alert('Invalid Inputs', 'Please fill in all of the blanks.');
            return;
        }
        var timeTaken = date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }).replace(/(:\d{2}| [AP]M)$/, ""); 
        var timeintwelvehr = timeTaken
        var userInfo = '{"medicationName":"'
            + medName
            + '","dayTaken":"'
            + dayTaken
            + '","timeTaken":"'
            + timeTaken
            + '", "userId": "'
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

            else
            {
                // Case for when the med does not exist in DB
                Alert.alert("Success!", "Medication Added! " +  medName  + " will now be dispensed at " +  timeTaken  + " on " + dayTaken + "(s)");
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
        var medid = 0;
        var userInfo = '{"userId":"'
            + userid
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/getmed',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status == 1) {
                for (var i = 0; i < (res.meds.length); i++) {
                    var newtime = calculateTime(res.meds[i].TimeTaken);     
                    medicationsView[i] = <MedicationView key={medid.toString()} medname={res.meds[i].MedicationName} daytaken={res.meds[i].DayTaken} timetaken={newtime} userid={res.meds[i].UserId} />
                    medid++;
                }
                setPills(medicationsView)
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

    



    // Return this View
    return (
        <View style={styles.userpage}>
            <View>
                <View style={styles.welcome}>
                    <View style={styles.welcomeuser}>
                        <Text style={styles.welcometext}>Welcome {firstname} </Text>
                    </View>
                    <ImageRotatingSmall />
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        <TouchableOpacity
                            style={styles.signoutbut}
                            activeOpacity={.5}
                            onPress={doLogout}
                        >
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <FontAwesomeIcon icon={faSignOutAlt} size={20} style={{ color: '#ffffff' }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Out </Text>
                            </View>
                        </TouchableOpacity>
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
                                    <FontAwesomeIcon icon={faCalendar} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                    <View style={{ width: 260, borderWidth: 3, borderColor: 'gray', borderRadius: 10 }}>
                                        <Picker
                                            selectedValue={dayTaken}
                                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                                            style={{ color: 'white'}}
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

function User() {

    const [caresAdded, setCaregivers] = React.useState([]);

    // Hooks for assigning variable
    const [firstnIn, onChangeLName] = React.useState('');
    const [lastnIn, onChangeFName] = React.useState('');
    const [phoneNum, onChangePhoneNum] = React.useState('');


    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        getCaregivers();
    });

    const history = useHistory();
    const doLogout = event => {
        event.preventDefault();
        history.push('/');
        AsyncStorage.removeItem('user_data');
        console.log(AsyncStorage.getItem('user_data'));
    };

    const addCaregiver = async event => {
        event.preventDefault();


        if (firstnIn === "" || lastnIn === "" || phoneNum === "") {
            Alert.alert('Invalid Inputs', 'Please fill in all of the blanks.');
            return;
        }

        var userInfo = '{"firstName":"'
            + firstnIn
            + '","lastName":"'
            + lastnIn
            + '","phoneNumber":"'
            + phoneNum
            + '", "userId": "'
            + userid 
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/addcare',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status === "Caregiver already added!") {
                // Case for when the username is already taken
                Alert.alert('Caregiver already exits', 'It seems that caregiver already exists, please add a different one or ensure the phone number is correct.');
            }
            else if (res.status === "Caregiver is not available to add!") {
                Alert.alert('Caregiver does not exist', 'It seems that caregiver has not signed up to be part of the caregiver pool.');
            }
            else {
                var name = res.caregivername;
                // Case for when the username does not exist
                Alert.alert("Success!", "Caregiver Added! " + name + " will now receive a text notification when your pills are dispensed.");
                setModalOpen(false);
                getCaregivers();
            }
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }
    };

    const getCaregivers = async event => {
        var careid = 0;
        var userInfo = '{"userId":"'
            + userid
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/getcare',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status == 1) {
                for (var i = 0; i < (res.caregivers.length); i++) {
                    careView[i] = <CaregiverView key={careid.toString()} carename={res.caregivers[i].FirstName + " " + res.caregivers[i].LastName} phonenum={res.caregivers[i].PhoneNumber} userid={res.caregivers[i].UserId} />
                    careid++;
                }
                setCaregivers(careView)
            }
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }

    };


    return (
        <View style={styles.userpage}>
            <View>           
                <View style={styles.welcome}>
                    <View style={styles.welcomeuser}>
                        <Text style={styles.welcometext}>Welcome {firstname} </Text>
                    </View>
                    <ImageRotatingSmall />
                    <View style={{ marginTop: 20, marginLeft: 10}}>
                        <TouchableOpacity
                            style={styles.signoutbut}
                            activeOpacity={.5}
                            onPress={doLogout}
                        >
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <FontAwesomeIcon icon={faSignOutAlt} size={20} style={{ color: '#ffffff' }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Out </Text>
                            </View>
                        </TouchableOpacity>
                    </View>                   
                </View>
                <View style={styles.hr}></View>
                <View style={ styles.addcare }>
                    <TouchableOpacity
                        style={styles.loginbut}
                        activeOpacity={.5}
                        onPress={() => setModalOpen(true)}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faUser} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Add Caregiver </Text>
                        </View>
                    </TouchableOpacity>        
                </View>
                <ScrollView style={styles.caregiver}>
                    {caresAdded}
                </ScrollView>               
            </View>

            <View style={styles.container} >
                <Modal visible={modalOpen} animationType='slide' >
                    <View style={styles.signupcontainer}>
                        <ImageRotating />
                        <View style={{ flex: 1 }}>
                            <View style={{ width: 250, marginLeft: 25 }}>
                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesomeIcon icon={faUser} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                    <View style={{ width: 260 }}>
                                        <TextInput
                                            placeholder=" First Name..."
                                            onChangeText={text => onChangeFName(text)}
                                            underlineColorAndroid="transparent"
                                            style={styles.userInputs}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesomeIcon icon={faSignature} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                    <View style={{ width: 260 }}>
                                        <TextInput
                                            placeholder=" Last Name..."
                                            onChangeText={text => onChangeLName(text)}
                                            underlineColorAndroid="transparent"
                                            style={styles.userInputs}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                    <FontAwesomeIcon icon={faHashtag} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                    <View style={{ width: 260 }}>
                                        <TextInput
                                            placeholder=" Phone Number..."
                                            onChangeText={text => onChangePhoneNum(text)}
                                            underlineColorAndroid="transparent"
                                            style={styles.userInputs}
                                        />
                                    </View>
                                </View>                            
                            </View>
                            <View style={{ marginTop: 15, width: 350 }}>
                                <TouchableOpacity
                                    style={styles.loginbut}
                                    activeOpacity={.5}
                                    onPress={addCaregiver}
                                >
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Add Caregiver!</Text>
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

    AsyncStorage.getItem('user_data', (err, result) => {
        var userdata = JSON.parse(result);
        console.log(userdata);
        if (userdata != null) {
            firstname = userdata.firstName;
            userid = userdata.id
        }
    });


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