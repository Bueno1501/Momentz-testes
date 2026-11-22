import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/utils/validacao_cadastro.dart';

void main() {
  group('Testes de cadastro - MOMENTZ', () {
    test('1 - Deve aceitar senha válida', () {
      expect(ValidacaoCadastro.senhaValida('Momentz@123'), isTrue);
    });

    test('2 - Deve rejeitar senha sem maiúscula', () {
      expect(ValidacaoCadastro.senhaValida('momentz@123'), isFalse);
    });

    test('3 - Deve rejeitar senha sem caractere especial', () {
      expect(ValidacaoCadastro.senhaValida('Momentz123'), isFalse);
    });

    test('4 - Deve aceitar senhas iguais', () {
      expect(
        ValidacaoCadastro.senhasCoincidem('Momentz@123', 'Momentz@123'),
        isTrue,
      );
    });

    test('5 - Deve rejeitar senhas diferentes', () {
      expect(
        ValidacaoCadastro.senhasCoincidem('Momentz@123', 'Momentz@456'),
        isFalse,
      );
    });

    test('6 - Deve rejeitar campos obrigatórios vazios', () {
      expect(
        ValidacaoCadastro.camposPreenchidos(
          nome: '',
          email: 'teste@momentz.com',
          senha: 'Momentz@123',
          confirmarSenha: 'Momentz@123',
        ),
        isFalse,
      );
    });

    test('7 - Deve aceitar todos os campos preenchidos', () {
      expect(
        ValidacaoCadastro.camposPreenchidos(
          nome: 'Administrador',
          email: 'teste@momentz.com',
          senha: 'Momentz@123',
          confirmarSenha: 'Momentz@123',
        ),
        isTrue,
      );
    });
  });
}
