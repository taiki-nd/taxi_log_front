import { StyleSheet, View, KeyboardAvoidingView, Image } from 'react-native';
import {  BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';

export const Signin = (props: any) => {
  // 画面遷移
  const moveScreen = (screen: any) => {
    props.navigation.navigate(screen)
  }
  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAvoidingView enabled>
          <View style={{alignItems: 'center'}}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo}></Image>
          </View>
            {/* Google */}

          <StandardTextInput placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false}/>
          <StandardTextInput placeholder="Enter password" keyboardType="default" secureTextEntry={true}/>
          {/*errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null*/}
          <StandardButton displayText={"SIGNIN"}/>
          <StandardTextLink displayText="Signup here" onPress={() => moveScreen("Signup")}/>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 300,
    height: 200,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});