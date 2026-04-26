import { StyleSheet, Text, View } from 'react-native';

export default function SemuaDokter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman Semua Dokter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});