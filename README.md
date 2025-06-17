# 🦷 ClinicaOdonto - Mobile / Web App

Um aplicativo multiplataforma moderno para gerenciar sua clínica odontológica, construído com React Native. Ele se conecta ao backend Spring Boot para gerenciar pacientes, médicos, consultas e especialidades, além de oferecer funcionalidades de autenticação e relatórios.

## ✨ Visão Geral

Este projeto oferece uma interface de usuário intuitiva e responsiva para a gestão da BioVitta Clinics. Desenvolvido com React Native, ele visa proporcionar uma experiência consistente tanto em dispositivos móveis (iOS e Android) quanto na web.

## 🚀 Tecnologias Utilizadas

* **React Native**: Framework para desenvolvimento de aplicações móveis multiplataforma.
* **Expo**: Plataforma para desenvolvimento universal de aplicações React.
* **React Navigation**: Gerenciamento de navegação no aplicativo.
* **React Native Paper**: Biblioteca de componentes UI com Material Design para uma interface limpa e moderna.
* **Axios**: Cliente HTTP para comunicação com a API RESTful do backend.
* **Formik & Yup**: Para construção e validação de formulários.
* **Moment.js**: Manipulação e formatação de datas e horas.
* **@react-native-async-storage/async-storage**: Armazenamento local de dados (como token de autenticação).
* **@react-native-picker/picker**: Componente de seletor para listas de opções.
* **@react-native-community/datetimepicker**: Seletor de data e hora nativo para mobile.
* **react-native-webview**: Para exibição de conteúdo web (como PDFs) dentro do aplicativo.
* **react-native-blob-util**: Para manipulação e download de arquivos (ex: PDFs).
* **React Native for Web**: Para compatibilidade e execução do aplicativo em navegadores web.

## 🛠️ Configuração e Execução

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* **Node.js** (versão LTS recomendada)
* **npm** ou **Yarn**
* **Expo CLI** (recomendado usar a versão local: `npm install expo`)

### Instalação de Dependências

Navegue até a pasta raiz do projeto frontend (`clinica-odonto-mobile/`) no terminal e execute os seguintes comandos para instalar todas as dependências:

```bash
# Instalações via Expo CLI (preferencial para compatibilidade)
npx expo install react-native-screens react-native-safe-area-context react-native-paper react-native-vector-icons formik yup moment @react-native-community/datetimepicker react-native-webview

# Instalações via npm/yarn (para pacotes sem versão Expo dedicada ou para uso direto)
npm install @react-navigation/native @react-navigation/native-stack @react-native-async-storage/async-storage @react-native-picker/picker react-native-blob-util
# OU
yarn add @react-navigation/native @react-navigation/native-stack @react-native-async-storage/async-storage @react-native-picker/picker react-native-blob-util

````

## Configuração do Backend (API Base URL)

```bash
// utils/constants.js
export const API_BASE_URL = 'http://localhost:8080/biovitta'; // <-- ATUALIZE AQUI
// Se estiver rodando em um dispositivo físico, substitua 'localhost' pelo IP da sua máquina (ex: 'http://192.168.1.XX:8080/biovitta')
````

## Rodando o Aplicativo

1. Inicie o Servidor de Desenvolvimento: Navegue até a pasta raiz do projeto frontend e execute:
```bash
npx expo start

````

2. Abra o Aplicativo:

- Emulador/Dispositivo Físico: Escaneie o código QR exibido no terminal com o aplicativo Expo Go (disponível na App Store/Google Play).
- Navegador Web: Pressione **w** no terminal para abrir no seu navegador padrão.
- Emulador Android: Pressione **a** no terminal.
- Simulador iOS (macOS apenas): Pressione **i** no terminal.

## 📱 Funcionalidades Principais
- Autenticação Completa: Login e registro de pacientes.
- Navegação Inteligente: Transições fluidas entre telas de autenticação e de aplicativo principal com base no estado do usuário.
- Dashboard Interativo: Acesso rápido a módulos com base na função do usuário (ADMIN, MÉDICO, PACIENTE).
- Gerenciamento de Pacientes: CRUD completo de pacientes.
- Gerenciamento de Médicos: CRUD completo de médicos e visualização de especialidades.
- Gerenciamento de Consultas: Agendamento, visualização, edição e exclusão de consultas.
- Gerenciamento de Especialidades: CRUD de especialidades (acesso ADMIN).
- Perfil do Usuário: Visualização e edição de informações de perfil.
- Relatórios em PDF: Geração, visualização e download de relatórios de consultas por período.
- Validação de Formulários: Com Formik e Yup para uma entrada de dados robusta.
- UI Moderna: Utiliza componentes do Material Design com React Native Paper.
