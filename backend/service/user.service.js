import { UserDao } from './../dao/user.dao';
import { handleError } from './../model/Error';
import { Secure } from './../util/secure';
export class UserService {
  static createUser = async (req) => {
    let { id, password, name } = req;

    const salt = await Secure.genSalt();
    password = await Secure.hash(password, salt);

    const exsited = await UserDao.getUser(id);

    if (exsited != null) {
      throw new handleError(409, 'User already existed');
    }

    try {
      await UserDao.createUser(id, password, salt, name);
      const result = await UserDao.getUser(id);
      return result;
    } catch (err) {
      throw new handleError(500, 'Create user fail');
    }
  };

  static getUser = async (req) => {
    const { id } = req;
    const result = await UserDao.getUser(id);

    if (result == null) {
      throw new handleError(400, 'User not exsited');
    }
    return result;
  };

  static updateUser = async (params, body) => {
    const { id } = params;
    const { isManager } = body;
    const result = await UserDao.updateUser(id, isManager);

    if (result == null) {
      throw new handleError(400, 'User not exsited');
    }
    const findResult = await UserDao.getUser(id);
    return findResult;
  };

  static deleteUser = async (params) => {
    const { id } = params;

    const result = await UserDao.deleteUser(id);

    if (result.n == 0) {
      throw new handleError(404, 'User not exsited');
    } else if (result.ok == 1) {
      return result;
    } else {
      throw new handleError(500, 'Delete error');
    }
  };
}
