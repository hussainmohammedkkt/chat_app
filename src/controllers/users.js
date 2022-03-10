import SendResponse from "../utilities/SendResponse";
import mysql_pool from '../utilities/mysql';
export const login = (req, res) => {
  const { username } = req.body;
  if (!username) {
    return SendResponse.error({ message: "USERAPI:6 - Invalid Username" }, res);
  }
  mysql_pool.getConnection((error, conn) => {
    if (error) {
      return SendResponse.error({ message: "USERAPI:10 - Connection timeout" }, res);
    }
    conn.query(
      `select * from users where user_name=?`,
      [username],
      (getError, user) => {
          if (getError) {
              conn.release();
          return SendResponse.error({ message: "USERAPI:18 - Connection timeout" }, res);
        }

        if (user.length == 0) {
          conn.query(
            `insert into users set ?`,
            [
              {
                user_name:username,
              },
            ],
              (insertError, newUser) => {
                conn.release();
              if (insertError) {
                return SendResponse.error(
                  { message: "USERAPI:33 - Connection timeout" ,error},
                  res
                );
              } else {
                return SendResponse.success(
                  { user_id: newUser.insertId, user_name:username },
                  res
                );
              }
            }
          );
        } else {
            conn.release();
          return SendResponse.success(
            { user_id: user[0].user_id, user_name: user[0].user_name },
            res
          );
        }
      }
    );
  });
};
