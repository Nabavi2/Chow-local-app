import { View, StyleSheet, Switch, Alert,FlatList, DeviceEventEmitter, NativeEventEmitter,TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAPI } from '~/core/utility';
import { NavigationService } from '~/core/services';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen, Button, AppText, Input } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
import { showNotification, updateStatus, isUpdateStatus, setAutoPrinterEnable, setSelectedPrinterAddress, setPrintAsText } from '~/store/actions';
import { Platform } from 'react-native';
import {BluetoothManager} from "react-native-bluetooth-escpos-printer";
import {CheckBox} from 'react-native-elements';
export const SettingsPrinterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const token = useSelector((state) => state.account.token);
  const isAutoEnabled = useSelector((state) => state.account.autoPrinterEnable);
  const printAsText = useSelector((state) => state.account.printAsText);
  console.log("printAsText  " , isAutoEnabled);
  const selectedPrinterAddress = useSelector((state) => state.account.selectedPrinterAddress);
  // const [isAutoEnabled, setisAutoEnabled] = useState(false);
  const [devices, setDevices] = useState('');
  const [pairedDs, setPairedDS] = useState([]);
  const [foundDs, setFoundDS] = useState([]);
  const [bleOpend,setbleOpend] = useState(false);
  const [boundAddress, setBoundAddress] = useState('');
  const [selectedName ,setSelectedName] = useState('');


  const toggleSwitch = () => {
    dispatch(setAutoPrinterEnable(!isAutoEnabled));
  }

  const toggleSwitchPrint = () => {
    dispatch(setPrintAsText(!printAsText));
  }

  useEffect(() => {
    //Alert.alert('checking bluetooth printers', JSON.stringify(foundDs));
    
    BluetoothManager.isBluetoothEnabled().then((enabled)=> {
      setbleOpend(Boolean(enabled));
      }, (err)=> {err});

      if (Platform.OS === 'ios') {
        let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
        bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
            (rsp)=> {
                _deviceAlreadyPaired(rsp)
            });
        bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
            _deviceFoundEvent(rsp)
        });
        bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
          setBoundAddress('');
            // this.setState({
            //     name: '',
            //     boundAddress: ''
            // });
        });
    } else if (Platform.OS === 'android') {
        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp)=> {
                _deviceAlreadyPaired(rsp)
            });
        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                _deviceFoundEvent(rsp)
            });
        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                // this.setState({
                //     name: '',
                //     boundAddress: ''
                // });
                setBoundAddress('');
            }
        );
        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, ()=> {
                Alert.alert("Device Not Support Bluetooth !");
            }
        );
    }
  },[]);

  useEffect(() => {
      if(!bleOpend){
        BluetoothManager.enableBluetooth().then((r)=>{
            var paired = [];
            if(r && r.length>0){
                for(var i=0;i<r.length;i++){
                    try{
                        paired.push(JSON.parse(r[i]));
                    }catch(e){
                        //ignore
                    }
                }
            }
            setbleOpend(true);
            setPairedDS(paired);
            
        },(err)=>{          
          Alert.alert(' bluetooth enableing printers', JSON.stringify(err));
        });
      }
  },[bleOpend]);

  const _deviceAlreadyPaired= useCallback((rsp) => {
    var ds = null;
    if (typeof(rsp.devices) == 'object') {
        ds = rsp.devices;
    } else {
        try {
            ds = JSON.parse(rsp.devices);
        } catch (e) {
        }
    }
    if(ds && ds.length) {
        let pared = pairedDs;
        pared = pared.concat(ds||[]);
       setPairedDS(pared);
    }
  });

  const _deviceFoundEvent= useCallback((rsp) => {
      try {
          if (typeof(rsp.device) == "object") {
              r = rsp.device;
          } else {
              r = JSON.parse(rsp.device);
          }
      } catch (e) {//alert(e.message);
          //ignore
      }
      //alert('f')
      if (r) {
          let found = foundDs || [];
          if(found.findIndex) {
              let duplicated = found.findIndex(function (x) {
                  return x.address == r.address
              });
              //CHECK DEPLICATED HERE...
              if (duplicated == -1) {
                  found.push(r);
                  setFoundDS(found);
              }
          }
      }
  });

  const _scan = () => {
    setLoading(true);
    BluetoothManager.scanDevices()
        .then((s)=> {
            var ss = s;
            var found = ss.found;            
            var paired = ss.paired;
            try {
                found = JSON.parse(found);//@FIX_it: the parse action too weired..
            } catch (e) {
                //ignore
            }
            var fds = foundDs;
            if(found && found.length){
                fds = found;
            }
            setFoundDS(fds);
            
          
            try {
                paired = JSON.parse(paired);//@FIX_it: the parse action too weired..
            } catch (e) {
                //ignore
            }
            var pds = pairedDs;
            if(paired && paired.length){
                pds = paired;
            }
            setPairedDS(pds);
            //Alert.alert('scanning result bluetooth printers', JSON.stringify(fds));


            setLoading(false);
        }, (er)=> {
          setLoading(false);
          Alert.alert('scan devices error', JSON.stringify(er));
        });
  }


  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle: (
        <Icon size={40} color='black' name="menu" />
      ),
    });
  }, []);

  const openMenu = useCallback(() => {
    navigation.navigate('MyAccount');
  }, []);


  
  return (
    <Screen hasList isLoading={isLoading}  >      
        <TouchableOpacity activeOpacity={1} style={styles.container} onPress={()=> {Keyboard.dismiss()}}>
          <AppText style={styles.heading_order}>SELECT A PRINTER</AppText>
          <FlatList
              style={styles.list}
              scrollEnabled={true}
              data={foundDs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (      
                     <></>
              )}
              ListFooterComponent={() => (
              <>
               {foundDs.map((item, index) => ( <TouchableOpacity style={styles.viewOrder} onPress={() => {
                dispatch(setSelectedPrinterAddress(item.address));
                setSelectedName(item.name);
                setLoading(true);
                BluetoothManager.connect(item.address)
                .then((s)=>{
                  setBoundAddress(item.address);
                  setSelectedName(item.name || "UNKNOWN")
                  setLoading(false);    
                  dispatch(showNotification({type: 'success', message: "Successfully Connected!"})); 
                },(e)=>{
                    setLoading(false);
                    Alert.alert('connection error devices error', JSON.stringify(e));
                })
              }}>
              <AppText style={{flex: 3, fontSize:15, width:'100%', paddingLeft:10, marginBottom: 1}} >{item.name} = {item.address}</AppText>                                        
                <View style={{width: 40, alignItems:'center'}}>
                  <CheckBox containerStyle={styles.radioBackground} title="" checkedColor={Theme.color.accentColor} checked={selectedPrinterAddress==item.address ? true : false} checkedIcon='dot-circle-o'  onPress = {() => {
                    dispatch(setSelectedPrinterAddress(item.address));
                    setSelectedName(item.name);
                    setLoading(true);
                    BluetoothManager.connect(item.address)
                    .then( (s)=>{
                      setBoundAddress(item.address);
                      setSelectedName(item.name || "UNKNOWN")
                      setLoading(false);
                      dispatch(showNotification({type: 'success', message: "Successfully Connected!"})); 
                    },(e)=>{
                        setLoading(false);
                        Alert.alert('Unable to connect that device');
                    })}}
                    uncheckedIcon='circle-o'/>
                </View>                      
            </TouchableOpacity>)) }
            </>
            )}
            ListHeaderComponent={() => (           
              <>
            {pairedDs.map((item, index) => ( 
            <TouchableOpacity style={styles.viewOrder_paried} onPress={() => {
                dispatch(setSelectedPrinterAddress(item.address));
                setSelectedName(item.name);
                setLoading(true);
                BluetoothManager.connect(item.address)
                .then((s)=>{
                  setBoundAddress(item.address);
                  setSelectedName(item.name || "UNKNOWN")
                  setLoading(false);     
                  dispatch(showNotification({type: 'success', message: "Successfully Connected!"})); 
                           
                },(e)=>{
                    setLoading(false);
                    Alert.alert('connection error devices error', JSON.stringify(e));
                })
              }}>
              <AppText style={{flex: 3, fontSize:15, width:'100%', paddingLeft:10, marginBottom: 1}} >{item.name} = {item.address}</AppText>                                        
                <View style={{width: 40, alignItems:'center'}}>
                  <CheckBox containerStyle={styles.radioBackground} title="" checkedColor={Theme.color.accentColor} checked={selectedPrinterAddress==item.address ? true : false} checkedIcon='dot-circle-o'  onPress = {() => {
                    dispatch(setSelectedPrinterAddress(item.address));
                    setSelectedName(item.name);
                    setLoading(true);
                    BluetoothManager.connect(item.address)
                    .then( (s)=>{
                      setBoundAddress(item.address);
                      setSelectedName(item.name || "UNKNOWN")
                      setLoading(false);
                      dispatch(showNotification({type: 'success', message: "Successfully Connected!"})); 
                
                    },(e)=>{
                        setLoading(false);
                        Alert.alert('connection error devices error', JSON.stringify(e));
                    })
                  }}  uncheckedIcon='circle-o'/>
                </View>                      
            </TouchableOpacity>
            ))}
            </>
            )}  
            />
          <Button
            type="bordered-dark"
            style={GlobalStyles.formControl}
            onClick={() => {_scan();}}>
            Scan Printers
          </Button>
          <View style={printAsText ? styles.viewTerminalEnabled : styles.viewTerminal} >
              <View style={{flexDirection: 'column',flex:10,}}>
              <AppText style={printAsText ? {fontSize:13, fontWeight:'bold', width:'100%', paddingLeft: 20, color: "black"} : {fontSize:13, fontWeight:'bold', width:'100%', paddingLeft: 20, color: "#787878"}} >Print as Plain Text</AppText>                                        
              </View>
              <View>              
              <Switch
                style={{marginRight: 20}}
                trackColor={{ false: "#373536", true: "#2fd34f" }}
                thumbColor={printAsText ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor={{ false: "#373536", true: "#2fd34f" }}
                onValueChange={toggleSwitchPrint}
                value={printAsText}
              />
            </View>                  
            </View>
          <View style={isAutoEnabled ? styles.viewTerminalEnabled : styles.viewTerminal}>            
            <View style={{flexDirection: 'column',flex:10,}}>
              <AppText style={isAutoEnabled == true ? {fontSize:13, fontWeight:'bold', width:'100%', paddingLeft: 20, color: "black"} : {fontSize:13, fontWeight:'bold', width:'100%', paddingLeft: 20, color: "#787878"}}>Auto-print new orders{isAutoEnabled}</AppText>             
            </View>
            <View>
            <Switch
              style={{marginRight: 20}}
              trackColor={{ false: "#373536", true: "#2fd34f" }}
              thumbColor={isAutoEnabled ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor={{ false: "#373536", true: "#2fd34f" }}
              onValueChange={toggleSwitch}
              value={isAutoEnabled}
            />
            </View>
          </View>
          <View>
            <AppText style={styles.heading_manual}>Manually Enter Printer Address</AppText>
            <View>
              <Input
                titleType='text'
                style={{marginBottom: 10}}
                title={"Address"}
                placeholder="Bluetooth printer address"
                value={selectedPrinterAddress}
                keyboardType="default"
                onChange={(e) => dispatch(setSelectedPrinterAddress(e))}
              />
            </View>
          </View>
        </TouchableOpacity>      
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,
  },

  heading_order : {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    marginTop: 0,
  },

  heading_manual : {
    textAlign: 'left',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10
  },

  name: {
    fontSize: 16,
    textAlign: 'center',
    // textTransform: 'uppercase',
    color: "#333",
    marginBottom: 5,
  },

  number: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '100',
    marginBottom: 10,
    color: '#6f6f6e',
  },

  viewTerminal: {
    flexDirection:'row',
    backgroundColor:'#e1e1e1',
    marginTop:10, 
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  viewTerminalEnabled: {
    flexDirection:'row',
    backgroundColor:'#e5f9e7',
    marginTop:10, 
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  viewOrder: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#efefef',
    marginTop:10, 
    paddingHorizontal:15,
    height: 60
  },

  viewOrder_paried: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#afefaf',
    marginTop:10, 
    paddingHorizontal:15,
    height: 60
  },

  
  viewOrder_plain: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#e1e1e1',
    marginTop:10, 
    paddingHorizontal:15,
    height: 50
  },

  radioBackground: {
    backgroundColor: Theme.color.container,
    borderWidth: 0,
    marginLeft: 0,
    paddingHorizontal:0
  },
});

SettingsPrinterScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });
