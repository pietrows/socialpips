module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "O usuário deve ser preenchido";
  }
  if (username.trim() === "") {
    errors.username = "O email deve ser preenchido";
  } else {
    const regEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email.match(regEx)) {
      errors.email = "Este email é inválido";
    }
  }
  if (password.trim() === "") {
    errors.password = "A senha deve ser preenchida";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "a senha não conicide com a outra";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "O usuário deve ser preenchido";
  }
  if (password.trim() === "") {
    errors.password = "A senha deve ser preenchido";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
