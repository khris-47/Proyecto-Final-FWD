import { createContext } from "react";
import { refreshAccessToken } from '../../services/Usuarios_Services';
import { useContext } from 'react';
import { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const timerSet = useRef(false); // evita duplicar timers
    const sesionRefresh = useRef(false);
    const [currentToken, setCurrentToken] = useState(Cookies.get('accessToken')); // traer la cookie y tenerla como useSate

    // manejo de intentos en el login
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [forgotAttempts, setForgotAttempts] = useState(0);
    const MAX_LOGIN_ATTEMPTS = 5;
    const MAX_FORGOT_ATTEMPTS = 3;

    // incrementa los intentos por el inicio de sesion, el bloqueo dura 5 minutos
    const incrementLoginAttempts = () => {
        setLoginAttempts(prev => {
            const updated = prev + 1;

            if (updated >= MAX_LOGIN_ATTEMPTS) {
                // Espera 5 minutos para desbloquear (5 * 60 * 1000)
                setTimeout(() => {
                    setLoginAttempts(0);
                }, 5 * 60 * 1000);
            }

            return updated;
        });
    };

    const resetLoginAttempts = () => setLoginAttempts(0);

    const incrementForgotAttempts = () => {
        
        setForgotAttempts(prev => {
            const updated = prev + 1;

            if(updated >= MAX_FORGOT_ATTEMPTS){
                setTimeout(() => {
                    setForgotAttempts(0);
                }, 5 * 60 * 1000);
            }
            return updated;
        });
    };

    const resetForgotAttempts = () => setForgotAttempts(0);

    const isLoginBlocked = loginAttempts >= MAX_LOGIN_ATTEMPTS;
    const isForgotBlocked = forgotAttempts >= MAX_FORGOT_ATTEMPTS;


    // Este useEfect se hara cada cierto tiempo para chequear si hay o no un token
    useEffect(() => {

        // revisa si hay un nuevo token en un intervalo de tiempo
        const interval = setInterval(() => {
            const newToken = Cookies.get('accessToken');


            // si hay uno y es diferente al actual
            if (newToken && newToken !== currentToken) {
                setCurrentToken(newToken); // actualiza y lanza el otro useEffect
            }
        }, 1000); // chequear cada segundo

        // limpiamos el intervalo cuando se desmonta el componente o cambia el token
        return () => clearInterval(interval);
    }, [currentToken]);

    const cerrarSesion = () => {
        Cookies.remove('accessToken');
        Cookies.remove('user');
        Cookies.remove('refreshToken');
        window.location.href = '/';
    }

    // Este otro useEffect sera el encargado de implementar el timer
    useEffect(() => {

        // en caso de que ya haya sido activado el timer o no exista un token, no hacer nada, (evita que se reinicie todo)
        if (timerSet.current || !currentToken) return;

        try {

            // decodificamos el token
            const decoded = jwtDecode(currentToken);

            // calculamos cuanto tiempo falta hasta que expire el token
            const now = Math.floor(Date.now() / 1000); // extraemos el tiempo actual en segundos
            const timeLeft = decoded.exp - now; // calculamos cuantos segundos fatlan para que el token expire
            // si timeLeft es positivo, todavia es valido, si es 0 o negativo, ya expiro
            // esto porque el .exp de los token tienen una fecha defina por el tiempo que le damos al back (y los define en segundos)


            // validamos el tiempo
            if (timeLeft > 0) {

                timerSet.current = true; // marcamos que el timer esta activo

                // si ya termino el tiempo...
                setTimeout(() => {

                    if (sesionRefresh.current) {
                        Swal.fire({
                            title: 'Sesión finalizada',
                            text: 'Ya no es posible extender la sesión. Por favor, vuelve a iniciar sesión si deseas continuar.',
                            icon: 'info',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            cerrarSesion();
                        });

                        return;
                    }

                    Swal.fire({
                        title: 'Sesión expirada',
                        text: '¿Deseas extender tu sesión? Solo tendras 5 minutos mas',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, extender',
                        cancelButtonText: 'No, salir'
                    }).then(async (result) => {

                        if (result.isConfirmed) {
                            try {
                                const newToken = await refreshAccessToken();

                                setCurrentToken(newToken); // actualiza el estado para reiniciar el ciclo
                                timerSet.current = false;
                                sesionRefresh.current = true;
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Sesión extendida',
                                    text: 'Tu sesión ha sido renovada exitosamente.'
                                });

                            } catch (err) {
                                console.error('Error al extender sesión:', err);

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'No fue posible renovar tu sesión. Por favor, inicia sesión de nuevo.'
                                }).then(() => {
                                    cerrarSesion();
                                });
                            }

                        } else {
                            cerrarSesion();
                        }

                    });
                }, timeLeft * 1000);
            }
        } catch (err) {
            console.error('Error al procesar token en App:', err);
        }
    });

    return (
        <AuthContext.Provider value={{
            currentToken,
            cerrarSesion,
            isLoginBlocked,
            incrementLoginAttempts,
            resetLoginAttempts,
            isForgotBlocked,
            incrementForgotAttempts,
            resetForgotAttempts
        }}>
            {children}
        </AuthContext.Provider>
    );
}