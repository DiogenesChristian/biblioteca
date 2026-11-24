import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, RefreshControl, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { listarLivros, excluirLivro } from '../services/api';

const CORES = { 'quero ler': '#f59e0b', lendo: '#3b82f6', lido: '#10b981' };

export default function ListaScreen({ navigation }) {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async (texto = busca) => {
    try {
      setErro('');
      setLivros(await listarLivros(texto));
    } catch (e) {
      setErro('Não foi possível conectar à API. Verifique o endereço em src/services/api.js.');
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const confirmarExclusao = (livro) => {
    const excluir = async () => {
      try {
        await excluirLivro(livro._id);
        carregar();
      } catch (e) {
        Alert.alert('Erro', e.message);
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Excluir "${livro.titulo}"?`)) excluir();
    } else {
      Alert.alert('Excluir', `Excluir "${livro.titulo}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Form', { livro: item })}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.autor}>{item.autor}{item.genero ? ` • ${item.genero}` : ''}</Text>
        <View style={styles.linha}>
          <Text style={[styles.badge, { backgroundColor: CORES[item.status] }]}>{item.status}</Text>
          <Text style={styles.nota}>{'★'.repeat(item.nota)}{'☆'.repeat(5 - item.nota)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => confirmarExclusao(item)} hitSlop={10}>
        <Ionicons name="trash-outline" size={22} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.busca}
        placeholder="Buscar por título ou autor..."
        value={busca}
        onChangeText={(t) => { setBusca(t); carregar(t); }}
      />
      {carregando ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : (
        <FlatList
          data={livros}
          keyExtractor={(l) => l._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => carregar()} />}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum livro cadastrado.</Text>}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Form')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 12 },
  busca: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  titulo: { fontSize: 17, fontWeight: '700', color: '#111827' },
  autor: { color: '#6b7280', marginTop: 2 },
  linha: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  badge: { color: '#fff', fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden' },
  nota: { color: '#f59e0b', fontSize: 16 },
  vazio: { textAlign: 'center', marginTop: 40, color: '#6b7280' },
  erro: { textAlign: 'center', marginTop: 40, color: '#ef4444', paddingHorizontal: 20 },
  fab: { position: 'absolute', right: 20, bottom: 24, backgroundColor: '#4f46e5', width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', elevation: 5 },
});
