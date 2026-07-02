import { ErrorMessage } from '@hookform/error-message';
import { View, Text, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';

interface InputControllerProps {
  title: string;
  control: any;
  errors: any;
  name: string;
  placeholder: string;
}
const InputController = ({ control, errors, name, placeholder, title }: InputControllerProps) => {
  return (
    <View>
      <Text className="mb-2 uppercase text-black ">{title}</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className={`rounded-xl border ${errors[name] ? 'border-red-500' : 'border-[#C6C6CD]'} h-16 px-3 `}
          />
        )}
        name={name}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <Text className="mt-1 text-sm text-red-500">{message}</Text>}
      />
    </View>
  );
};

export default InputController;
