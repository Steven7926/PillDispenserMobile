import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, Button, Picker } from 'react-native';
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

var firstname;
var lastname;
var userid;
var login;

AsyncStorage.getItem('user_data', (err, result) => {
    console.log(result);
    var userdata = JSON.parse(result);
    console.log(userdata);
    if (userdata != null)
    {
        firstname = userdata.firstName;
        lastname = userdata.lastName;
    }
});


function Medications() {

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
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
    const [selectedValue, setSelectedValue] = useState("Monday");

    // Hooks for assigning variable
    const [medName, onChangeMedName] = React.useState('');
    const [dayTaken, onChangeDay] = React.useState('');
    const [timeTaken, onChangeTime] = React.useState('');


    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);

    // History for sign out process
    const history = useHistory();
    const doLogout = event => {
        event.preventDefault();
        history.push('/');
        removeItemValue;
        console.log(AsyncStorage.getItem('user_data'));
    };

    // Remove item from AsyncStorage
    const removeItemValue = async event => {
        try {
            await AsyncStorage.removeItem('user_data');
            return true;
        }
        catch (exception) {
            return false;
        }
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
                <View style={styles.caregiver}>

                </View>               
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
                                            selectedValue={selectedValue}
                                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                                            style={{ color: 'white', textAlign: 'center', alignItems: 'center' }}
                                        >
                                            <Picker.Item label="Day Taken..." value="invalid" />
                                            <Picker.Item label="Sunday" value="Sunday" />
                                            <Picker.Item label="Monday" value="monday" />
                                            <Picker.Item label="Tueday" value="tuesday" />
                                            <Picker.Item label="Wednesday" value="wednesday" />
                                            <Picker.Item label="Thursday" value="thursday" />
                                            <Picker.Item label="Friday" value="friday" />
                                            <Picker.Item label="Saturday" value="saturday" />
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
                                                <Text style={{ textAlign: 'center', color: 'white' }}> Select Time </Text>
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
                                    onPress={doLogout}
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

    // Hooks for assigning variable
    const [firstnIn, onChangeLName] = React.useState('');
    const [lastnIn, onChangeFName] = React.useState('');
    const [phoneNum, onChangePhoneNum] = React.useState('');


    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);


    const history = useHistory();
    const doLogout = event => {
        event.preventDefault();
        history.push('/');
        removeItemValue;
        console.log(AsyncStorage.getItem('user_data'));
    };

    const removeItemValue = async event => {
        try {
            await AsyncStorage.removeItem('user_data');
            return true;
        }
        catch (exception) {
            return false;
        }
    }

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
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Add Care Giver </Text>
                        </View>
                    </TouchableOpacity>        
                </View>
                <View style={styles.caregiver}>

                </View>
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
                                    onPress={doLogout}
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



function MainUI() {
     
    const navTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#8c2f39',
        },
    }
    const Tab = createMaterialBottomTabNavigator();

    return (      
        <NavigationContainer theme={navTheme}>
            <Tab.Navigator
                initialRouteName="Medications"
                activeColor="#f2f2f2"
                labelStyle={{ fontSize: 12 }}
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
                    name="User"
                    component={User}
                    options={{
                        tabBarLabel: 'User',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                    }}
                />
                  
            </Tab.Navigator>
        </NavigationContainer>
     );

} export default MainUI