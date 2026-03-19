import { Stack, StackProps } from "expo-router";

export default function RootLayout(props: StackProps) {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      {...props}
    />
  );
}

