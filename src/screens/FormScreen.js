import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { criarLivro, editarLivro } from '../services/api';

const STATUS = ['quero ler', 'lendo', 'lido'];

export default function FormScreen({ route, navigation }) {
  const livro = route.params?.livro;
  const editando = !!livro;

  const [titulo, setTitulo] = useState(livro?.titulo || '');
  const [autor, setAutor] = useState(livro?.autor || '');
  const [genero, setGenero] = useState(livro?.genero || '');
  const [status, setStatus] = useState(livro?.status || 'quero ler');
  const [nota, setNota] = useState(livro?.nota || 0);
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!titulo.trim() || !autor.trim()) {
      return Alert.alert('Atenção', 'Preencha título e autor.');
    }
    const dados = { titulo, autor, genero, status, nota };
    try {
      setSalvando(true);
      if (editando) await editarLivro(livro._id, dados);
      else await criarLivro(dados);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Título *</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex.: Dom Casmurro" />

      <Text style={styles.label}>Autor *</Text>
      <TextInput style={styles.input} value={autor} onChangeText={setAutor} placeholder="Ex.: Machado de Assis" />

      <Text style={styles.label}>Gênero</Text>
      <TextInput style={styles.input} value={genero} onChangeText={setGenero} placeholder="Ex.: Romance" />

      <Text style={styles.label}>Status</Text>
      <View style={styles.opcoes}>
        {STATUS.map((s) => (
          <TouchableOpacity key={s} style={[styles.opcao, status === s && styles.opcaoAtiva]} onPress={() => setStatus(s)}>
            <Text style={[styles.opcaoTxt, status === s && { color: '#fff' }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Nota</Text>
      <View style={styles.opcoes}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setNota(n === nota ? 0 : n)}>
            <Text style={styles.estrela}>{n <= nota ? '★' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.botao, salvando && { opacity: 0.6 }]} onPress={salvar} disabled={salvando}>
        <Text style={styles.botaoTxt}>{editando ? 'Salvar alterações' : 'Cadastrar livro'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  label: { fontWeight: '600', marginTop: 14, marginBottom: 6, color: '#374151' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  opcoes: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  opcao: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e5e7eb' },
  opcaoAtiva: { backgroundColor: '#4f46e5' },
  opcaoTxt: { color: '#374151', fontWeight: '600' },
  estrela: { fontSize: 34, color: '#f59e0b' },
  botao: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 28 },
  botaoTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
