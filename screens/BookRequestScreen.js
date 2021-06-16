import React,{Component} from 'react';
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

export default class BookRequestScreen extends Component{
    constructor(){
        super()
        this.state={
            userid: firebase.auth().currentUser.email,
            bookName: '',
            reasonToRequest:'',
            isBookRequestActive: '',
            requestedBookName: '',
            bookStatus: '',
            requestID: '',
            userDocID: '',
            docID: ''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    addRequest=async(bookName, reasonToRequest)=>{
        var userid = this.state.userid
        var randomRequestId = this.createUniqueId()
        db.collection('requested_books').add({
            'user_id': userid,
            'book_Name': bookName,
            'reason_to_request': reasonToRequest,
            'request_id': randomRequestId,
            'book_Status': 'requested',
            'date': firebase.firestore.FieldValue.serverTimestamp()
        })
        await this.getBookRequest()
        db.collection('users').where('email_ID', '==', userid).get()
        .then()
        .then((snapshot)=>{
             snapshot.forEach((doc)=>{
             db.collection('users').doc(doc.id).update({
                 isBookRequestActive: true
        })
     })
     })
        this.setState({
            bookName: '',
            reasonToRequest: '',
            requestID: randomRequestId
        })
        return alert('Book Requested Successfully')
    }

    receivedBooks=(bookName)=>{
        var userid = this.state.userid
        var requestID = this.state.requestID
        db.collection('received_books').add({
            "user_id": userid,
            "book_Name":bookName,
            "request_id"  : requestID,
            "bookStatus"  : "received",
      
        })
      }

      getIsBookRequestActive(){
        db.collection('users')
        .where('email_ID','==',this.state.userid)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.setState({
            isBookRequestActive:doc.data().isBookRequestActive,
              userDocID : doc.id
            })
          })
        })
      }

      getBookRequest=()=>{
          var bookRequest = db.collection('requested_books')
          .where('user_id','==',this.state.userid)
          .get()
          .then((snapshot)=>{
              snapshot.forEach((doc)=>{
                  if(doc.data().bookStatus!=='received'){
                      this.setState({
                          requestID: doc.data().request_id,
                          requestedBookName: doc.data().book_Name,
                          bookStatus: doc.data().book_Status,
                          docID: doc.id
                      })
                  }
              })
          })
      }

      sendNotification=()=>{
        //to get the first name and last name
        db.collection('users').where('email_ID','==',this.state.userid).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var name = doc.data().first_Name
            var lastName = doc.data().last_Name
      
            // to get the donor id and book nam
            db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
            .then((snapshot)=>{
              snapshot.forEach((doc) => {
                var donorId  = doc.data().donar_id
                var bookName =  doc.data().book_Name
      
                //targert user id is the donor id to send notification to the user
                db.collection('all_notifications').add({
                  "targeted_user_ID" : donorId,
                  "message" : name +" " + lastName + " received the book " + bookName ,
                  "notification_status" : "unread",
                  "book_Name" : bookName
                })
              })
            })
          })
        })
      }

      componentDidMount(){
          this.getBookRequest()
          this.getIsBookRequestActive()
      }

      updateBookRequestStatus=()=>{
        //updating the book status after receiving the book
        db.collection('requested_books').doc(this.state.docID)
        .update({
          bookStatus : 'received'
        })
      
        //getting the  doc id to update the users doc
        db.collection('users').where('email_ID','==',this.state.userid).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            //updating the doc
            db.collection('users').doc(doc.id).update({
              isBookRequestActive: false
            })
          })
        })
      }

    render(){
        if(this.state.isBookRequestActive === true){
            return(
      
              // Status screen
      
              <View style = {{flex:1,justifyContent:'center'}}>
                <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                <Text>Book Name</Text>
                <Text>{this.state.requestedBookName}</Text>
                </View>
                <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                <Text> Book Status </Text>
      
                <Text>{this.state.bookStatus}</Text>
                </View>
      
                <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
                onPress={()=>{
                  this.sendNotification()
                  this.updateBookRequestStatus();
                  this.receivedBooks(this.state.requestedBookName)
                }}>
                <Text>I recieved the book </Text>
                </TouchableOpacity>
              </View>
            )
          }

          else{
        return(
            <View style={{flex: 1}}>
                <MyHeader title = 'Request Books' navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>
                    <TextInput
                    style={styles.formTextInput}
                    placeholder= 'Enter book name'
                    onChangeText= {(text)=>{this.setState({bookName: text})}}
                    value={this.state.bookName}
                    />

                    <TextInput
                    style={[styles.formTextInput, {height: 300}]}
                    placeholder= 'Enter reason'
                    multiline
                    numberOfLines={8}
                    onChangeText= {(text)=>{this.setState({reasonToRequest: text})}}
                    value={this.state.reasonToRequest}
                    />

                    <TouchableOpacity 
                    style={styles.button} 
                    onPress={()=>{this.addRequest(this.state.bookName, this.state.reasonToRequest)}}
                    >
                        <Text>Request</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
          }
    }
}

const styles = StyleSheet.create({
     keyBoardStyle : { flex:1, alignItems:'center', justifyContent:'center' }, 
     formTextInput:{ width:"75%", height:35, alignSelf:'center', borderColor:'#ffab91', borderRadius:10, borderWidth:1, marginTop:20, padding:10, }, 
     button:{ width:"75%", height:50, justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop:20 }, } )

