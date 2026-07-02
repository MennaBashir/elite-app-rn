## ملاحظات حلوة من الكورس

## 1. Controlled vs Uncontrolled Components

- Controlled: المكوّن يتحكّم في قيمة الـ input من خلال state.
- Uncontrolled: المكوّن لا يتحكّم في قيمة الـ input، بل يستخدم الـ ref للوصول للقيمة مباشرة من DOM.

## 2. React Hook Form , Resolvers, Zod

- React Hook Form: مكتبة لإدارة الـ forms في React Native. deal with input
- Resolvers: طريقة لربط React Hook Form مع مكتبات التحقق من الصحة مثل Zod. can link with yup or joi
- Zod: مكتبة للتحقق من صحة البيانات (validation) باستخدام TypeScript. deal with schema validation
  example:

```ts
import { z } from 'zod';
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
const {control, handleSubmit, formState: { errors }} = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
});
const handleSubmit = (data: LoginFormValues) => {
  // data is guaranteed to match the loginSchema
  console.log(data.email, data.password);
};
<Controller
  control={control}
  name="email"
  render={({ field:{value, onChange} }) => (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Email"
    />
  )}
/>
<ErrorMessage errors={errors} name="email" render={({ message }) => <Text>{message}</Text>} />
```

## 3. 
- لو بعمل loop على عناصر والعناصر دى فيها حذف او اضافه مينفعش اعتمد على ال index ك key identifier للعنصر ؟ ليه عشان العناصر ال جوه ال array كده كل مره بيعاد رندرتها لو حصل اى change on items , adding or delete each item change key identifier then react loss part of performance .