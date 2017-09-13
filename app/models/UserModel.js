import Validator from '../utils/Validator';

const valid = Validator.valid;

const UserModel = [
  {
    id: 'user_id',
    default: 0,
  },
  {
    id: 'username', default: "", label: "Username", valid: valid.anyValue,
    display:  { type: 'single'},
  },
  {
    id: 'email', default: "", label: "Email", valid: valid.anyValue,
    display: { type: 'single'},
  },
];


export default UserModel;
