import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Animated, TextInput, Button, Alert, Navigator, Navigation, Navigate, Modal, TouchableOpacity } from 'react-native';
import { NativeRouter, Route, Switch, useHistory } from "react-router-native";
import ImageRotating from './ImageRotating';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faLock, faSignature, faTerminal, faEnvelope, faSignInAlt, faUserPlus, faHashtag, faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
const hash = require('./md5');


var BASE_URL = 'https://magicmeds.herokuapp.com/';

function Login() {
    // Hooks for Logging in 
    const [uservalue, onChangeUser] = React.useState('');
    const [passvalue, onChangePass] = React.useState('');

    // Hooks for SignUp
    const [userSignupIn, onChangeSignUser] = React.useState('');
    const [passSignupIn, onChangeSignPass] = React.useState('');
    const [firstIn, onChangeFName] = React.useState('');
    const [lastIn, onChangeLName] = React.useState('');
    const [emailIn, onChangeEmail] = React.useState('');
    const [productIn, onChangeProduct] = React.useState('');
 

    // Hook for Modal triggering
    const [modalOpen, setModalOpen] = useState(false);

    // Establish page history for routing through UI
    const history = useHistory();



    //password encryption
    var hashed = hash(passvalue);
    const doLogin = async event => {
        event.preventDefault();
        var js = '{"login":"'
            + uservalue
            + '","password":"'
            + hashed + '"}'; // <- 'hashed' instead of passvalue
        try {

            const response = await fetch(BASE_URL + 'api/login',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            // console.log(res);

            if (res.id <= 0) {
                Alert.alert('Please Review', 'User/Password combination incorrect.');
            }
            else {  // Successful login
           
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id, username: res.username }            
                AsyncStorage.setItem('user_data', JSON.stringify(user));
                history.push('/pillmastermain');
            }

        } catch (error) {
            console.error(error);
        }
    };

    const doSignup = async event => {
        event.preventDefault();


        if (userSignupIn === "" || passSignupIn === "" || firstIn === "" || lastIn === "" || emailIn === "") {
            Alert.alert('Invalid Inputs', 'Please fill in all of the blanks.');
            return;
        }

        //password encryption
        var hashed = hash(passSignupIn);

        var userInfo = '{"login":"'
            + userSignupIn
            + '","password":"'
            + hashed
            + '","firstName":"'
            + firstIn
            + '","lastName":"'
            + lastIn
            + '","email":"'
            + emailIn
            + '","productCode":"'
            + productIn
            + '"}';

        try {
            const response = await fetch(BASE_URL + 'api/signUp',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status === "User already taken!") {
                // Case for when the username is already taken
                Alert.alert('Username already exits', 'It seems that username already exists, please choose a new one');
            }
            else {
                // Case for when the username does not exist
                Alert.alert("Success!", "Account created!");
                setModalOpen(false);

            }
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }
    };


    return (
        <View style={styles.container}>
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
                                <FontAwesomeIcon icon={faTerminal} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Username..."
                                        onChangeText={text => onChangeSignUser(text)}
                                        underlineColorAndroid="transparent"
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faLock} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Password..."
                                        onChangeText={text => onChangeSignPass(text)}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={true}
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Email Address..."
                                        onChangeText={text => onChangeEmail(text)}
                                        underlineColorAndroid="transparent"
                                        style={styles.userInputs}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <FontAwesomeIcon icon={faHashtag} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                                <View style={{ width: 260 }}>
                                    <TextInput
                                        placeholder=" Product Number..."
                                        onChangeText={text => onChangeProduct(text)}
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
                                onPress={doSignup}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <FontAwesomeIcon icon={faCheck} size={20} style={{ color: '#ffffff' }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Up!</Text>
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


            <ImageRotating />
            <Text style={styles.logoText}>Magic Meds</Text>
            <View style={{ flex: 1 }}>
                <View style={{ width: 250, marginLeft: 25 }}>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <FontAwesomeIcon icon={faUser} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                        <View style={{ width: 230 }}>
                            <TextInput
                                placeholder=" Username..."
                                onChangeText={text => onChangeUser(text)}
                                underlineColorAndroid="transparent"
                                style={styles.userInputs}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <FontAwesomeIcon icon={faLock} style={{ color: 'white', paddingTop: 40, marginRight: 5 }} />
                        <View style={{ width: 230 }}>
                            <TextInput
                                placeholder=" Password..."
                                onChangeText={text => onChangePass(text)}
                                underlineColorAndroid="transparent"
                                secureTextEntry={true}
                                style={styles.userInputs}

                            />
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 15, width: 300 }}>
                    <TouchableOpacity
                        style={styles.loginbut}
                        activeOpacity={.5}
                        onPress={doLogin}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faSignInAlt} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 20, width: 300 }}>
                    <TouchableOpacity
                        style={styles.loginbut}
                        activeOpacity={.5}
                        onPress={() => setModalOpen(true)}
                    >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={faUserPlus} size={20} style={{ color: '#ffffff' }} />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}> Sign Up!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
} export default Login;
