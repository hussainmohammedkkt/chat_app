module.exports = {
    "up": `CREATE TABLE chats (
        chat_id INT NOT NULL AUTO_INCREMENT,
        room_id INT NOT NULL,
        user_id INT NOT NULL,
        message VARCHAR(1000) NOT NULL DEFAULT '',
        created_at DATETIME NOT NULL DEFAULT currENT_TIMESTAMP(),
        PRIMARY KEY (chat_id)
    )
    COLLATE='utf8mb4_general_ci'
    ;
    `,
    "down": ""
}