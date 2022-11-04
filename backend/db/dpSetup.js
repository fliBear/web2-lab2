const { getClient } = require("../db/connect.js");

module.exports.dbSetup = async () => {
    console.log("Entering setup");
    const client = await getClient();
    const checkForInit = await client.query(
        "select * from pg_tables where tablename='users'"
    );
    //If db is setup already done return
    if (checkForInit.rows != 0) return;

    console.log("Starting setup");
    await client.query(
        "CREATE TABLE users (user_id serial primary key, username text,user_email text);"
    );
    await client.query(
        "CREATE TABLE realestate(estate_id serial primary key, user_id int, estate_type text, address text, value int, foreign key(user_id) references users(user_id));"
    );
    await client.query(
        "CREATE TABLE session_token( id serial primary key, session text, token text);"
    );
    await client.query(
        "insert into users(username, user_email) values('user1', 'user1@email.com');"
    );
    await client.query(
        "insert into users(username, user_email) values('user2', 'user2@email.com');"
    );
    await client.query(
        "insert into users(username, user_email) values('user3', 'user3@email.com');"
    );
    await client.query(
        "insert into realestate(user_id, estate_type, address, value) values(1, 'house', 'Unska 1, Zagreb', 100000);"
    );
    await client.query(
        "insert into realestate(user_id, estate_type,address, value) values(2, 'house', 'Unska 2, Zagreb', 200000);"
    );
    await client.query(
        "insert into realestate(user_id, estate_type,address, value) values(3, 'house', 'Unska 3, Zagreb', 300000);"
    );
    await client.query(
        "insert into realestate(user_id, estate_type, address, value) values(1, 'house', 'Unska 7, Zagreb', 100000);"
    );
    await client.query(
        "insert into realestate(user_id, estate_type, address, value) values(1, 'house', 'Unska 10, Zagreb', 100000);"
    );
};
