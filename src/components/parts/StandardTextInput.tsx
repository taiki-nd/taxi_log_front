import { StyleSheet, View } from 'react-native';
import { BackColor, BasicColor } from '../../styles/common/color';
import { TextInput } from 'react-native-paper';

export const StandardTextInput = (props: any) => {
  const {placeholder, keyboardType, secureTextEntry, label, onChangeText} = props;
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
        label={label}
        mode="outlined"
        outlineColor={BasicColor}
        activeOutlineColor={BasicColor}
        textColor={BasicColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  inputStyle: {
    flex: 1,
    backgroundColor: BackColor,
  },
});

