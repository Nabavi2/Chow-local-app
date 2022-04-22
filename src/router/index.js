import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  SplashScreen, 
  MyAccountScreen,
  CheckPasswordScreen,
  // HomeScreen,
  PastOrdersScreen,
  PreOrdersScreen,
  OrderDetailsScreen,
  SelectorPageScreen,
  MessageRoomScreen,
  UpdateStatusScreen,
  SubscriptionActiveScreen,
  OrderOptionsScreen,
  OrderRefundScreen,
  OrderRejectScreen,
  OrderRejectReasonScreen,
  OrderAcceptScreen,
  RequestDeliveryScreen,
  RequestDeliveryAddressScreen,
  RequestDeliveryDetailScreen,
  RequestDeliveryCustomerScreen,
  RequestDeliveryInstructionScreen,
  RequestDeliveryETAOtherScreen,
  HomeScreen,
  RequestDeliveryOutside1Screen,
  DeliveryETAScreen,
  ETADetailsScreen,
  StoreListScreen,
  StoreStatusScreen,
  SettingsScreen,
  SettingsPrinterScreen,
  UpdateCreditCardScreen,
  MySubscriptionScreen
} from '../screens';

const AppNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
    },
    MyAccount: {
      screen: MyAccountScreen,
    },
    // Auth Screens
    CheckPassword: {
      screen: CheckPasswordScreen,
    },
    UpdateStatus: {
      screen: UpdateStatusScreen,
    },
    SubscriptionActive: {
      screen: SubscriptionActiveScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    // Reset Password
    // Main Screens
    UpdateCreditCard: {
      screen: UpdateCreditCardScreen,
    },   
    PastOrders: {
      screen: PastOrdersScreen,
    },
    PreOrders: {
      screen: PreOrdersScreen,
    },
    OrderDetails: {
      screen: OrderDetailsScreen,
    },
    OrderRefund: {
      screen: OrderRefundScreen,
    },
    OrderReject: {
      screen: OrderRejectScreen,
    },
    OrderRejectReason: {
      screen: OrderRejectReasonScreen,
    },
    OrderAccept: {
      screen: OrderAcceptScreen,
    },
    OrderOptions: {
      screen: OrderOptionsScreen,
    }, 
    MessageRoom : {
      screen : MessageRoomScreen,
    }, 
    RequestDelivery : {
      screen : RequestDeliveryScreen,
    },
    RequestDeliveryAddress : {
      screen : RequestDeliveryAddressScreen,
    },
    RequestDeliveryCustomer : {
      screen : RequestDeliveryCustomerScreen,
    },
    RequestDeliveryDetail : {
      screen: RequestDeliveryDetailScreen,
    },
    RequestDeliveryOutside1 : {
      screen: RequestDeliveryOutside1Screen,
    },
    RequestDeliveryInstruction : {
      screen: RequestDeliveryInstructionScreen,
    },
    RequestDeliveryETAOther : {
      screen: RequestDeliveryETAOtherScreen,
    },
    DeliveryETA : {
      screen: DeliveryETAScreen,
    },
    ETADetails : {
      screen: ETADetailsScreen,
    },
    StoreList : {
      screen: StoreListScreen,
    },
    StoreStatus : {
      screen: StoreStatusScreen,
    },
    Settings : {
      screen: SettingsScreen,
    },
    SettingsPrinter : {
      screen: SettingsPrinterScreen,
    },
    // shared
    MySubscription : {
      screen: MySubscriptionScreen,
    },
    SelectorPage: {
      screen: SelectorPageScreen,
    },
 
  },

  {
    initialRouteName: 'Splash',
    defaultNavigationOptions: {
      headerBackTitle: ' ',
      gestureEnabled: false,
    },
  },
);

export default createAppContainer(AppNavigator);
