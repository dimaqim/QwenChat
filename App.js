import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { askQwen } from './qwenApi';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [display, setDisplay] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setDisplay(d => [...d, { id: Date.now(), role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const reply = await askQwen(newMessages);
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
      setDisplay(d => [...d, { id: Date.now()+1, role: 'assistant', text: reply }]);
    } catch (e) {
      setDisplay(d => [...d, { id: Date.now()+1, role: 'assistant', text: 'Ошибка: ' + e.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>Qwen Chat</Text>
      </View>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
        <FlatList
          ref={listRef}
          data={display}
          keyExtractor={i => i.id.toString()}
          style={s.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd()}
          renderItem={({item}) => (
            <View style={[s.bubble, item.role==='user' ? s.uBubble : s.bBubble]}>
              <Text style={[s.txt, item.role==='user' ? s.uTxt : s.bTxt]}>{item.text}</Text>
            </View>
          )}
        />
        {loading && <ActivityIndicator color="#7C6FFF" style={{margin:8}}/>}
        <View style={s.row}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Написать сообщение..."
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity style={s.btn} onPress={send}>
            <Text style={s.btnTxt}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap:   { flex:1, backgroundColor:'#0D0D1A' },
  header: { padding:18, borderBottomWidth:1, borderBottomColor:'#1E1E30' },
  title:  { color:'#fff', fontSize:20, fontWeight:'700', textAlign:'center' },
  list:   { flex:1, paddingHorizontal:14, paddingTop:10 },
  bubble: { maxWidth:'80%', marginVertical:5, padding:12, borderRadius:18 },
  uBubble:{ alignSelf:'flex-end', backgroundColor:'#7C6FFF' },
  bBubble:{ alignSelf:'flex-start', backgroundColor:'#1A1A2E' },
  txt:    { fontSize:15, lineHeight:22 },
  uTxt:   { color:'#fff' },
  bTxt:   { color:'#ddd' },
  row:    { flexDirection:'row', padding:10, borderTopWidth:1, borderTopColor:'#1E1E30', alignItems:'flex-end' },
  input:  { flex:1, backgroundColor:'#1A1A2E', color:'#fff', borderRadius:22, paddingHorizontal:16, paddingVertical:10, fontSize:15, maxHeight:100 },
  btn:    { marginLeft:10, backgroundColor:'#7C6FFF', width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center' },
  btnTxt: { color:'#fff', fontSize:22 },
});