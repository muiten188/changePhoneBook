/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    FlatList
} from 'react-native';
import Contacts from 'react-native-contacts';
import * as Progress from 'react-native-progress';
import { PermissionsAndroid } from 'react-native';
import { Input } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
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
            totalContact: 100,
            currentContactChange: 0,
            changing: null,
            changed: false,
            test: ''
        }
        this.countChange = 0;
        this.arrChangeContact = [];
        var objChange = { oldChange: '032', newChange: '0168' }
        this.arrChangeContact.push(objChange);
        objChange = { oldChange: '0167', newChange: '033' }
        this.arrChangeContact.push(objChange);
        this.requestWriteContactPermission();
        // Contacts.checkPermission((err, permission) => {
        //     if (err) throw err;

        //     // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        //     if (permission === 'undefined' || permission === 'denied') {
        //         Contacts.requestPermission((err, permission) => {
        //             // ...
        //         })
        //     }
        //     console.log(permission)
        //     if (permission === 'authorized') {
        //         // yay!
        //     }
        //     if (permission === 'denied') {
        //         // x.x

        //     }
        // })
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    changeSubContact(iContact) {
        const { arrChangeContact } = this;
        for (var j = 0; j < arrChangeContact.length; j++) {
            iChangeContact = arrChangeContact[j];
            for (var k = 0; k < iContact.phoneNumbers.length; k++) {
                if (iContact.phoneNumbers[k].number.startsWith(iChangeContact.oldChange)) {
                    iContact.phoneNumbers[k].number = iChangeContact.newChange + iContact.phoneNumbers[k].number.substr(iChangeContact.oldChange.length, iContact.phoneNumbers[k].number.length)
                    Contacts.updateContact(iContact, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            this.countChange = this.countChange + 1;
                            console.log('save successful')
                        }
                    })
                }
            }
        }
    }

    async changePhoneBook1(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            this.setState({ currentContactChange: i * (1 / contacts.length) })
            await this.sleep(5);
            console.log(i * (1 / contacts.length))
            var iContact = contacts[i];
            this.changeSubContact(iContact);

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
        }
        console.log('end')
        this.setState({ changed: true, changing: false })
    }

    changePhoneBook() {
        const { arrChangeContact } = this;
        this.setState({ changed: false, changing: true, currentContactChange: 0 })
        Contacts.getAll((err, contacts) => {
            if (err) {
                Alert.alert('Thông báo', "không thể lấy danh sách danh bạ!")
                return;
            };
            // contacts returned
            console.log(contacts)
            this.setState({ totalContact: contacts.length })
            this.changePhoneBook1(contacts)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    ref={ref => {
                        this.list = ref;
                    }}
                    style={{ width: '100%', padding: 4, paddingTop: 0, marginTop: 0 }}
                    data={this.arrChangeContact}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.buildMenuItem.bind(this)}
                    numColumns={1}
                />
                {this.state.changing != null ? <Progress.Bar progress={this.state.currentContactChange} size={this.state.totalContact} width={250} /> : null}
                <Text style={styles.welcome}>{this.state.test}</Text>
                {this.state.changing ? <Text style={styles.instructions}>Đang thay đổi .....</Text> : null}
                {this.state.changed ? <Text style={styles.instructions}>Thay đổi {this.countChange} contact thành công.</Text> : null}
                <Button onPress={this.changePhoneBook.bind(this)} title="Thay đổi số"></Button>
            </View>
        );
    }

    buildMenuItem(dataItem) {
        var index = dataItem.index;
        var item = dataItem.item;
        return (
            <View style={{ width: '100%', height: 80,borderTopWidth:0.3,borderBottomWidth:0.3,borderBottomColor:'#cecece',borderTopColor:'#cecece' }}>
                <Grid>
                    <Col>
                        <Input textAlign={'center'} placeholder={"Số cũ"} value={item.oldChange}></Input>
                    </Col>
                    <Col>
                        <Input textAlign={'center'} placeholder={"Số mới"} value={item.newChange}></Input>
                    </Col>
                </Grid>

            </View>
        )
    }

    _keyExtractor(item, index) {
        return index;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
