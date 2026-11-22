const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");

// ============================================================
// CONFIGURAÇÃO DOS TESTES - MOMENTZ
// ============================================================

// Caminho do controller que será testado.
const controllerPath = path.resolve(
  __dirname,
  "../controllers/eventosController.js",
);

// ============================================================
// SIMULAÇÃO DO BANCO DE DADOS
// ============================================================

// Permite testar o controller sem conectar ao MySQL.
const bancoSimulado = {
  query: () => {
    throw new Error("Consulta ao banco não configurada.");
  },
};

// ============================================================
// SIMULAÇÃO DO CLOUDFLARE R2
// ============================================================

// Evita utilizar o armazenamento real durante os testes.
const r2Simulado = {
  enviarArquivo: async () => {},
  gerarUrlTemporaria: async () => "https://exemplo.test/convite",
};

// ============================================================
// CARREGAMENTO DO CONTROLLER COM DEPENDÊNCIAS SIMULADAS
// ============================================================

const carregarController = () => {
  const carregarOriginal = Module._load;

  try {
    Module._load = function (request, parent, isMain) {
      if (parent?.filename === controllerPath) {
        if (request === "../config/db") {
          return bancoSimulado;
        }

        if (request === "../services/r2Service") {
          return r2Simulado;
        }
      }

      return carregarOriginal.apply(this, arguments);
    };

    delete require.cache[controllerPath];

    return require(controllerPath);
  } finally {
    Module._load = carregarOriginal;
  }
};

// Importa as funções reais do controller.
const { acessarEvento, buscarEventoPorToken } = carregarController();

// ============================================================
// SIMULAÇÃO DA RESPOSTA DO EXPRESS
// ============================================================

function criarResposta() {
  return {
    statusCode: 200,
    dados: null,
    respostaEnviada: false,

    status(codigo) {
      this.statusCode = codigo;
      return this;
    },

    json(dados) {
      this.dados = dados;
      this.respostaEnviada = true;
      return this;
    },
  };
}

// ============================================================
// TESTES DE ACESSO AO EVENTO POR CÓDIGO
// ============================================================

// TESTE 1 - Código não informado.
test("Evento - rejeita código não informado", () => {
  const req = {
    body: {},
  };

  const res = criarResposta();

  acessarEvento(req, res);

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.dados, {
    erro: "Código do evento não informado.",
  });
});

// TESTE 2 - Código inexistente.
test("Evento - rejeita código inexistente", () => {
  bancoSimulado.query = (sql, parametros, callback) => {
    assert.deepEqual(parametros, ["EVEINVALIDO"]);
    callback(null, []);
  };

  const req = {
    body: {
      codigo_evento: "EVEINVALIDO",
    },
  };

  const res = criarResposta();

  acessarEvento(req, res);

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.dados, {
    erro: "Código do evento inválido.",
  });
});

// TESTE 3 - Código válido.
test("Evento - permite acesso com código válido", () => {
  const eventoSimulado = {
    evento_id: 1,
    codigo_evento: "EVE1234567",
    tipo_evento: "Casamento",
    nome_administrador: "Administrador Teste",
  };

  bancoSimulado.query = (sql, parametros, callback) => {
    assert.deepEqual(parametros, ["EVE1234567"]);
    callback(null, [eventoSimulado]);
  };

  const req = {
    body: {
      codigo_evento: "EVE1234567",
    },
  };

  const res = criarResposta();

  acessarEvento(req, res);

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.dados.mensagem, "Evento encontrado.");
  assert.deepEqual(res.dados.evento, eventoSimulado);
});

// TESTE 4 - Erro na consulta ao banco.
test("Evento - retorna erro quando a consulta falha", () => {
  bancoSimulado.query = (sql, parametros, callback) => {
    callback(new Error("Falha simulada no banco"), null);
  };

  const req = {
    body: {
      codigo_evento: "EVE1234567",
    },
  };

  const res = criarResposta();

  // Evita imprimir o erro simulado no terminal.
  const consoleErrorOriginal = console.error;

  try {
    console.error = () => {};

    acessarEvento(req, res);
  } finally {
    console.error = consoleErrorOriginal;
  }

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.dados, {
    erro: "Erro ao buscar evento.",
  });
});

// ============================================================
// TESTES DE ACESSO AO EVENTO POR TOKEN DE CONVITE
// ============================================================

// TESTE 5 - Token não informado.
test("Convite - rejeita token não informado", () => {
  const req = {
    params: {},
  };

  const res = criarResposta();

  buscarEventoPorToken(req, res);

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.dados, {
    erro: "Token do convite não informado.",
  });
});

// TESTE 6 - Token inválido.
test("Convite - rejeita token inválido", () => {
  bancoSimulado.query = (sql, parametros, callback) => {
    assert.deepEqual(parametros, ["token-invalido"]);
    callback(null, []);
  };

  const req = {
    params: {
      token: "token-invalido",
    },
  };

  const res = criarResposta();

  buscarEventoPorToken(req, res);

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.dados, {
    erro: "Convite inválido ou evento não encontrado.",
  });
});

// TESTE 7 - Token válido.
test("Convite - permite acesso com token válido", () => {
  const eventoSimulado = {
    evento_id: 1,
    codigo_evento: "EVE1234567",
    tipo_evento: "Casamento",
    convite_url: null,
  };

  bancoSimulado.query = (sql, parametros, callback) => {
    assert.deepEqual(parametros, ["token-valido"]);
    callback(null, [eventoSimulado]);
  };

  const req = {
    params: {
      token: "token-valido",
    },
  };

  const res = criarResposta();

  buscarEventoPorToken(req, res);

  assert.equal(res.respostaEnviada, true);
  assert.equal(res.statusCode, 200);
  assert.equal(res.dados.mensagem, "Evento encontrado.");
  assert.deepEqual(res.dados.evento, eventoSimulado);
});
