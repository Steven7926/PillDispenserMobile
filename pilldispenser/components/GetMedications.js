import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles/styles';
import MedicationView from './MedicationView';
import Loading from './Loading';

var BASE_URL = 'https://magicmeds.herokuapp.com/';

function GetMedications(props) {
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