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
    FlatList,
    ScrollView} from 'react-native';

import db from '../config';
import firebase from 'firebase';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';

export default class BookDonateScreen extends Component{
    constructor(){
        super()
        this.state={
            requestedBookList: []
        }
        this.requestRef = null
    }
    getRequestedBookList=()=>{
        this.requestRef = db.collection('requested_books')
        .onSnapshot((snapshot)=>{
            var requestedBookList = snapshot.docs.map(document=>document.data())
            this.setState({
                requestedBookList: requestedBookList
            })
        })
    }
    componentDidMount(){
        this.getRequestedBookList()
    }
    componentWillUnmount(){
        this.requestRef()
    }
    keyExtractor=(item, index)=>index.toString()
    renderItem=({item,i})=>{
        return(
            <ListItem
            key={i}
            title={item.book_Name}
            subtitle={item.reason_to_request}
            titleStyle={{color:'black', fontWeight: 'bold'}}
            rightElement={
                <TouchableOpacity 
                style={styles.button} 
                onPress ={()=>{
                    this.props.navigation.navigate("ReceiverDetails",{"details": item})
                  }}
                >       
                    <Text style={{color: 'white'}}>View</Text>
                </TouchableOpacity>
            }
            bottomDivider
            />
        )
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <MyHeader title = 'Donate Books' navigation = {this.props.navigation}/>
                 <View style={{flex: 1}}>
                     {
                         this.state.requestedBookList.length===0
                         ?(
                             <View style={styles.subContainer}>
                                 <Text style={{fontSize: 20}}>
                                     List of All Requested Books
                                 </Text>
                             </View>    
                         )
                         :(
                             <FlatList
                             data={this.state.requestedBookList}
                             keyExtractor={this.keyExtractor}
                             renderItem={this.renderItem}
                             />
                         )
                     }
                 </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    subContainer:{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' }, 
    button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8 } } })
