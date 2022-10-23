import { StyleSheet, TextInput, View } from 'react-native';
import { BasicColor } from '../../styles/common/color';

export const StandardTextInput = (props: any) => {
  const {placeholder, keyboardType, secureTextEntry, onChangeText} = props;
  return (
    <View style={styles.SectionStyle}>
      <TextInput
        style={styles.inputStyle}
        placeholder={placeholder}
        placeholderTextColor="#8b9cb5"
        autoCapitalize="none"
        keyboardType={keyboardType}
        returnKeyType="next"
        underlineColorAndroid="#f000"
        secureTextEntry={secureTextEntry}
        blurOnSubmit={true}
        onChangeText={onChangeText}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});

