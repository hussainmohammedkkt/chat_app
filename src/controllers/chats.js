import SendResponse from "../utilities/SendResponse";
import mysql_pool from "../utilities/mysql";

export const saveMessage = (data) => {
  mysql_pool.getConnection((error, conn) => {
    if (error) {
      console.log("CHATAPI:7 - Connection timeout");
      return;
    }
    conn.query(
      `insert into chats set ?`,
      [
        {
          message: data.message,
          room_id: data.room_id,
          user_id: data.user_id,
        },
      ],
      (insertError) => {
        if (insertError) {
          console.log("CHATAPI:21 - Saving chat to db error",insertError);
          return;
        } else {
          return;
        }
      }
    );
  });
};
