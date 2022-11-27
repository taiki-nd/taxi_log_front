import { View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker";
import { AccentColor, BackColor, BasicColor } from "../../styles/common/color";

export const Dropdown = (props: any) => {
  // props
  const { placeholder, width, open, setOpen, value, setValue, items, setItems } = props

  return (
    <DropDownPicker
      style={{
        backgroundColor: BasicColor,
        borderColor: AccentColor,
      }}
      containerStyle={{
        width: width,
        marginRight: '5%',
        zIndex: 100
      }}
      placeholder = {placeholder} 
      placeholderStyle = {{
          fontWeight: 'bold',
          textAlign: 'center',
          color: AccentColor
      }}
      dropDownContainerStyle={{
        backgroundColor: BasicColor
      }}
      textStyle ={{
        color: AccentColor,
        fontSize: 14,
        textAlign: 'left'
      }}
      autoScroll={true}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
  );
}