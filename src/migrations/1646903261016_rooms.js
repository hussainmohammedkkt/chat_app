module.exports = {
    "up": `CREATE TABLE rooms (
        room_id INT NOT NULL AUTO_INCREMENT,
        room_token VARCHAR(1000) NOT NULL,
        room_created_by INT NOT NULL,
        room_created_at DATETIME NOT NULL DEFAULT curreNT_TIMESTAMP(),
        PRIMARY KEY (room_id)
    )
    COLLATE='utf8mb4_general_ci'
    ;
    `,
    "down": ""
}