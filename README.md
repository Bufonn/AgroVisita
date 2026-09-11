# 🌱 AgroVisita

Registro de visitas técnicas agrícolas — auditoria de propriedades rurais e terminais logísticos de exportação de safra, **dentro e fora do campo**.

O AgroVisita é um app mobile em **React Native + Expo (SDK 57)** que consolida quatro recursos nativos do dispositivo (câmera/galeria, contatos, GPS, sensores) em um fluxo único de auditoria:

**georreferenciamento do lote (GPS) → evidência fotográfica → vínculo com produtor/representante → assinatura protegida por estabilidade física.**

> Identidade visual de ferramenta de campo séria: um pino de localização estilizado como folha, paleta terra/broto/terracota e dados técnicos em fonte monoespaçada.

---

## ✨ Funcionalidades

### Fluxo de auditoria (`RegistroVisitaScreen`)
1. **Georreferenciamento do lote** — captura de coordenadas com precisão reportada (RF02).
2. **Evidência fotográfica** — câmera ou galeria, com preview.
3. **Vínculo do produtor/representante** — seleção de contato da agenda.
4. **Observações** — anotações livres da visita.
5. **Finalizar e assinar** — desabilitado enquanto GPS + foto + produtor não estiverem preenchidos.

### Módulos de hardware (acessíveis pelo menu)
| Módulo | Recurso | Descrição |
|---|---|---|
| Câmera e Galeria | `expo-image-picker` | Capturar foto ou escolher da galeria como evidência |
| GPS | `expo-location` | Coordenadas do lote com indicador de precisão |
| Contatos | `expo-contacts` | Vínculo de produtor/representante, otimizado para agendas grandes |
| Sensores | `expo-sensors` | Leituras ao vivo de acelerômetro e giroscópio |

### Níveis de desafio implementados
- **🟢 Júnior — Permissões negadas avançado:** componente `PermissionGate` diferencia 3 estados — concedida, negada com `canAskAgain`, e **negada permanentemente**, caso em que exibe instrução própria com botão que chama `Linking.openSettings()` (nada de alerta genérico).
- **🟠 Pleno — Trava por acelerômetro:** ao assinar, o app calcula a aceleração vetorial agregada `√(x² + y² + z²)`. Se ultrapassar **2,0g** (o eixo Z já inclui gravidade de ~1g em repouso), o envio é bloqueado com o alerta **"Instabilidade Física Detectada"**, sem perder os dados preenchidos.
- **🔴 Sênior — Contatos em massa:** suporta agendas com **5.000+ registros** via paginação nativa (`Contact.getAllDetails` com `limit`/`offset` do SDK 57), busca com debounce de 300ms pelo filtro `name` nativo e `FlatList` otimizada (virtualização, `renderItem` memoizado, `keyExtractor` estável).

### Requisitos funcionais/não funcionais atendidos
- **RF01 — Histórico local e persistência:** auditorias concluídas salvas offline (AsyncStorage, schema versionado `v1`) e consultáveis na tela **Histórico**. Fotos copiadas para `documentDirectory/auditorias/` via `expo-file-system`.
- **RF02 — Feedback visual de precisão de GPS:** chip de **cor + texto** (nunca só cor, para acessibilidade): verde < 10 m · amarelo 10–30 m · vermelho > 30 m.
- **RNF01 — Degradação graciosa:** todo módulo de hardware tem 3 estados visuais (carregando, sucesso, indisponível/erro), `try/catch` em toda chamada assíncrona e mensagens específicas ao recurso ("GPS desligado ou sinal indisponível no momento").
- **RNF02 — UI/UX responsiva:** `useWindowDimensions` + flexbox; grid de cards adaptável (2 colunas no celular, 3 em tablet); sem larguras fixas.

---

## 🧰 Tecnologias

### Runtime e linguagens
- **React Native** `^0.86.3`
- **React** `19.2.3`
- **TypeScript** `~6.0.3` (modo `strict`)
- **Expo SDK** `~57.0.14`

