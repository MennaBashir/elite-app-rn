# 🧭 Expo Router — Navigation Reference (Expo SDK 55)

> مرجع كامل للتنقل (Navigation) في **expo-router** مع أمثلة حقيقية موجودة فعلاً في هذا المشروع.
> Docs: https://docs.expo.dev/versions/v55.0.0/sdk/router/

---

## 1. الفكرة الأساسية: File-based Routing

في expo-router، **هيكل الملفات هو الـ routes**. أي ملف داخل مجلد `src/app` يصبح شاشة (route) تلقائياً.

```
src/app/
├── _layout.tsx              ← Root layout (Stack رئيسي لكل التطبيق)
├── (tabs)/                  ← group (لا يظهر في الـ URL) + Tabs navigator
│   ├── _layout.tsx          ← Tabs layout
│   ├── index.tsx            ← /            (الشاشة الرئيسية للـ tab)
│   └── settings.tsx         ← /settings
├── (auth)/                  ← group للمصادقة
│   ├── login.tsx            ← /login
│   └── signup.tsx           ← /signup
└── products/
    ├── index.tsx            ← /products    (قائمة المنتجات)
    └── [id].tsx             ← /products/1  (dynamic route)
```

### قواعد التسمية

| النمط | المعنى | المسار الناتج |
|------|--------|----------------|
| `index.tsx` | الشاشة الافتراضية للمجلد | `/` أو `/folder` |
| `about.tsx` | route عادي | `/about` |
| `[id].tsx` | **dynamic route** (متغير) | `/products/1` |
| `[...rest].tsx` | catch-all route | `/anything/here` |
| `(group)/` | **route group** — تجميع بدون تأثير على الـ URL | `/` |
| `_layout.tsx` | layout مشترك (ليس route) | — |
| `+not-found.tsx` | شاشة 404 (ملف خاص) | — |

---

## 2. أنواع الـ Navigators

### 🥞 Stack
تنقل متسلسل (شاشة فوق شاشة) مع زر رجوع. مناسب للتدفقات المرتبة.

📄 **مثال حقيقي:** `src/app/_layout.tsx`
```tsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: "Login" }} />
      <Stack.Screen name="(auth)/signup" options={{ title: "Signup" }} />
      <Stack.Screen name="products/index" options={{ title: "Products" }} />
      <Stack.Screen name="products/[id]" options={{ title: "Product" }} />
    </Stack>
  );
}
```

### 📑 Tabs
تنقل متوازي عبر علامات تبويب أسفل الشاشة. مناسب للأقسام الرئيسية.

📄 **مثال حقيقي:** `src/app/(tabs)/_layout.tsx`
```tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

> **نوعان من الـ Tabs:**
> - **Native Tabs** (`expo-router/unstable-native-tabs`): مكونات native، أداء وشكل أقرب للنظام.
> - **JavaScript Tabs** (`expo-router` العادي، المستخدم هنا): مرونة كاملة في التصميم والتخصيص.

### 🗄️ Drawer
قائمة جانبية منزلقة. تتطلب تثبيت `@react-navigation/drawer` + `react-native-gesture-handler` ثم:
```tsx
import { Drawer } from "expo-router/drawer";
export default function Layout() {
  return <Drawer />;
}
```

---

## 3. طرق التنقل

### أ) Declarative — `<Link>`
تستخدمه داخل الـ JSX مثل الـ `<a>` في الويب.

📄 **مثال حقيقي:** `src/app/(tabs)/settings.tsx`
```tsx
import { Link } from "expo-router";

<Link href="/(auth)/login">Go to Login</Link>
<Link href="/products">Go to Products</Link>
```

### ب) Imperative — `useRouter()`
تستخدمه داخل الدوال (event handlers مثلاً).

📄 **مثال حقيقي:** `src/app/products/index.tsx`
```tsx
import { useRouter } from "expo-router";

const router = useRouter();

