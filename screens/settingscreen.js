import React,{Component}from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class SettingScreen extends Component{
    constructor(){
        super();
        this.state={
            firstName: '',
            lastName: '',
            emailID: '',
            address: '',
            contact: '',
            docID: ''
        }
    }
    getUserDetails=()=>{
        var email = firebase.auth().currentUser.email
        db.collection('users').where('email_ID','==',email).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                var data = doc.data()
                this.setState({
                    emailID: data.email_ID,
                    firstName: data.first_Name,
                    lastName: data.last_Name,
                    address: data.Address,
                    contact: data.Contact,
                    docID: doc.id
                })
            })
        })
    }

    updateUserDetails=()=>{
        db.collection('users').doc(this.state.docID)
        .update({
            'first_Name': this.state.firstName,
            'last_Name': this.state.lastName,
            'Address': this.state.address,
            'Contact': this.state.contact
        })
        Alert.alert('Profile Updated Successfully')
    }
    componentDidMount(){
        this.getUserDetails()
    }

    render(){
        return(
            <View style={styles.container}>
                <MyHeader
                title= 'Settings'
                navigation={this.props.naviagtion}
                />
                <View style={styles.formContainer}>
                    <TextInput
                    style={styles.formTextInput}
                    placeholder='First Name'
                    maxLength={8}
                    onChangeText={(text)=>{
                        this.setState({firstName: text})
                    }}
                    value={this.state.firstName}
                    />

                    <TextInput
                    style={styles.formTextInput}
                    placeholder='Last Name'
                    maxLength={8}
                    onChangeText={(text)=>{
                        this.setState({lastName: text})
                    }}
                    value={this.state.lastName}
                    />

                    <TextInput
                    style={styles.formTextInput}
                    placeholder='Contact'
                    maxLength={10}
                    keyboardType={'numeric'}
                    onChangeText={(text)=>{
                        this.setState({contact: text})
                    }}
                    value={this.state.contact}
                    />

                    <TextInput
                    style={styles.formTextInput}
                    placeholder='Address'
                    multiline={true}
                    onChangeText={(text)=>{
                        this.setState({address: text})
                    }}
                    value={this.state.address}
                    />

                    <TouchableOpacity 
                    style={styles.button} 
                    onPress={()=>{this.updateUserDetails()}}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
     flex:1,
     backgroundColor:'#F8BE85',
     alignItems: 'center',
     justifyContent: 'center'
   },
    formContainer:{
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    button:{
        width:'75%',
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
      },
      buttonText:{
        color:'#ffff',
        fontWeight:'bold',
        fontSize:20
      }
})