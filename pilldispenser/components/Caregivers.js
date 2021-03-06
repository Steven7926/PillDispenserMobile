import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, Picker, ScrollView, Alert } from 'react-native';
import { useHistory } from "react-router-native";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faUser, faHashtag, faSignature, faCheck, faWindowClose, faPills, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import ImageRotating from './ImageRotating';
import ImageRotatingSmall from './ImageRotatingSmall';
import styles from './styles/styles';
import CaregiverView from './CaregiverView';
import Loading from './Loading';

var BASE_URL = 'https://magicmeds.herokuapp.com/';



function User(props) {
   

     useEffect(() => {
        let isCancelled = true;
      
        AsyncStorage.getItem('user_data').then((udata) => {
            if (isCancelled) {
                setIsLoading(false);
                if (udata != null) {
                    setUserData(JSON.parse(udata))
                    //console.log(udata);
                }
                else
                    setUserData(null);
            }
        });
        

        return () => {
            isCancelled = false;
        };
        

     }, []);

    useEffect(() => {
        let daCancel = true;

        AsyncStorage.getItem('user_logged').then((result) => {
            if (daCancel)
                setUserLog(result);
            console.log(result)
        });

        return () => {
            daCancel = false;
        };
    }, []);


    useEffect(() => {
        let cancelled = true;
        getCaregivers().then((result) => {
            if (cancelled)
                setCaregivers(result);
        });

        return () => {
            cancelled = false;
        };
    });


    
    const [isLoading, setIsLoading] = React.useState(true);
    const [usersData, setUserData] = React.useState('');
    const [caresAdded, setCaregivers] = React.useState([]);
    const [isUserLogged, setUserLog] = React.useState('');
    const userid = usersData.id;

    // Hooks for assigning variable
    const [firstnIn, onChangeFName] = React.useState('');
    const [lastnIn, onChangeLName] = React.useState('');
    const [phoneNum, onChangePhoneNum] = React.useState('');


    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);

    const history = useHistory();
    const doLogout = async event => {
        event.preventDefault();

        if (isUserLogged == null)
            history.push('/');
        else {
            history.push('/pillmastermain');
        }
        await AsyncStorage.removeItem('user_logged');
        await AsyncStorage.removeItem('user_data');
        console.log(await AsyncStorage.getItem('user_data'));
        console.log(await AsyncStorage.getItem('user_logged'));
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
        var careView = [];
        var userInfo = '{"userId":"'
            + userid
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/getcare',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status == 1) {
                for (var i = 0; i < (res.caregivers.length); i++) {
                    var unique = i;
                    careView[i] = <CaregiverView key={unique} careid={res.caregivers[i]._id.toString()} carename={res.caregivers[i].FirstName + " " + res.caregivers[i].LastName} phonenum={res.caregivers[i].PhoneNumber} userid={res.caregivers[i].UserId} />
                }            
            }
            return careView;
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }

    };

    if (isLoading) {
        return (
            <Loading />
        );
    }
    else {
        return (
            <View style={styles.userpage}>
                <View>
                    <View style={styles.welcome}>
                        <View style={styles.welcomeuser}>
                            <Text style={styles.welcometext}>Welcome {usersData.firstName} </Text>
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
} export default User