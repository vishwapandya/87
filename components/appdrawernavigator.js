import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './appTabNavigator';
import CustomMenu from './custommenu';
import SettingScreen from '../screens/settingscreen';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/notificationscreen';
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{
        screen: AppTabNavigator
    },
    MyDonations:{
        screen: MyDonationScreen
    },
    Notifications:{
        screen: NotificationScreen
    },
    MyReceivedBooks:{
        screen: MyReceivedBooksScreen
    },
    Settings:{
        screen: SettingScreen
    }
},
{
    contentComponent: CustomMenu
},
{
    initialRouteName: 'Home'
})