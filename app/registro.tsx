import { useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register, AuthError } from '../src/services/authService';

export default function RegistroScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister() {
    if (submitting) return;

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Completá todos los campos.');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register(username.trim(), password);
      router.replace('/login');
    } catch (caught) {
      if (caught instanceof AuthError || caught instanceof Error) {
        setError(caught.message);
      } else {
        setError('No pudimos crear la cuenta. Intentá nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }






  return (
    <SafeAreaView style={styles.screen}>
      {/* Esferas suaves decorativas */}
      <View style={styles.sphereTop} />
      <View style={styles.sphereBottom} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Registrate para empezar a usar el gestor.</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                setError('');
              }}
              placeholder="Elegí un usuario"
              placeholderTextColor="#6B879E"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
              style={styles.input}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError('');
              }}
              placeholder="Creá una contraseña"
              placeholderTextColor="#6B879E"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
              style={styles.input}
            />

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setError('');
              }}
              placeholder="Repetí la contraseña"
              placeholderTextColor="#6B879E"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
              style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              disabled={submitting}
              onPress={() => void handleRegister()}
              style={[styles.button, submitting && styles.buttonDisabled]}
            >
              {submitting && <ActivityIndicator color="#FFFFFF" size="small" />}
              <Text style={styles.buttonText}>
                {submitting ? 'Creando cuenta...' : 'Registrarse'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            disabled={submitting}
            onPress={() => router.back()}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciar sesión</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}









const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#C9E9F8',
    overflow: 'hidden',
  },
  flex: { flex: 1 },
  sphereTop: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#7AC3E8',
    opacity: 0.45,
    top: -50,
    right: -40,
  },
  sphereBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#8ED5E8',
    opacity: 0.5,
    bottom: -70,
    left: -60,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#13324A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#3B617D',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 22,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E435E',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#13324A',
    marginBottom: 14,
  },
  error: {
    color: '#9E2A3B',
    backgroundColor: 'rgba(255, 235, 238, 0.9)',
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2596C9',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  linkButton: { marginTop: 18, alignItems: 'center', padding: 8 },
  linkText: {
    color: '#186A91',
    fontSize: 14,
    fontWeight: '700',
  },
});