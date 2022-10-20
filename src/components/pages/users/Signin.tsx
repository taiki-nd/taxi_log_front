import { StyleSheet, TextInput, View, Text, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AccentColor, BackColor, BasicColor } from '../../../styles/common/color';

export const Signin = (props: any) => {
  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAvoidingView enabled>
          <View style={{alignItems: 'center'}}>
            {/* LOGO */}
          </View>
            {/* Google */}
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              placeholder="abc@abc.com"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          {/*errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null*/}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            >
            <Text style={styles.buttonTextStyle}>SIGNIN</Text>
          </TouchableOpacity>
          <Text
            style={styles.registerTextStyle}
            onPress={() => props.navigation.navigate('RegisterScreen')}>
            Signin here
          </Text>
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
  buttonStyle: {
    backgroundColor: BasicColor,
    borderWidth: 1,
    borderColor: AccentColor,
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: AccentColor,
    paddingVertical: 10,
    fontSize: 16,
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
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});