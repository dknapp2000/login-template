drop table users;
go

create table users (
        id                  integer primary key,
        username            varchar(255) not null,
        firstname           varchar(100) not null,
        lastname            varchar(100) not null,
        password            varchar(100) not null,
        role_nm             varchar(50) not null default 'READ',
        is_active           varchar(10) not null default 'N' check( is_active in ( 'Y', 'N' ) ),
        email_is_verfied    varchar(10) not null default 'N' check( email_is_verfied in ( 'N', 'Y' ) ),
        pw_reset_key        varchar(40) null,
        insert_dtm          datetime not null default CURRENT_TIMESTAMP,
        update_dtm          datetime not null default CURRENT_TIMESTAMP
);

create unique index uq_users_username on users(username);

insert into users ( username, firstname, lastname, password, role_nm, is_active ) 
values ( 'don@dknapp.com', 'Don', 'Knapp', 'test', 'ADMIN', 'Y' );

.mode column
.headers on 

select * from users;

--delete from users
