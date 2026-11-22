
class ValidacaoCadastro {
  static final RegExp _senhaRegex = RegExp(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$',
  );

  static bool senhaValida(String senha) {
    return _senhaRegex.hasMatch(senha);
  }

  static bool senhasCoincidem(
    String senha,
    String confirmacao,
  ) {
    return senha == confirmacao;
  }

  static bool camposPreenchidos({
    required String nome,
    required String email,
    required String senha,
    required String confirmarSenha,
  }) {
    return nome.trim().isNotEmpty &&
        email.trim().isNotEmpty &&
        senha.isNotEmpty &&
        confirmarSenha.isNotEmpty;
  }
}