### Dependências (todas do ecossistema Expo/React Native)
| Pacote | Versão | Finalidade |
|---|---|---|
| `expo` | ~57.0.14 | SDK e tooling do Expo |
| `expo-status-bar` | ~57.0.1 | Status bar integrada |
| `expo-font` | ~57.0.4 | Carregamento das fontes da marca |
| `expo-image-picker` | ~57.0.17 | Câmera e galeria |
| `expo-location` | ~57.0.17 | Geolocalização |
| `expo-contacts` | ~57.0.5 | Contatos (API de classes do SDK 57) |
| `expo-sensors` | ~57.0.3 | Acelerômetro e giroscópio |
| `expo-file-system` | ~57.0.7 | Persistência das fotos em documentos |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistência local (RF01) |
| `@react-navigation/native` | ^7.3.18 | Navegação |
| `@react-navigation/native-stack` | ^7.18.10 | Stack nativa tipada |
| `react-native-safe-area-context` | ~5.7.0 | Áreas seguras |
| `react-native-screens` | ~4.26.0 | Telas nativas da navegação |
| `react-native-svg` | 15.15.4 | Símbolo pino-folha da marca |
| `@expo/vector-icons` | ^15.0.2 | Ícones outline (Ionicons) |
| `@expo-google-fonts/poppins` | ^0.4.1 | Títulos (Poppins) |
| `@expo-google-fonts/inter` | ^0.4.2 | Corpo de texto (Inter) |
| `@expo-google-fonts/jetbrains-mono` | ^0.4.1 | Dados técnicos (JetBrains Mono) |
| `@types/react` | ~19.2.4 | Tipos do React |

### Arquitetura e padrões
- **Navegação:** `@react-navigation/native-stack` com lista de parâmetros tipada (`RootStackParamList`) e header na cor da marca.
- **Tema:** tokens de design em `src/theme/` (cores, tipografia, espaçamento).
- **Hooks:** `useLocation`, `useImageCapture`, `useContactsPaged`, `useAccelerometerGuard`.
- **Serviços:** `storage.ts` (RF01), `contactsService.ts`, `permissions.ts`.
- **Utils puras e testáveis:** `gpsAccuracy.ts` (RF02), `sensorMath.ts`, `formatters.ts`, `validators.ts`.

---

## 📋 Pré-requisitos

- **Node.js** 18 ou superior (testado com Node 22)
- **npm** (ou yarn/pnpm/bun)
- **Expo Go** instalado no dispositivo físico, **ou**
- Android Studio (emulador) / Xcode (simulador iOS)

> Recursos de hardware (câmera, GPS, contatos, sensores) funcionam melhor em **dispositivo físico**. Os módulos degradam com mensagens amigáveis quando o recurso está indisponível (RNF01).

---

## 🚀 Como rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/Bufonn/AgroVisita.git
cd AgroVisita
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o Metro Bundler

```bash
npx expo start
```

### 4. Abrir no dispositivo/emulador

- **Dispositivo físico:** escaneie o QR Code com o app **Expo Go** (mesma rede Wi-Fi).
- **Emulador Android:** pressione `a`.
- **Simulador iOS:** pressione `i`.
- **Navegador:** pressione `w` (limitações específicas das APIs nativas se aplicam).

### Scripts disponíveis

```bash
npm start        # inicia o Expo
npm run android  # inicia e abre no emulador Android
npm run ios      # inicia e abre no simulador iOS
npm run web      # inicia no navegador
```

---

## 🏗️ Estrutura do projeto

