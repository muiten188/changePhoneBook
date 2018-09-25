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
                console.log("You can write contact")
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
            } else {
                console.log("Contact permission denied")
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
            test: '',
            arrChangeContact: [
                //viettel
                { oldChange: '0162', newChange: '032' },
                { oldChange: '0163', newChange: '033' },
                { oldChange: '0164', newChange: '034' },
                { oldChange: '0165', newChange: '035' },
                { oldChange: '0166', newChange: '036' },
                { oldChange: '0167', newChange: '037' },
                { oldChange: '0168', newChange: '038' },
                { oldChange: '0169', newChange: '039' },
                //mobifone
                { oldChange: '0120', newChange: '070' },
                { oldChange: '0121', newChange: '079' },
                { oldChange: '0122', newChange: '077' },
                { oldChange: '0126', newChange: '076' },
                { oldChange: '0128', newChange: '078' },
                //vinaphone
                { oldChange: '0123', newChange: '083' },
                { oldChange: '0124', newChange: '084' },
                { oldChange: '0125', newChange: '085' },
                { oldChange: '0127', newChange: '081' },
                { oldChange: '0129', newChange: '082' },
                //vietnam mobile
                { oldChange: '0186', newChange: '056' },
                { oldChange: '0188', newChange: '058' },
                //Gmobile
                { oldChange: '0199', newChange: '059' },
            ]
        }
        this.countChange = 0;
        this.requestWriteContactPermission();
        
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    changeSubContact(iContact) {
        const { arrChangeContact } = this.state;
        for (var j = 0; j < arrChangeContact.length; j++) {
            iChangeContact = arrChangeContact[j];
            for (var k = 0; k < iContact.phoneNumbers.length; k++) {
                if (iContact.phoneNumbers[k].number.startsWith(iChangeContact.oldChange)) {
                    try {
                        iContact.phoneNumbers[k].number = iChangeContact.newChange + iContact.phoneNumbers[k].number.substr(iChangeContact.oldChange.length, iContact.phoneNumbers[k].number.length)
                        Contacts.updateContact(iContact, this.updateContact.bind(this))
                    }
                    catch (e) {
                        console.warn(e);
                    }

                }
            }
        }
    }

    updateContact(err) {
        if (err) {
            console.log(err)
        }
        else {
            this.countChange = this.countChange + 1;
            console.log('save successful:' + this.countChange)
        }
    }

    async changePhoneBook1(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            this.setState({ currentContactChange: (i * (1 / contacts.length)) })
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
        await this.sleep(300);
        console.log('end')
        this.setState({ currentContactChange: 1 })
        await this.sleep(100);
        this.setState({ changed: true, changing: false })
    }

    changePhoneBook() {
        const { arrChangeContact } = this.state;
        this.setState({ changed: false, changing: true, currentContactChange: 0 })
        Contacts.getAll((err, contacts) => {
            console.log(contacts)
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
        console.log('index:' + this.countChange)
        return (
            <View style={styles.container}>
                <Grid>
                    <Row style={{ height: 50 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text textAlign={'center'} placeholder={"Số cũ"}>Đầu số cũ</Text>
                        </Col>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Đầu số mới</Text>
                        </Col>
                    </Row>
                    <Row>
                        <FlatList
                            ref={ref => {
                                this.list = ref;
                            }}
                            style={{ width: '100%', padding: 4, paddingTop: 0, marginTop: 0, borderWidth: 0.4, borderColor: '#cecece' }}
                            data={this.state.arrChangeContact}
                            keyExtractor={this._keyExtractor}
                            renderItem={this.buildMenuItem.bind(this)}
                            numColumns={1}
                        />
                    </Row>
                    {this.state.changing != null ? <Row style={{ height: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Progress.Bar animationType={"timing"} progress={this.state.currentContactChange} size={this.state.totalContact} width={250} />
                    </Row> : null}
                    {this.state.changing || this.state.changed ? <Row style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        {this.state.changing ? <Text style={styles.instructions}>Đang thay đổi .....</Text> : null}
                        {this.state.changed ? <Text style={styles.instructions}>Thay đổi {this.countChange} contact thành công.</Text> : null}
                    </Row> : null}
                    <Button onPress={this.changePhoneBook.bind(this)} title="Thay đổi số"></Button>
                </Grid>
            </View>
        );
    }

    buildMenuItem(dataItem) {
        var index = dataItem.index;
        var item = dataItem.item;
        return (
            <View style={{ width: '100%', height: 50 }}>
                <Grid>
                    <Col style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.4, borderColor: '#cecece' }}>
                        <Text textAlign={'center'} placeholder={"Số cũ"}>{item.oldChange}</Text>
                    </Col>
                    <Col style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.4, borderColor: '#cecece' }}>
                        <Text>{item.newChange}</Text>
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
