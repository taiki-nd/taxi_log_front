import { StyleSheet, TextInput, View, Text, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AccentColor, BackColor, BasicColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';

export const Signup = (props: any) => {
  // 画面遷移
  const moveScreen = (screen: any) => {
    props.navigation.navigate(screen)
  }
  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAvoidingView enabled>
          <View style={{alignItems: 'center'}}>
            {/* LOGO */}
          </View>
          {/* Google */}
          <StandardTextInput placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false}/>
          <StandardTextInput placeholder="Enter password" keyboardType="default" secureTextEntry={true}/>
          <StandardTextInput placeholder="Confirm password" keyboardType="default" secureTextEntry={true}/>
          {/*errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null*/}
          <StandardButton displayText={'SIGNUP'}/>
          <StandardTextLink displayText="Signin here" onPress={() => moveScreen("Signin")}/>
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
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  inputStyle: {
    flex: 1,
    color: BasicColor,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: BasicColor,
  },
  registerTextStyle: {
    color: BasicColor,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});