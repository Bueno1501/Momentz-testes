
# MOMENTZ-TESTES

## Testes Automatizados, Integração Contínua e Segurança

Este repositório contém uma versão do projeto MOMENTZ destinada à aplicação de testes automatizados, integração contínua (CI) e análise estática de segurança.

O trabalho foi desenvolvido no contexto da disciplina de **Qualidade de Software e Governança em TI**, do curso de Sistemas de Informação da Faculdade de Apucarana (FAP).

### 1. Sobre o MOMENTZ

O MOMENTZ é um sistema de gerenciamento de eventos que permite organizar informações relacionadas a convidados, fotografias, fornecedores, orçamento e presentes.

A aplicação utiliza:

- **Flutter e Dart:** desenvolvimento da interface.
- **Node.js e Express:** desenvolvimento da API.
- **MySQL:** banco de dados relacional.
- **Cloudflare R2:** armazenamento de fotografias.
- **JWT:** autenticação e controle de acesso.
- **Mercado Pago:** integração para pagamentos.

Este repositório é destinado aos testes e está separado do projeto principal.

### 2. Objetivo

Aplicar práticas de qualidade de software por meio de:

- Desenvolvimento de testes unitários.
- Verificação de cenários de sucesso e erro.
- Execução automática de testes.
- Integração contínua com GitHub Actions.
- Análise estática de segurança utilizando Semgrep.
- Identificação e correção de problemas no código.

### 3. Testes automatizados

Foram implementados **14 testes automatizados**, divididos entre Flutter/Dart e Node.js.

#### 3.1. Testes Flutter — 7 testes

Arquivo:

`frontend/test/validacao_cadastro_test.dart`

Os testes verificam as regras de validação utilizadas no cadastro de usuários.

Entre os cenários avaliados estão:

- Senhas que atendem aos requisitos de segurança.
- Senhas que não atendem aos requisitos.
- Confirmação de senhas coincidentes.
- Confirmação de senhas diferentes.
- Validação de campos obrigatórios.

A lógica testada está implementada em:

`frontend/lib/utils/validacao_cadastro.dart`

#### 3.2. Testes Node.js — 7 testes

Arquivo:

`testes/eventos.test.js`

**Acesso ao evento:**

1. Rejeita código não informado.
2. Rejeita código inexistente.
3. Permite acesso com código válido.
4. Retorna erro quando a consulta ao banco falha.

**Acesso por convite:**

5. Rejeita token não informado.
6. Rejeita token inválido.
7. Permite acesso com token válido.

Os testes utilizam o módulo nativo `node:test`, juntamente com `assert`, e simulações de dependências para testar a lógica sem depender de um banco de dados real.

### 4. Como executar os testes localmente

#### Pré-requisitos

- Node.js e npm.
- Flutter SDK instalado.
- Git.

#### 4.1. Instalar dependências do backend

Na pasta principal do projeto:

```bash
npm ci
```

#### 4.2. Executar testes Node.js

```bash
node --test testes/eventos.test.js
```

Resultado esperado: 7 testes aprovados.

#### 4.3. Instalar dependências do Flutter

```bash
cd frontend
flutter pub get
```

#### 4.4. Executar testes Flutter

```bash
flutter test test/validacao_cadastro_test.dart
```

Resultado esperado: 7 testes aprovados.

Para retornar à pasta principal:

```bash
cd ..
```

### 5. Integração contínua (CI)

A integração contínua foi implementada utilizando **GitHub Actions**.

O arquivo responsável pela configuração é:

`.github/workflows/ci.yml`

O workflow é executado automaticamente quando ocorre:

- Um `push` na branch `main`.
- A abertura ou atualização de um `pull request` direcionado à branch `main`.

A pipeline possui três jobs independentes:

| Job | Responsabilidade |
| --- | --- |
| Testes Node.js | Executar os testes automatizados do backend |
| Testes Flutter | Executar os testes automatizados do frontend |
| Análise de segurança | Examinar o código utilizando Semgrep |

Se um job retornar erro, a execução do workflow será marcada como falha.

### 6. Análise de segurança com Semgrep

O Semgrep é uma ferramenta de análise estática de código (SAST), utilizada para identificar padrões potencialmente inseguros.

O comando configurado na CI é:

```bash
semgrep scan --config p/default --error .
```

Durante a implementação da pipeline, o Semgrep identificou alertas relacionados a:

- Referências mutáveis de GitHub Actions.
- Configuração da autenticação criptográfica AES-GCM.
- Ausência de middleware CSRF detectável no Express.

Foram realizadas correções nas referências das Actions e na configuração da tag de autenticação AES-GCM.

O alerta de CSRF recebeu uma exceção específica documentada no código, considerando o uso de tokens JWT enviados pelo cabeçalho `Authorization`. Essa exceção deve ser reavaliada caso a aplicação passe a utilizar autenticação baseada em cookies.

A aprovação da análise estática não garante ausência de todas as vulnerabilidades.

### 7. Resultados obtidos

Os testes automatizados executados apresentaram os seguintes resultados:

| Categoria | Quantidade | Resultado |
| --- | --- | --- |
| Testes Flutter | 7 | Aprovados |
| Testes Node.js | 7 | Aprovados |
| Total | 14 | Aprovados |

Após os ajustes de segurança, o workflow do GitHub Actions apresentou uma execução bem-sucedida.

Isso demonstra o funcionamento da integração contínua, com verificações automatizadas de testes e segurança.

### 8. Estrutura dos arquivos principais

```text
Momentz-testes/
|
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|
|-- controllers/
|-- routes/
|-- services/
|   `-- mercadoPagoCrypto.js
|
|-- testes/
|   `-- eventos.test.js
|
|-- frontend/
|   |-- lib/
|   |   `-- utils/
|   |       `-- validacao_cadastro.dart
|   |
|   `-- test/
|       `-- validacao_cadastro_test.dart
|
|-- server.js
|-- package.json
`-- README.md
```

### 9. Tecnologias e ferramentas

- Flutter
- Dart
- Node.js
- Express
- Git e GitHub
- GitHub Actions
- Semgrep
- Visual Studio Code

### 10. Conclusão

A implementação dos testes automatizados e da integração contínua permitiu verificar regras importantes do MOMENTZ de maneira repetível.

A utilização do GitHub Actions automatizou a execução dos testes, enquanto o Semgrep possibilitou identificar problemas de segurança e acompanhar suas correções.

O trabalho demonstra a aplicação prática de conceitos de qualidade de software, automação e segurança no processo de desenvolvimento.

---

**Projeto acadêmico:** MOMENTZ-TESTES

**Curso:** Sistemas de Informação

**Instituição:** Faculdade de Apucarana (FAP)

**Disciplina:** Qualidade de Software e Governança em TI

**Repositório:** https://github.com/Bueno1501/Momentz-testes
