SELECT * FROM tc782.api_verificacionprimerlogin;

INSERT INTO tc782.api_verificacionprimerlogin (user_id, codigo, verificado, creacion)
SELECT u.id, 0, TRUE, NOW()
FROM auth_user u
LEFT JOIN tc782.api_verificacionprimerlogin v ON u.id = v.user_id
WHERE v.user_id IS NULL;