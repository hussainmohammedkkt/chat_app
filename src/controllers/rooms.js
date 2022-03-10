import SendResponse from "../utilities/SendResponse";
import mysql_pool from "../utilities/mysql";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
export const newMeeting = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return SendResponse.error({ message: "ROOMAPI:10 - Invalid request" }, res);
  }

  mysql_pool.getConnection((error, conn) => {
    if (error) {
      return SendResponse.error({ message: "ROOMAPI:11 - Connection timeout" }, res);
    }
    let room_token = uuidv4();
    conn.query(
      `insert into rooms set ?`,
      [{ room_token, room_created_by: user_id }],
      (insertError, room) => {
        conn.release();
        if (insertError) {
          return SendResponse.error({ message: "ROOMAPI:24 - Connection timeout" }, res);
        }
        return SendResponse.success(
          { room_token, room_id: room.insertId },
          res
        );
      }
    );
  });
};
export const joinMeeting = (req, res) => {
  const { room_token } = req.body;

  if (!room_token) {
    return SendResponse.error({ message: "ROOMAPI:38 - Invalid request" }, res);
  }

  mysql_pool.getConnection((error, conn) => {
    if (error) {
      return SendResponse.error({ message: "ROOMAPI:43 - Connection timeout" }, res);
    }
    conn.query(
      `select * from rooms where room_token=?`,
      [room_token],
      (insertError, room) => {
        if (insertError) {
          conn.release();
          return SendResponse.error({ message: "ROOMAPI:51 - Connection timeout" }, res);
        }
        if (room.length == 0) {
          conn.release();
          return SendResponse.error({ message: "ROOMAPI:55 - Invalid Meeting Code" }, res);
        } else {
          conn.query(
            `select chats.*,users.user_name from chats join users using(user_id) where chats.room_id=? order by chats.created_at desc limit 10`,
            [room[0].room_id],
            (getError, messages) => {
              conn.release();
              if (getError) {
                return SendResponse.error(
                  { message: "ROOMAPI:64 - Connection timeout" },
                  res
                );
              } else {
                messages = messages.map(e => {
                  e.time = moment(e.created_at).format('hh:mm A');
                  return e;
                });
                _.reverse(messages);
                return SendResponse.success(
                  { room_token, room_id: room[0].room_id, messages },
                  res
                );
              }
            }
          );
        }
      }
    );
  });
};
