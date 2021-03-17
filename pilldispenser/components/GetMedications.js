import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles/styles';
import MedicationView from './MedicationView';
import Loading from './Loading';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

var BASE_URL = 'https://magicmeds.herokuapp.com/';

function GetMedications(props) {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        let anotherCancelled = true;

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            if (anotherCancelled)
                setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
            anotherCancelled = false;
        };
    }, []);

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
        let cancelled = true;
        getMedication().then((result) => {
            if (cancelled) {
                setIsLoadingPills(false);
                setPills(result);
            }
        });

        return () => {
            cancelled = false;
        };
    });

    const [isLoadingPills, setIsLoadingPills] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(true);
    const [usersData, setUserData] = React.useState('');
    const userid = usersData.id;
    const [pillsbeingtaken, setPills] = useState([]);

    const getMedication = async event => {
        var userInfo = '{"userId":"'
            + userid
            + '"}';

        var medicationsView = [];

        try {
            const response = await fetch(BASE_URL + 'api/getmed',
                { method: 'POST', body: userInfo, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.status == 1) {
                for (var i = 0; i < (res.meds.length); i++) {
                    var unique = i;
                    var newtime = calculateTime(res.meds[i].TimeTaken);
                    var thetime = getDate();
                    
                    if (res.meds[i].DayTaken + " " + res.meds[i].TimeTaken + ":00" == thetime) {
                        var message = "Hey there " + usersData.firstName + "!" + " Your " + res.meds[i].Dosage + " of " + res.meds[i].MedicationName + " has been dispensed. Please make sure you take it."
                        await schedulePushNotification(message);
                    }

                    medicationsView[i] = <MedicationView key={unique} medid={res.meds[i]._id.toString()} medname={res.meds[i].MedicationName} dosage={res.meds[i].Dosage} daytaken={res.meds[i].DayTaken} timetaken={newtime} userid={res.meds[i].UserId} />
                }
            }
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
            return;
        }
        return medicationsView;
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

        else if (parseInt(hour) > 0 && parseInt(hour) < 12)
            newtime = (parseInt(hour)).toString() + ':' + minutes + ' AM';

        return newtime;
    }

    function getDate() {

        var date = new Date();
        var datetime = date.getDay() + "  " + (date.toLocaleTimeString())
        var dayofweek = datetime.split("  ")[0];
        var day = '';

        var timeFormat = datetime.split("  ")[1];

        if (dayofweek == 0)
            day = "Sunday";
        if (dayofweek == 1)
            day = "Monday";
        if (dayofweek == 2)
            day = "Tuesday";
        if (dayofweek == 3)
            day = "Wednesday";
        if (dayofweek == 4)
            day = "Thursday";
        if (dayofweek == 5)
            day = "Friday";
        if (dayofweek == 6)
            day = "Saturday";

        var finalTime = day + " " + calculateTime24(timeFormat);
        return finalTime;
    }


    function calculateTime24(thetime) {
        var sub = thetime.split(":");
        var hour = sub[0];
        var minutes = sub[1];
        var pm = sub[2].split(" ");
        var seconds = pm[0]
        var newtime = "";

        if (parseInt(hour) == 12)
            newtime = '00:' + minutes + ':' + seconds;

        else if (pm[1] === 'PM')
            newtime = parseInt(hour) + 12 + ':' + minutes + ':' + seconds;
        else {
            if (parseInt(hour) < 10)
                newtime = "0" + parseInt(hour) + ':' + minutes + ':' + seconds;
            else
                newtime = parseInt(hour) + ':' + minutes + ':' + seconds;
        }

        return newtime;
    }

    if (isLoadingPills && isLoading) {
        return (
            <Loading />
        );
    }
    else {
        // Return this View
        return (
            <ScrollView style={styles.caregiver}>
                {pillsbeingtaken}               
            </ScrollView>               
        );
    }

} export default GetMedications

async function schedulePushNotification(message) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "💊💊💊💊 Pill Dispense Alert! 💊💊💊💊",
            body: message,
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}