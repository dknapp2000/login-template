
sqlite3 users.db <<EOF
.mode column
.headers on
.width 4 30 10 10 60 
select * from users;
.quit
EOF
