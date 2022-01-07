const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {validateRegisterInput, validateLoginInput} = require('../../utils/validators')
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');


function generateToken(user)  {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username 
    }, SECRET_KEY, { expiresIn: '1h'})
}
module.exports = {
  Mutation: {
      async login(_, { username, password }) {
          const {errors, valid} = validateLoginInput(username, password);
          const user = await User.findOne({ username });
          if (!valid) {
            throw new UserInputError('errors', {errors});
          }

          if (!user) {
              errors.general = 'usuário não encontrado'
              throw new UserInputError('usuário não encontrado', {errors});
          } 

          const match = await bcrypt.compare(password, user.password);
          if(!match) {
            errors.general = 'Credenciais Inválidas'
            throw new UserInputError('Credenciais Inválidas', {errors});
        } 
        
        const token = generateToken(user)
        return {
            ...user._doc,
            id: user._id,
            token
        }
      },
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword } 
      },
    ) {
      //Todo: autenticar o usuário
      const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword)
      if (!valid) {
          throw new UserInputError('Errors', {errors});
      }
      //não duplicar usuário
      const user = await User.findOne({ username })
      if (user) {
          throw new UserInputError('O usuário já existe', {
              errors: {
                  username: 'O nome de usuário já existe'
              }
          })
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString()
      })

      const res = await newUser.save()

      const token = generateToken(res)

      return {
          ...res._doc,
          id: res._id,
          token
      }
    },

  },
};
