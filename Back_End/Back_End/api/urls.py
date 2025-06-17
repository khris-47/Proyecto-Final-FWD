from django.urls import path
from .views import *


urlpatterns = [
     
    # =============================================================================
    # -- Rutas Principales -------------------------------------------------------
    # ==============================================================================


    # -- Rutas para las Ubicaciones
    path('listUbicaciones/', UbicacionesListView.as_view(), name='Ubicaciones-list'),
    path('ubicaciones/<int:pk>',UbicacionesDetailsView.as_view(), name='Ubicaciones-update-delete'),
    path('ubicaciones/', UbicacionesListCreateView.as_view(), name='Ubicaciones-list-create'),

    # -- Rutas para los Estados
    path('estados/', EstadosListCreateView.as_view(), name='estados-list-create'),
    path('estados/<int:pk>', EstadosDetailsView.as_view(), name='estados-update-create'),

    # -- Rutas para lo cuentos
    path('listCuentos/', CuentosListView.as_view(), name='cuentos-list'),
    path('cuentos/', CuentosListCreateView.as_view(), name='cuentos-list-create'),
    path('cuentos/<int:pk>', CuentosDetailsView.as_view(), name='cuentos-update-delete'),

    # -= Rutas para las entrevistas
    path('listEntrevistas/', EntrevistasListView.as_view(), name='entrevistas-list'),
    path('entrevistas/', EntrevistasListCreateVew.as_view(), name='entrevistas-list-create'),
    path('entrevistas/<int:pk>', EntrevistasDetailsView.as_view(), name='enrevistas-update-delete'),

    # -- Rutas para Usuarios
    path('userRegister/', UserCreateView.as_view(), name='usuarios-create'),
    path('listUser/', UserListView.as_view(), name='usuarios-list'),
    path('UserDetails/<int:pk>', UserDetailsView.as_view(), name='usuarios-update-delete'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('cambiar-password-reset/', CambiarPasswordTrasResetView.as_view()),
    path('por-username/<str:username>/', ObtenerUsuarioPorUsernameView.as_view()),


    # -- Rutas para comentarios 
    path('comentariosRegister/', ComentariosCreateView.as_view(), name='comentarios-create'),
    path('comentariosUser/<int:pk>/', ComentariosPorUsuarioView.as_view(), name='comentarios-user'),

    # -- Rutas para Emprendimientos
    path('crearEmprendimiento/', EmprendimientoCreateView.as_view(), name='emprendimientos-create'),
    path('emprendimientosUser/<int:pk>/', EmprendimientoPorUsuarioView.as_view(), name='emprendimientos-user'),


    # =============================================================================
    # -- Rutas de Auditorias -------------------------------------------------------
    # ==============================================================================

    # -- Ruta para Auditoria_Cuentos
    path('Auditoria_Cuentos/', AudCuentoListView.as_view(), name='auditorias_cuentos-list'),

    # -- Ruta para Auditoria_Entrevistas
    path('Auditoria_Entrevistas/', AudEntrevistasListView.as_view(), name='auditorias_entrevistas-list'),

    # -- Ruta para Auditoria_Usuarios
    path('Auditoria_Usuarios/', AudUserListView.as_view(), name='auditorias_usuarios-list')


]
