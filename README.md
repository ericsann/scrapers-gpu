# Scraper de Placas de Vídeo NVIDIA - Kabum

Este projeto é um scraper automatizado que extrai informações sobre placas de vídeo NVIDIA do site da Kabum, utilizando Puppeteer para web scraping e OpenAI para estruturação dos dados.

## 🚀 Funcionalidades

- **Web Scraping Automatizado**: Utiliza Puppeteer para navegar e extrair dados do site da Kabum
- **Processamento Inteligente**: Usa OpenAI GPT-4 com Structured Outputs para extrair e estruturar dados
- **Headers Reais**: Implementa headers e cookies reais para evitar bloqueios
- **Interceptação de Requests**: Otimiza performance bloqueando recursos desnecessários
- **Paginação Automática**: Processa múltiplas páginas automaticamente
- **Saída Estruturada**: Gera arquivo JSON com dados organizados

## 📊 Dados Extraídos

Para cada placa de vídeo, o scraper extrai:

- **Modelo**: Nome completo da placa de vídeo
- **Preço**: Valor no formato brasileiro (R$ X.XXX,XX)
- **RAM**: Quantidade de memória (ex: 8GB, 16GB)
- **GDDR**: Tipo de memória (ex: GDDR6, GDDR6X, GDDR7)

## 🛠️ Tecnologias Utilizadas

- **Bun**: Runtime JavaScript/TypeScript
- **TypeScript**: Linguagem principal
- **Puppeteer**: Web scraping e automação de browser
- **OpenAI GPT-4**: Processamento e estruturação de dados
- **Structured Outputs**: Garantia de formato JSON consistente

## 📁 Estrutura do Projeto

```
├── src/
│   ├── types/
│   │   └── PlacaVideo.ts          # Interfaces TypeScript
│   ├── services/
│   │   └── openaiService.ts       # Integração com OpenAI
│   ├── scrapers/
│   │   └── kabumScraper.ts        # Lógica principal do scraper
│   └── utils/
│       └── headers.ts             # Headers e cookies da Kabum
├── doc/                           # Documentação do projeto
├── index.ts                       # Arquivo principal
├── resultado_placas.json          # Arquivo de saída gerado
└── README.md
```

## ⚙️ Configuração

### Pré-requisitos

- [Bun](https://bun.sh/) instalado
- Chave da API OpenAI

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ericsann/scrapers-gpu.git
cd scrapers-gpu
```

2. Instale as dependências:
```bash
bun install
```

3. Configure a chave da OpenAI no arquivo `.env`:
```env
OPENAI_API_KEY=sua_chave_aqui
```

## 🚀 Uso

### Executar o Scraper

```bash
bun run dev
```

### Exemplo de Saída

O scraper gera um arquivo `resultado_placas.json` com a seguinte estrutura:

```json
{
  "timestamp": "2025-08-08T22:19:06.295Z",
  "total_placas": 56,
  "placas": [
    {
      "modelo": "Placa de Vídeo Gigabyte RTX 5070 WINDFORCE OC SFF 12G NVIDIA GeForce",
      "preco": "R$ 5.499,99",
      "ram": "12GB",
      "gddr": "GDDR7"
    },
    {
      "modelo": "Placa de Vídeo Gigabyte RTX 5060 WINDFORCE OC 8G NVIDIA GeForce",
      "preco": "R$ 2.449,99",
      "ram": "8GB",
      "gddr": "GDDR7"
    }
  ]
}
```

## 🔧 Configurações Avançadas

### Alterar Número de Páginas

No arquivo `index.ts`, modifique o parâmetro da função:

```typescript
// Processar 5 páginas em vez de 3
const placas = await scraper.scrapePlacasNvidia(5);
```

### Personalizar Headers

Os headers estão configurados no arquivo `src/utils/headers.ts` e podem ser atualizados conforme necessário.

## 🛡️ Recursos Anti-Detecção

- **Headers Reais**: Utiliza headers copiados de navegador real
- **Cookies Válidos**: Implementa cookies de sessão válidos
- **User Agent**: Simula navegador Chrome real
- **Rate Limiting**: Aguarda entre requisições para evitar sobrecarga
- **Request Interception**: Bloqueia recursos desnecessários

## 📈 Performance

- **Otimização de Recursos**: Bloqueia imagens, CSS e fontes para acelerar carregamento
- **Processamento Paralelo**: Utiliza OpenAI para processamento eficiente dos dados
- **Memória Otimizada**: Processa dados página por página

## 🤖 Integração OpenAI

O projeto utiliza:
- **Modelo**: GPT-4o-2024-08-06
- **Structured Outputs**: Garante formato JSON consistente
- **Schema Validation**: Valida estrutura dos dados extraídos
- **Error Handling**: Tratamento robusto de erros da API

## 📝 Logs

O scraper fornece logs detalhados durante a execução:

```
🎯 Iniciando scraper de placas de vídeo NVIDIA da Kabum...
🚀 Iniciando browser...
✅ Browser configurado com sucesso
📄 Processando página 1/3...
🌐 Navegando para: https://www.kabum.com.br/...
📊 Processando dados da página 1 com OpenAI...
✅ Encontradas 19 placas na página 1
```

## ⚠️ Considerações Legais

- Este scraper é para fins educacionais e de pesquisa
- Respeite os termos de uso do site da Kabum
- Use com moderação para evitar sobrecarga dos servidores
- Considere implementar cache para reduzir requisições

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 🔗 Links Úteis

- [Documentação Puppeteer](https://pptr.dev/)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [Bun Documentation](https://bun.sh/docs)

---

**Desenvolvido com ❤️ usando Bun, TypeScript e OpenAI**
