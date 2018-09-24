/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});



export default class App extends Component {
    async requestWriteContactPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera")
            } else {
                console.log("Camera permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            totalContact: 0,
            currentContactChange: 0,
            changing: false,
            changed: false
        }
        this.arrChangeContact = [];
        var objChange = { oldChange: '0168', newChange: '032' }
        this.arrChangeContact.push(objChange);
        objChange = { oldChange: '0167', newChange: '033' }
        this.arrChangeContact.push(objChange);
        this.requestWriteContactPermission();
        Contacts.checkPermission((err, permission) => {
            if (err) throw err;

            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined' || permission === 'denied') {
                Contacts.requestPermission((err, permission) => {
                    // ...
                })
            }
            console.log(permission)
            if (permission === 'authorized') {
                // yay!
            }
            if (permission === 'denied') {
                // x.x

            }
        })
    }

    changePhoneBook() {
        const { arrChangeContact } = this;
        this.setState({ changed: false, changing: true })
        Contacts.getAll((err, contacts) => {
            if (err) {
                Alert.alert('Thông báo', "không thể lấy danh sách danh bạ!")
                return;
            };
            // contacts returned
            console.log(contacts)
            this.setState({ totalContact: contacts.length })
            for (var i = 0; i < contacts.length; i++) {
                var iContact = contacts[i];
                for (var j = 0; j < arrChangeContact.length; i++) {
                    iChangeContact = arrChangeContact[j];
                    for (var k = 0; k < iContact.phoneNumbers.length; k++) {
                        if (iContact.phoneNumbers[k].number.startsWith(iChangeContact.oldChange)) {
                            iContact.phoneNumbers[k].number = iChangeContact.newChange + iContact.phoneNumbers[k].number.substr(iChangeContact.oldChange.length + 1, iContact.phoneNumbers[k].number.length)
                            Contacts.updateContact(iContact, (err) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    this.setState({ changing: true, currentContactChange: i })
                                    console.log('save successful')
                                }
                            })
                        }
                    }
                }
                //iContact.familyName = (iContact.familyName ? iContact.familyName : '') + '_new';
                //this.setState({ changing: true, currentContactChange: i })
                // if (iContact.company == 'deleted') {
                //     Contacts.deleteContact(iContact, (err) => {
                //         if (err) {
                //             console.log(err)
                //         }
                //         else {
                //           this.setState({ changing: true, currentContactChange: i })
                //             console.log('save successful')
                //         }
                //     })
                // }
                // Contacts.addContact(iContact, (err) => {
                //     if (err) {
                //         console.log(err)
                //     }
                //     else {
                //         this.setState({ changing: true, currentContactChange: i })
                //         console.log('save successful')
                //     }
                // })
                console.log('end')
                //this.setState({ changed: true, changing: false })
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                {this.state.changing ? <Text style={styles.instructions}>Đang thay đổi {this.state.currentContactChange}/{this.state.totalContact}</Text> : null}
                {this.state.changed ? <Text style={styles.instructions}>Thay đổi danh bạ thành công.</Text> : null}
                <Button onPress={this.changePhoneBook.bind(this)} title="Thay đổi số"></Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