```
agrovisita/
├── App.tsx                          # entrada (fontes, providers, navegação)
├── index.js                         # registro raiz do Expo
├── app.json                         # configuração e plugins de permissões
├── tsconfig.json                    # TypeScript estendendo expo/tsconfig.base (strict)
├── src/
│   ├── components/                  # UI reutilizável
│   │   ├── AppButton.tsx            #   botão com variantes da marca
│   │   ├── AppHeader.tsx            #   header verdeTerra
│   │   ├── BrandMark.tsx            #   símbolo pino-folha (SVG)
│   │   ├── CampoTexto.tsx           #   campo com label
│   │   ├── ContatoItem.tsx          #   linha de contato memoizada (Sênior)
│   │   ├── EstadosUI.tsx            #   carregando/erro/indisponível/vazio
│   │   ├── GpsAccuracyChip.tsx      #   chip de precisão (RF02)
│   │   ├── PermissionGate.tsx       #   gate de permissões (Júnior)
│   │   ├── SeletorContatoModal.tsx  #   busca + lista paginada (Sênior)
│   │   ├── SensorReadout.tsx        #   leitura de sensor em mono
│   │   └── StatusCard.tsx           #   card com borda-esquerda de status
│   ├── screens/
│   │   ├── MenuScreen.tsx           #   menu em cards
│   │   ├── ModuloCameraScreen.tsx
│   │   ├── ModuloContatosScreen.tsx
│   │   ├── ModuloGpsScreen.tsx
│   │   ├── ModuloSensoresScreen.tsx
│   │   ├── RegistroVisitaScreen.tsx #   fluxo principal de auditoria
│   │   └── HistoricoVisitasScreen.tsx # RF01 offline
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── types.ts                 #   RootStackParamList
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   ├── useImageCapture.ts
│   │   ├── useContactsPaged.ts
│   │   └── useAccelerometerGuard.ts
│   ├── services/
│   │   ├── contactsService.ts       #   paginação nativa (SDK 57)
│   │   ├── permissions.ts
│   │   └── storage.ts               #    RF01 + persistência de fotos
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── gpsAccuracy.ts           #   classificação da precisão (RF02)
│   │   ├── sensorMath.ts            #   magnitude 3D / limiar 2.0g (Pleno)
│   │   ├── formatters.ts            #   coordenadas, datas, protocolo
│   │   └── validators.ts            #   validação de dados da auditoria
│   └── types/
│       └── visit.ts                 #   modelos (AuditoriaVisita, GpsCaptura...)
├── .env.example                     # variáveis de ambiente (sem segredos)
└── README.md
```

---

## 🔐 Segurança e boas práticas

- Permissões pedidas **no momento do uso** (just-in-time), nunca todas de uma vez na abertura.
- Dados de auditoria (localização precisa, fotos) só são persistidos após o usuário **concluir** a auditoria — rascunho é descartável.
- Nenhum dado sensível é logado em produção (sem `console.log` de coordenadas/fotos/contatos).
- Valores de sensores são sanitizados antes de renderizar (evita `NaN`/`undefined` quebrando a UI).
- Segredos/produtivos ficam em `.env` (no `.gitignore`); o `.env.example` não contém chaves.
- Nenhuma consulta concatenada de string do usuário em SQL (o filtro de contatos usa a busca `name` nativa).

---

## ✅ Verificações de qualidade

```bash
npx tsc --noEmit      # typecheck TypeScript (strict)
npx expo-doctor       # 21/21 checks — dependências e configuração
```

---

## 🧪 Testes manuais sugeridos

- **Júnior:** negue a permissão da câmera por duas vezes (sistema bloqueia) → a tela deve oferecer "Abrir Configurações".
- **Pleno:** inicie a assinatura e mova o celular rapidamente → alerta "Instabilidade Física Detectada"; dados permanecem preenchidos.
- **Sênior:** agenda com 5.000+ contatos → scroll infinito sem travar; busque por nome e veja o filtro nativo; resete a busca → volta para a 1ª página.
- **RNF01:** desligue o GPS → mensagem amigável; use emulator sem acelerômetro → assinatura prossegue sem bloqueio.
- **RNF02:** rode em um tablet (3 colunas no menu) e na horizontal (landscape).

---

## 🗂️ Licença

Este projeto está sob a **MIT License** — consulte o arquivo [`LICENSE`](./LICENSE).