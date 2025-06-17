// screens/Reports/ReportsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper'; // Adicionado ActivityIndicator para o botão de carregar
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'react-native-blob-util';
import { API_BASE_URL } from '../../utils/constants'; // Assumindo que este é o seu URL base
import { getToken } from '../../utils/authStorage';
import Header from '../../components/common/Header'; // Reutilizando o componente Header

const ReportsScreen = () => {
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [currentPickerFor, setCurrentPickerFor] = useState(''); // 'dataInicio' or 'dataFim'
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para o loading da geração do PDF

  const handleDateChange = (event, selectedValue) => {
    setShowPicker(false);
    if (selectedValue) {
      // Se for selecionar apenas a data, mantém a hora anterior (ou define um padrão)
      // Se for selecionar a hora, mantém a data anterior (ou a data atual se não houver data)
      let currentDateTime = null;
      if (currentPickerFor === 'dataInicio') {
          currentDateTime = dataInicio ? moment(dataInicio) : moment();
      } else { // currentPickerFor === 'dataFim'
          currentDateTime = dataFim ? moment(dataFim) : moment();
      }

      if (pickerMode === 'date') {
        currentDateTime.year(moment(selectedValue).year());
        currentDateTime.month(moment(selectedValue).month());
        currentDateTime.date(moment(selectedValue).date());
      } else if (pickerMode === 'time') {
        currentDateTime.hour(moment(selectedValue).hour());
        currentDateTime.minute(moment(selectedValue).minute());
      }

      if (currentPickerFor === 'dataInicio') {
        setDataInicio(currentDateTime.toDate());
      } else {
        setDataFim(currentDateTime.toDate());
      }
    }
  };

  const showDatePickerModal = (forField) => {
    setCurrentPickerFor(forField);
    setPickerMode('date');
    setShowPicker(true);
  };

  const showTimePickerModal = (forField) => {
    setCurrentPickerFor(forField);
    setPickerMode('time');
    setShowPicker(true);
  };

  const generatePdfReport = async () => {
    if (!dataInicio || !dataFim) {
      Alert.alert('Erro', 'Por favor, selecione as datas de início e fim para o relatório.');
      return;
    }

    setLoading(true);
    setPdfUri(null); // Limpa o PDF anterior antes de gerar um novo
    try {
      // Formata as datas para corresponder à expectativa do backend (ex: "2025-06-10T14:30:00")
      // O backend parece esperar formato ISO 8601 completo
      const formattedDataInicio = moment(dataInicio).format("YYYY-MM-DDTHH:mm:ss");
      const formattedDataFim = moment(dataFim).format("YYYY-MM-DDTHH:mm:ss");

      const token = await getToken();
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      // Requisição para buscar o PDF
      const response = await RNFetchBlob.config({
        fileCache: true, // Armazena o arquivo em cache temporariamente
        appendExt: 'pdf', // Define a extensão do arquivo
      }).fetch('GET', `${API_BASE_URL}/api/relatorio/consultas-por-periodo-pdf?dataInicio=${formattedDataInicio}&dataFim=${formattedDataFim}`, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/pdf',
      });

      if (response.respInfo.status === 200) {
        const path = response.path(); // Caminho do arquivo em cache

        // Para exibir no WebView, usamos o caminho do arquivo no Android e base64 no iOS/Web
        // Note: react-native-webview pode ter comportamento diferente em iOS vs Android para file://
        if (Platform.OS === 'android') {
            setPdfUri(`file://${path}`);
        } else {
            // Em iOS e Web, ou se file:// não funcionar no Android, é mais robusto usar base64
            const base64Data = await response.base64();
            setPdfUri(`data:application/pdf;base64,${base64Data}`);
        }
        Alert.alert('Sucesso', 'Relatório PDF gerado e pronto para visualização!');
      } else {
        // Se o backend retornar um erro (não 200 OK)
        const errorText = await response.text(); // Tenta ler a resposta como texto
        console.error('Erro no servidor ao gerar PDF:', response.respInfo.status, errorText);
        Alert.alert('Erro', `Erro ao gerar relatório PDF: ${response.respInfo.status} - ${errorText || 'Resposta vazia do servidor'}`);
      }
    } catch (error) {
      // Erros de rede ou outros erros antes de obter uma resposta do servidor
      console.error('Erro ao gerar PDF:', error.message);
      Alert.alert('Erro', `Não foi possível gerar o relatório PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!pdfUri || loading) {
      Alert.alert('Aviso', 'Nenhum relatório PDF disponível para download ou carregando.');
      return;
    }

    // Se o pdfUri for um URI de dados (base64), precisamos escrevê-lo para um arquivo primeiro
    let localFilePath = pdfUri;
    if (pdfUri.startsWith('data:')) {
        const base64Data = pdfUri.split(';base64,').pop();
        const dateString = moment().format('YYYYMMDD_HHmmss');
        const fileName = `relatorio_consultas_${dateString}.pdf`;
        const dirs = RNFetchBlob.fs.dirs;
        const tempPath = `${dirs.CacheDir}/${fileName}`; // Salva no cache primeiro

        try {
            await RNFetchBlob.fs.writeFile(tempPath, base64Data, 'base64');
            localFilePath = `file://${tempPath}`;
        } catch (e) {
            console.error('Erro ao escrever arquivo base64:', e);
            Alert.alert('Erro', 'Não foi possível preparar o arquivo para download.');
            return;
        }
    }

    // Realiza o download para a pasta de Downloads do dispositivo
    const dateString = moment().format('YYYYMMDD_HHmmss');
    const fileName = `relatorio_consultas_${dateString}.pdf`;

    const dirs = RNFetchBlob.fs.dirs;
    const downloadDir = Platform.select({
      ios: dirs.DocumentDir, // No iOS, geralmente DocumentDir é usado para arquivos do app
      android: dirs.DownloadDir, // No Android, DownloadDir é a pasta padrão de downloads
    });
    const destinationPath = `${downloadDir}/${fileName}`;

    try {
        await RNFetchBlob.fs.cp(localFilePath.replace('file://', ''), destinationPath); // Copia do cache/temp para o destino final
        Alert.alert(
            'Download Concluído',
            `O relatório foi salvo em: ${destinationPath}`
        );
    } catch (error) {
        console.error('Erro no download:', error);
        Alert.alert('Erro no Download', `Não foi possível salvar o arquivo: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Relatórios de Consultas" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Gerar Relatórios de Consultas</Text>

        <View style={styles.inputGroup}>
          <TextInput
            label="Data Início (DD/MM/YYYY HH:mm)"
            value={dataInicio ? moment(dataInicio).format('DD/MM/YYYY HH:mm') : ''}
            onFocus={() => showDatePickerModal('dataInicio')}
            showSoftInputOnFocus={false}
            style={styles.input}
            right={<TextInput.Icon icon="calendar-month-outline" onPress={() => showDatePickerModal('dataInicio')} />}
          />
          <Button icon="clock" onPress={() => showTimePickerModal('dataInicio')} style={styles.timeButton}>Hora</Button>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            label="Data Fim (DD/MM/YYYY HH:mm)"
            value={dataFim ? moment(dataFim).format('DD/MM/YYYY HH:mm') : ''}
            onFocus={() => showDatePickerModal('dataFim')}
            showSoftInputOnFocus={false}
            style={styles.input}
            right={<TextInput.Icon icon="calendar-month-outline" onPress={() => showDatePickerModal('dataFim')} />}
          />
          <Button icon="clock" onPress={() => showTimePickerModal('dataFim')} style={styles.timeButton}>Hora</Button>
        </View>

        {showPicker && (
          <DateTimePicker
            value={new Date()} // Sempre inicia com a data/hora atual no picker
            mode={pickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <Button
          mode="contained"
          onPress={generatePdfReport}
          loading={loading}
          disabled={loading}
          style={styles.button}
          icon={loading ? null : "file-pdf-box"}
        >
          {loading ? "Gerando..." : "Gerar Relatório PDF"}
        </Button>

        {pdfUri && !loading && (
          <>
            <Button
              mode="outlined"
              onPress={downloadPdf}
              style={styles.downloadButton}
              icon="download"
            >
              Baixar PDF
            </Button>
            <Text style={styles.viewerTitle}>Pré-visualização do PDF:</Text>
            <WebView
              source={{ uri: pdfUri }}
              style={styles.pdfViewer}
              originWhitelist={['*']}
              allowsLinkPreview={true}
              allowFileAccess={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowUniversalAccessFromFileURLs={true}
              androidHardwareAccelerationDisabled={true}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  timeButton: {
    paddingVertical: 8,
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
  },
  downloadButton: {
    marginTop: 10,
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  viewerTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pdfViewer: {
    flex: 1,
    width: '100%',
    minHeight: 500, // Altura mínima para o visualizador de PDF
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default ReportsScreen;