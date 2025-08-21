import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Usuarios_Services from "../../services/Usuarios_Services";
import Fondo from "../../assets/img/fondos/fondo_login.jpg";
import Logo from "../../assets/img/logos/logo_blanco.png";
import Modal_Usuario from "../registros/Modal_Usuario"; // Modal de registro de usuario
import { AuthContext } from "../navegacion/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify"; // Para las notificaciones
import { getVisitorId } from "../../utils/fingerprint";
import Cookies from "js-cookie"; // npm install js-cookie

import "../../styles/login.css";

function Login_content() {
  // Estados para controlar el login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Constante para manejar la navegacion de paginas
  const navigate = useNavigate();

  // Estados para el modal de registro
  const [showModal, setShowModal] = useState(false); // controla la visibilidad del modal
  const [formData, setFormData] = useState({
    // datos del nuevo usuario
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  // Funcion para manejar el incio de sesion
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene la acciones por defecto
    setError(""); // limpia errores anteriores

    // Verificamos si el dispositivo ya esta bloqueado
    const visitorId = await getVisitorId();

    const bloqueo = await Usuarios_Services.verificarBloqueoLogin(visitorId);

    console.log("Verificación de bloqueo:", bloqueo.status);

    if (bloqueo.status === "bloqueado") {
      Swal.fire(
        "Dispositivo bloqueado",
        `Intentá de nuevo en ${bloqueo.tiempo_restante_segundos} segundos`,
        "error"
      );
      toast.error(`Dispositivo bloqueado. Intentá de nuevo en ${bloqueo.tiempo_restante_segundos} segundos`, { autoClose: 5000 });
      return;
    }

    // verificamos el estado del usuario
    try {
      // Consultamos estado de verificación primer login
      const verifResponse = await Usuarios_Services.verificarEstadoUsuario(
        username
      );

      // verificamos que ya haya hecho su primer incio de sesion
      if (verifResponse.data.verificado === false) {
        // en caso de que sea su primer inicio de sesion, le pedimos el codigo enviado al correo
        const { value: codigoIngresado } = await Swal.fire({
          title: "Código de verificación",
          input: "text",
          inputLabel: "Por favor ingresa el código que te enviamos por correo",
          inputPlaceholder: "Código de verificación",
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return "Debes ingresar el código!";
            }
          },
        });

        // verificamos la validez del codigo
        if (codigoIngresado) {
          try {
            // Llamar servicio que valida el código en backend
            await Usuarios_Services.validarCodigoVerificacion({
              username,
              codigo: codigoIngresado,
            });

            // Si pasa, mostrar mensaje de éxito y continuar login (o recargar)
            toast.success('¡Cuenta verificada! Ya puedes iniciar sesión.', { autoClose: 3000 });

            // Limpiamos el estado para que el usuario ingrese todo nuevamente
            setPassword("");
            setUsername("");
          } catch (error) {
            toast.error('Código incorrecto o expirado.', { autoClose: 5000 });
            console.log("error en la verificacion del codigo", error);
          }
        }
        return; // Cortamos hasta que verifique
      }
    } catch (err) {
      // si no existe
      const resultado = await Usuarios_Services.registrarLoginFallido(
        visitorId
      );

      if (resultado.status === "bloqueado") {
        toast.error('Demasiados intentos fallidos. Tu dispositivo ha sido bloqueado por 5 minutos', { autoClose: 5000 });
      } else {
        if (err.response && err.response.status === 404) {
          toast.error('Usuario no registrado', { autoClose: 5000 });
        }

        return;
      }
    }

    // En caso de que ya este registrado
    try {
      // Obtener token JWT
      const { access, refresh } = await Usuarios_Services.loginUsuario(
        username,
        password
      );

      // Obtener detalles del usuario autenticado
      const userResponse = await Usuarios_Services.obtenerUsuarioPorId(access);

      // guardamos los datos completos del usuario
      const userData = userResponse.data;

      // Guardar los datos obtenidos en cookies (1 / 24 = una hora)
      Cookies.set("user", JSON.stringify(userData), { expires: 1 / 24 });
      Cookies.set("accessToken", access, { expires: 1 / 24 });
      Cookies.set("refreshToken", refresh, { expires: 1 / 24 });

      // Mostrar mensaje de bienvenida
      if (userData.is_superuser) {
        toast.success(`¡Inicio de sesión exitoso como administrador!`, {
          autoClose: 3500,
        });
      } else {
        await Swal.fire({
          title: `¡Bienvenido, ${userData.first_name}!`,
          text: "Nos alegra tenerte aqui 😊",
          icon: "success",
          confirmButtonText: "Continuar",
        });
      }

      // reiniciar bloqueo
      await Usuarios_Services.resetearBloqueoLogin(visitorId);

      // Redirigir a la pagina principal
      navigate("/");
    } catch (err) {
      // Si las credenciales fallan
      if (err.response && err.response.status === 401) {
        try {
          // Verificamos si el usuario existe pero se encuentra inactivo
          const usuarioInactivo =
            await Usuarios_Services.obtenerUsuarioPorUsername(username);

          if (!usuarioInactivo.data.is_active) {
            // Si se encuentra inactivo, lo mandamos al flujo de recuperacion
            const confirmar = await Swal.fire({
              title: "Cuenta inactiva",
              text: "Tu cuenta está desactivada. ¿Deseas actualizar tu contraseña para activarla?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Sí, actualizar",
              cancelButtonText: "Cancelar",
            });

            if (confirmar.isConfirmed) {
              handleActualizarPasswordPostReset(username);
              return;
            }
          } else {
            // Si esta activo, entonces son credenciales incorrectas
            const resultado = await Usuarios_Services.registrarLoginFallido(
              visitorId
            );

            if (resultado.status === "bloqueado") {
              toast.error('Demasiados intentos fallidos. Tu dispositivo ha sido bloqueado por 5 minutos', { autoClose: 5000 });
            } else {
              toast.error('Credenciales incorrectas', { autoClose: 5000 });
            }

            return;
          }
        } catch {
          // Si el usuario no existe o hubo otro error
          const resultado = await Usuarios_Services.registrarLoginFallido(
            visitorId
          );

          if (resultado.status === "bloqueado") {
            toast.error('Demasiados intentos fallidos. Tu dispositivo ha sido bloqueado por 5 minutos', { autoClose: 5000 });
          } else {
            toast.error('Credenciales incorrectas o usuario no encontrado.', { autoClose: 5000 });
        }
      } else {
        setError("Error del servidor.");
      }
    }
  };

  // Funcion para manejar el registro de un nuevo usuario desde el modal
  const handleRegister = async () => {
    try {
      // Enviamos los datos del modal a la api
      await Usuarios_Services.registrarUsuario(formData);

        toast.success('Usuario creado correctamente. Te hemos enviado un código de verificación a tu correo electrónico.', { autoClose: 3000 });

      // Cerramos el modal y limpiamos el formulario
      setShowModal(false);
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      toast.error('Error al registrar el usuario', { autoClose: 5000 });
    }
  };

  // Manejo del envio de correo para restablecimiento de contra
  const handleForgotPassword = async () => {
    // verificacion del bloqueo
    const visitorId = await getVisitorId();

    const bloqueo = await Usuarios_Services.verificarBloqueoRecuperacion(
      visitorId
    );

    console.log("Verificación de bloqueo:", bloqueo.status);

    if (bloqueo.status === "bloqueado") {
      Swal.fire(
        "Dispositivo bloqueado",
        `Intentá de nuevo en ${bloqueo.tiempo_restante_segundos} segundos`,
        "error"
      );
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Recuperar Contraseña",
      html:
        '<input id="swal-username" class="swal2-input" placeholder="Nombre de usuario">' +
        '<input id="swal-email" type="email" class="swal2-input" placeholder="Correo electrónico">',
      focusConfirm: false,
      confirmButtonText: "Enivar",
      showCancelButton: true,
      preConfirm: () => {
        const username = document.getElementById("swal-username").value;
        const email = document.getElementById("swal-email").value;

        if (!username || !email) {
          Swal.showValidationMessage("Los campos son obligatorios");
          return false;
        }
        return { username, email };
      },
    });

    if (formValues) {
      try {
        await Usuarios_Services.resetPassword(
          formValues.username,
          formValues.email
        );

        await Usuarios_Services.registrarRecuperacionFallida(visitorId);

        toast.success('¡Correo enviado! Se ha enviado una nueva contraseña a tu correo.', { autoClose: 3000 });

      } catch (error) {
        const resultado = await Usuarios_Services.registrarRecuperacionFallida(
          visitorId
        );

        if (resultado.status === "bloqueado") {
          toast.error('Demasiados intentos fallidos. Tu dispositivo ha sido bloqueado por 5 minutos', { autoClose: 5000 });
        } else {
          toast.error(error.response?.data?.error || 'No se pudo restablecer la contraseña.', { autoClose: 5000 });
      }
    }
  };

  // funcion para reactivar contrasenha y reactivar
  const handleActualizarPasswordPostReset = async (prefilledUsername = "") => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar contraseña",
      html:
        `<input id="swal-username-reset" class="swal2-input" placeholder="Nombre de usuario" value="${prefilledUsername}" readonly>` +
        '<input id="swal-temp-password" type="password" class="swal2-input" placeholder="Contraseña temporal">' +
        '<input id="swal-new-password" type="password" class="swal2-input" placeholder="Nueva contraseña">',
      focusConfirm: false,
      confirmButtonText: "Actualizar",
      showCancelButton: true,
      preConfirm: () => {
        const username = document.getElementById("swal-username-reset").value;
        const temp_password =
          document.getElementById("swal-temp-password").value;
        const nueva_password =
          document.getElementById("swal-new-password").value;

        if (!username || !temp_password || !nueva_password) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }
        return { username, temp_password, nueva_password };
      },
    });

    if (formValues) {
      try {
        await Usuarios_Services.cambiarPasswordTrasReset(
          formValues.username,
          formValues.temp_password,
          formValues.nueva_password
        );

        Swal.fire(
          "¡Contraseña actualizada!",
          "Tu contraseña fue cambiada correctamente. Ya puedes iniciar sesión.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudo actualizar la contraseña.",
          "error"
        );
      }
    }
  };

  return (
    <div className="bodyLogin">
      {/* Fondo con capa oscura */}
      <div className="background-container">
        <div className="capaL"></div>
        <img className="background-image" src={Fondo} alt=".." />
      </div>

      {/* Contenedor principal del login */}
      <div className="login-container">
        <div className="left-panel">
          <img src={Logo} alt="logo" />
        </div>

        <div className="right-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <form className="form-control_login" onSubmit={handleSubmit}>
              <p className="title">Iniciar sesión</p>

              {/* Mensaje de error */}
              {error && (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
              )}

              {/* Campo Usuario */}
              <div className="input-field">
                <input
                  required
                  className="input_login"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className="label_login">Usuario</label>
              </div>

              {/* Campo Contrasenha */}
              <div className="input-field">
                <input
                  required
                  className="input_login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="label_login">Contraseña</label>
              </div>

              {/* Enlace para recuperar contrasenha */}
              <span
                onClick={handleForgotPassword}
                style={{
                  color: "#0d6efd",
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                ¿Olvidaste la contraseña?
              </span>

              {/* Boton de login */}
              <button type="submit" className="submit-btn">
                Ingresar
              </button>

              {/* Link para abrir el modal de registro */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "15px",
                }}
              >
                <span style={{ marginRight: "5px" }}>
                  ¿No tienes una cuenta?
                </span>
                <span
                  onClick={() => setShowModal(true)}
                  style={{
                    color: "#0d6efd",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Nuevo Usuario
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal para registro de nuevo usuario */}
      <Modal_Usuario
        show={showModal} // mostrar u ocultar el modal
        onHide={() => setShowModal(false)} //cierra el modal
        onSubmit={handleRegister} // enviar los datos al registro
        formData={formData} // registra los datos del modal
        setFormData={setFormData} // actualiza los datos del formulario
      />
    </div>
  );
}

export default Login_content;