router.push({ pathname: "/products/[id]", params: { id: "1" } });
```

### جدول دوال الـ `router`

| الدالة | الوظيفة |
|--------|---------|
| `router.push(href)` | يفتح شاشة جديدة ويضيفها للـ stack (يمكن الرجوع لها) |
| `router.replace(href)` | يستبدل الشاشة الحالية (لا يمكن الرجوع) — مثالي بعد تسجيل الدخول |
| `router.navigate(href)` | ينتقل، ويعيد استخدام شاشة موجودة إن وُجدت |
| `router.back()` | يرجع للشاشة السابقة |
| `router.canGoBack()` | يتحقق هل يمكن الرجوع |
| `router.dismiss(count?)` | يغلق شاشات modal/stack |
| `router.dismissAll()` | يرجع لأول شاشة في الـ stack |
| `router.setParams(params)` | يحدّث الـ params للشاشة الحالية |

---

## 4. Dynamic Routes & Parameters (المثال الكامل)

الملف `[id].tsx` يعني أن `id` متغير يأتي من الـ URL.

📄 **مثال حقيقي:** `src/app/products/[id].tsx`
```tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>(); // قراءة الـ param
  const router = useRouter();

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: `Product #${id}` }} />
      <Text>Received id param: {id}</Text>

      <Pressable onPress={() => router.back()}>
        <Text>Go Back</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/(tabs)")}>
        <Text>Replace with Home</Text>
      </Pressable>
    </SafeAreaView>
  );
}
```

والشاشة التي تُرسل الـ param — `src/app/products/index.tsx`:
```tsx
// طريقة declarative
<Link href={`/products/${item.id}`}>{item.name}</Link>

// طريقة imperative
router.push({ pathname: "/products/[id]", params: { id: item.id } });
```

### `useLocalSearchParams` vs `useGlobalSearchParams`

| Hook | متى يتحدث | الاستخدام |
|------|-----------|-----------|
| `useLocalSearchParams` | فقط عندما تكون الشاشة **مركّزة (focused)** | الأفضل داخل Stack ✅ |
| `useGlobalSearchParams` | يتحدث دائماً حتى لو الشاشة غير مركّزة | analytics / عمليات خلفية |

---

## 5. Hooks مفيدة أخرى

| Hook | الوظيفة |
|------|---------|
| `usePathname()` | المسار الحالي بدون params مثل `/products/1` |
| `useSegments()` | أجزاء المسار كمصفوفة مثل `["products", "[id]"]` |
| `useNavigation()` | كائن React Navigation الخام (مثلاً `openDrawer()`) |
| `useFocusEffect()` | تنفيذ effect عند تركيز الشاشة فقط |

---

## 6. Layouts & Groups

- **`_layout.tsx`**: يلفّ كل الشاشات في نفس المجلد بـ navigator أو UI مشترك. لا يُعدّ route.
- **`(group)`**: مجلد بين قوسين لتنظيم الشاشات منطقياً (مثل `(auth)` و `(tabs)`) **دون** إضافة جزء للـ URL. مفيد لإعطاء كل مجموعة layout خاص بها.
- **Nested navigators**: يمكن وضع `Tabs` داخل `Stack` (كما في هذا المشروع: الـ root هو Stack ويحتوي على `(tabs)` الذي بداخله Tabs navigator).

---

## 7. `app/` مقابل `components/`

| المجلد | الدور |
|--------|------|
| `src/app/` | كل ملف = **route/شاشة**. تحدده expo-router تلقائياً. |
| `src/components/` | **ليست routes**. مكوّنات قابلة لإعادة الاستخدام تُستورد داخل الشاشات. |

نصائح للمكوّنات:
- نظّمها في مجلدات فرعية حسب الوظيفة أو الشاشة.
- افصل بين shared components (تُستخدم في أكثر من شاشة) و screen-specific components.
- أعطها أسماء واضحة تعبّر عن وظيفتها.

---

## 8. جرّب المثال 🚀

```bash
bun start          # أو: npm start
```

ثم: افتح تبويب **Settings** → اضغط **"Go to Products"** → اختر منتجاً (عبر `Link` أو الزر `push`)
→ ستظهر شاشة التفاصيل وتقرأ الـ `id` من الـ URL → جرّب **Go Back** و **Replace with Home**.

هذا التدفق يغطّي عملياً: Stack + Tabs + Groups + Link + useRouter + Dynamic route + useLocalSearchParams. ✅
