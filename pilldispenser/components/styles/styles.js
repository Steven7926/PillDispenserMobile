import React from 'react';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e3f66',
        paddingTop: 100,
        paddingRight: 20,
        paddingLeft: 20,
        paddingHorizontal: 20
    },

    signupcontainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#1e3f66',
        paddingTop: 20
    },   
    userInputs: {
        color: "#ffffff",
        height: 40,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        textAlign: 'center'
    },
    postInput: {
        color: "#ffffff",
        height: 160,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        textAlign: 'center'
    },
    submitButtonStyle: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#c66156',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
        position: "absolute",
        bottom: 20,
        right: 20
    },
    submitProfileButtonStyle: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#c66156',
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
        position: "absolute",
        bottom: 20,
        right: 0
    },
    logoText: {
        marginVertical: 15,
        fontSize: 40,
        color: 'white',
        textAlign: 'center'
    },
    userInputs: {
        color: "#ffffff",
        height: 40,
        borderColor: 'gray',
        borderWidth: 3,
        borderRadius: 10,
        textAlign: 'center'
    },
   
    loginbut: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#8c2f39',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
    },
   
    closebutton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#8c2f39',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
        marginTop: 10
    },

    signoutbut: {
        backgroundColor: '#8c2f39',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
    },

    timebut: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#1e3f66',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'gray',
        width: 260
    },

    welcome: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end' 
    },

    welcomeuser: {      
        
    },

    welcometext: {
        marginVertical: 15,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },

    caregiver: {
        backgroundColor: '#D3D3D3',
        width: 375,
        height: 500,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: 'gray'
    },

    userpage: {
        flex: 1,
        backgroundColor: '#1e3f66',
        paddingTop: 50,
        paddingRight: 20,
        paddingLeft: 20,
        paddingHorizontal: 20
    },

    addcare: {
        paddingBottom: 10,
        marginTop: 10
    },

    hr: {
        width: 375,
        height: 1,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#fff',
        marginBottom: 20
    },

    hrsmall: {
        width: 6,
        height: 1,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#fff',
        marginBottom: 20
    },

    editbut: {
        backgroundColor: '#149414',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
        width: 170,
        height: 30,
        paddingTop: 2,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 7
    },

    deletebut: {
        backgroundColor: '#ae0700',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
        width: 50,
        height: 30,
        paddingTop: 2,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },

    medContainer: {
        paddingLeft: 5,
        paddingBottom: 4,
        flex: 1

    },

    caregiverContainer: {
        paddingLeft: 10,
        paddingBottom: 4,
        flex: 1

    },

     hrbelowbut: {
        width: 320,
        height: 1,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#8c2f39',
        marginBottom: 5,
        marginLeft: 20,
        marginTop: 5

    },

});
export default styles;