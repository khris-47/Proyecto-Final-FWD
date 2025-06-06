use tc782;

-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
-- Auditoria de Cuentos
-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



-- ################################################################
-- Auditoria para el momento de la creacion del cuento

delimiter $$
create trigger auditoria_insert_cuentos
after insert on api_cuentos
for each row
begin
    insert into api_auditoria_cuentos (tipoMovimiento, descripcion, fechaMovimiento, cuento) values
	(
		'CREATE',
		concat('Se creo el cuento: ', new.nombre_Cuento, ', dedicado a la ubicacion con el id: ', new.ubicacion_id),
		NOW(),
		new.id
    );
END $$

delimiter ;


-- ################################################################
-- Auditoria para el momento de la actualizacion del cuento 

delimiter $$
create trigger auditoria_update_cuentos
after update on api_cuentos
for each row
begin
	insert into api_auditoria_cuentos (tipoMovimiento, descripcion, fechaMovimiento, cuento) values
    (
		'UPDATE',
        concat('Se actualizo el cuento: ',
			'<br>', '<b> Los datos anteriores eran:  </b>',
            '<br>Nombre: ', old.nombre_Cuento, '<br>Portada: ',old.portada, '<br>Cuento: ',old.cuento, '<br>Estado: ',old.estado_id, '<br>Ubicacion: ',old.ubicacion_id,
            '<br><b>Nuevos Datos:</b>',
            '<br>Nombre: ', new.nombre_Cuento, '<br>Portada: ',new.portada, '<br>Cuento: ',new.cuento, '<br>Estado: ',new.estado_id, '<br>Ubicacion: ',new.ubicacion_id
        ),
        now(),
        new.id
	);
end $$
delimiter ;


-- ################################################################
-- Auditoria para el momento de la eliminacion del cuento

delimiter $$

create trigger auditoria_delete_cuentos
after delete on api_cuentos
for each row
begin
	insert into api_auditoria_cuentos (tipoMovimiento, descripcion, fechaMovimiento, cuento) values
    (
		'DELETE',
        concat('Se borro un cuento: ',
			'<br>', '<b> Los datos anteriores eran:  </b>',
            '<br>Nombre: ', old.nombre_Cuento, '<br>Portada: ',old.portada, '<br>Cuento: ',old.cuento, '<br>Estado: ',old.estado_id, '<br>Ubicacion: ',old.ubicacion_id
		),
        now(),
        old.id
	);
end $$

delimiter ;



-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
-- Auditoria de Entrevistas
-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


-- ################################################################
-- Auditoria para el momento de la creacion de las entrevistas
delimiter $$
create trigger auditoria_insert_entrevistas
after insert on api_entrevistas
for each row
begin
	insert into api_auditoria_entrevistas (tipoMovimiento, descripcion, fechaMovimiento, entrevista) values
    (
		'CREATE',
        concat('Se realizo el create de la entrevista de: ',new.nombre_Persona, '.Realizada en la ubicacion con el id: ',new.ubicacion_id),
        now(),
        new.entrevista
	);
end $$

delimiter ;

-- ################################################################
-- Auditoria para el momento de la actualizacion de las entrevistas
delimiter $$
create trigger auditoria_update_entrevistas
after update on api_entrevistas
for each row
begin
	insert into api_auditoria_entrevistas (tipoMovimiento, descripcion, fechaMovimiento, entrevista) values 
    (
		'UPDATE',
        concat('Actualizacion de entrevista', '<br>', '<b> Los datos anteriores eran:  </b>',
            '<br>Nombre de la persona: ', old.nombre_Persona, '<br>Descripcion: ',old.descripcion, '<br>Entrevista ',old.entrevista, '<br>Estado: ',old.estado_id, '<br>Ubicacion: ',old.ubicacion_id,
            '<br><b>Nuevos Datos:</b>',
			'<br>Nombre de la persona: ', new.nombre_Persona, '<br>Descripcion: ',new.descripcion, '<br>Entrevista ',new.entrevista, '<br>Estado: ',new.estado_id, '<br>Ubicacion: ',new.ubicacion_id),
		now(),
        new.id
	);
end $$
delimiter ;


-- ################################################################
-- Auditoria para el momento de la Eliminacion de las entrevistas
delimiter $$
create trigger auditoria_delete_entrevistas
after delete on api_entrevistas
for each row
begin
	insert into api_auditoria_entrevistas (tipoMovimiento, descripcion, fechaMovimiento, entrevista) values 
    (
		'DELETE',
        concat('Eliminacion de entrevista', '<br>', '<b> Los datos anteriores eran:  </b>',
            '<br>Nombre de la persona: ', old.nombre_Persona, '<br>Descripcion: ',old.descripcion, '<br>Entrevista ',old.entrevista, '<br>Estado: ',old.estado_id, '<br>Ubicacion: ',old.ubicacion_id
			),
		now(),
        old.id
	);
end$$
delimiter ;


-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
-- Auditoria de Usuarios
-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

-- ################################################################
-- Auditoria para la creacion de usuarios

delimiter $$
create trigger auditoria_insert_usuario
after insert on auth_user
for each row
begin
	insert into api_auditoria_user (tipoMovimiento, descripcion, fechaMovimiento, user) values
    (
		'CREATE',
        concat('Se creo un nuevo usuario <br> <b>Los datos son: </b>,<br>Usuario:  ',new.username, '<br>Nombre: ',new.first_name,' ',new.last_name, '<br>Correo: ',new.email),
        now(),
        new.id
	);
end $$
delimiter ;





-- ################################################################
-- Auditoria para la actualizacion de usuarios

delimiter $$
create trigger auditoria_update_usuario
after update on auth_user
for each row
begin
	insert into api_auditoria_user (tipoMovimiento, descripcion, fechaMovimiento, user) values
     (
		'UPDATE',
        concat('Se actualizo un usuario <br> <b>Los nuevo datos son: </b>,<br>Usuario:  ',new.username, '<br>Nombre: ',new.first_name,' ',new.last_name, '<br>Correo: ',new.email, '<br>Estado: ',new.is_active,
        '<br><b>Los datos anteriores eran: </b>',
			'<br>Usuario:  ',old.username, '<br>Nombre: ',old.first_name,' ',old.last_name, '<br>Correo: ',old.email, '<br>Estado: ',old.is_active),
        now(),
        new.id
	);
end $$
delimiter ;


-- ################################################################
-- Auditoria para la eliminacion de usuarios

delimiter $$
create trigger auditoria_delete_usuario
after delete on auth_user
for each row
begin
	insert into api_auditoria_user (tipoMovimiento, descripcion, fechaMovimiento, user) values
     (
		'DELETE',
        concat('Se elimino un usuario <br> ',
        '<br><b>Los datos anteriores eran: </b>',
			'<br>Usuario:  ',old.username, '<br>Nombre: ',old.first_name,' ',old.last_name, '<br>Correo: ',old.email, '<br>Estado: ',old.is_active),
        now(),
        old.id
	);
end $$	
delimiter ;


show triggers


