from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView
from .models import *
from .serializers import *
from django.contrib.auth.models import Group, User

# importacion para el envio de email
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
import string

# importacion de permisos
from rest_framework.permissions import BasePermission, IsAuthenticated
from .permission import *

# prueba de envio de email
# class TestEmailView(APIView):
#     def get(self, request):
#         send_mail(
#             'Correo de prueba',
#             'Hola, este es un correo de prueba desde Django.',
#             'tc782.pruebas@gmail.com',
#             ['rootkingjr@gmail.com'], 
#             fail_silently=False,
#         )
#         return Response({'message': 'Correo enviado correctamente'})


# =============================================================================
# -- Vistas Principales -------------------------------------------------------
# ==============================================================================

# -- Vistas para las Ubicaciones -----------------------------------------------
class UbicacionesListView(ListAPIView):
    permission_classes = [] #-- permisos para todos
    queryset = Ubicaciones.objects.all()
    serializer_class = UbicacionesSerializer

class UbicacionesListCreateView(ListCreateAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #-- solo admin
    queryset = Ubicaciones.objects.all()
    serializer_class = UbicacionesSerializer

class UbicacionesDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] # -- solo admin
    queryset = Ubicaciones.objects.all()
    serializer_class = UbicacionesSerializer


# -- Vistas para Estados (Modelo Exclusivo del admin)----------------------------
class EstadosListCreateView(ListCreateAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] # -- solo admin
    queryset = Estados.objects.all()
    serializer_class = EstadosSerializer

class EstadosDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #-- solo admin
    queryset = Estados.objects.all()
    serializer_class = EstadosSerializer


# -- Vistas para los cuentos ---------------------------------------------------
class CuentosListView(ListAPIView):
    permission_classes = [] #--todos pueden
    queryset = Cuentos.objects.all()
    serializer_class = CuentosSerializer

class CuentosListCreateView(ListCreateAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Cuentos.objects.all()
    serializer_class = CuentosSerializer

class CuentosDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Cuentos.objects.all()
    serializer_class = CuentosSerializer


# -- Vistas para las Entrevistas ----------------------------------------------
class EntrevistasListView(ListAPIView):
    permission_classes = [] #--permisos para todos
    queryset = Entrevistas.objects.all()
    serializer_class = EntrevistasSerializer

class EntrevistasListCreateVew(ListCreateAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Entrevistas.objects.all()
    serializer_class = EntrevistasSerializer

class EntrevistasDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Entrevistas.objects.all()
    serializer_class = EntrevistasSerializer


# -- Vistas para Usuarios -----------------------------------------------------
class UserCreateView(CreateAPIView):
    permission_classes = [] # -- permisos para todos
    queryset =  User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        # Guarda el usuario
        user = serializer.save()
        
        # Obtiene o crea el grupo
        regular_group, created = Group.objects.get_or_create(name='Regular')
        
        # Asigna el usuario al grupo
        user.groups.add(regular_group)

class UserListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated] # -- solo autenticados
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ResetPasswordView(APIView):
    permission_classes = [] # -- permisos para todos

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')

        if not username or not email:
            return Response({
                'error' : 'Se requieren de nombre de usuario y correo.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(username=username, email=email)

        except User.DoesNotExist:
            return Response({
                'error' : 'No se encontró al usuario con ese nombre y correo.'}, status=status.HTTP_400_BAD_REQUEST) 

        # Generar nueva contrasenha aleatoria
        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        user.set_password(new_password)
        user.is_active = False
        user.save()

        #Envio de correo con la nueva contrasenha
        send_mail(
            'Restablecimiento de Contraseña',
            f'Hola {user.first_name}, \n\n Tu nueva contraseña es: {new_password}\n Por seguridad, cámbiala después de iniciar sesión.',
            'tc782.pruebas@gmail.com', 
            [email],
            fail_silently= False,
        )

        return Response({'message': 'Contraseña restablecida. Revisa tu correo.'}, status=status.HTTP_200_OK)

class CambiarPasswordTrasResetView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        temp_password = request.data.get("temp_password")
        nueva_password = request.data.get("nueva_password")

        try:
            user = User.objects.get(username=username, is_active=False)

            # Verificamos que la contra temporal sea correcta
            if not user.check_password(temp_password):
                return Response({"error": "La contraseña temporal es incorrecta."}, status=400)

            user.set_password(nueva_password)
            user.is_active = True
            user.save()

            return Response({"message": "Contraseña actualizada correctamente. Ya podés iniciar sesión."}, status=200)

        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado o ya activo."}, status=400)

class ObtenerUsuarioPorUsernameView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response({
                "username": user.username,
                "email": user.email,
                "is_active": user.is_active
            })
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=404)


# -- Vistas para los comentarios ---------------------------------------------
class ComentariosCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated] # -- solo autenticados
    queryset =  Comentarios.objects.all()
    serializer_class = ComentariosSerializer

    def perform_create(self, serializer):

        print("Usuario autenticado:", self.request.user)
        print("Datos recibidos:", self.request.data)

        comentario = serializer.save(usuario=self.request.user)
    
        print("Comentario guardado:", comentario.comentario)
        print("Usuario asociado al comentario:", comentario.usuario)

        #Datos del comentario
        contenido = comentario.comentario
        nombre_usuario = self.request.user.get_full_name()
        correo_usuario = self.request.user.email

        # -- Enviar el correo al admin --
        send_mail(

            # -- subject
            f"Nuevo comentario de {nombre_usuario}", 
            
            # -- message
            f'Hemos recibido un comentario del Usuario: {nombre_usuario}\nComentario: \n{contenido} \nCorreo del Usuario: {correo_usuario}',
            
            # -- from_email
            'tc782.pruebas@gmail.com', 
            
            # -- recipient_list
            ['tc782.pruebas@gmail.com'],

            fail_silently=False,
        )

        # -- Enviar la respuesta automatica al usuarios
        send_mail(
            'Gracias por tu comentario',
            f'Hola {nombre_usuario}, hemos recibido tu mensaje. Gracias por compartir tu opinion con nosotros. 😊',
            'tc782.pruebas@gmail.com', 
            [correo_usuario],
            fail_silently=False,
        )

# -- de momento es opcional
class ComentariosListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset =  Comentarios.objects.all()
    serializer_class = ComentariosSerializer

# -- de momento es opcional
class ComentariosDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset =  Comentarios.objects.all()
    serializer_class = ComentariosSerializer

class ComentariosPorUsuarioView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComentariosSerializer
    

    def get_queryset(self):
        usuario_id = self.kwargs['pk']
        try:
            queryset = Comentarios.objects.filter(usuario__id=usuario_id)
            return queryset
        except Exception as e:
            print("Error en ComentariosPorUsuario:", str(e))
            return Comentarios.objects.none() 


# ===========================================================================
# -- Vistas de Auditoria ----------------------------------------------------
# ===========================================================================


# -- Vistas para  Auditoria Cuentos (exclusivo del admin) -------------------
class AudCuentoListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Auditoria_Cuentos.objects.all()
    serializer_class =  AudCuentosSerializer

# -- Vistas para Auditoria_Entrevistas (exclusivo del admin) ---------------
class AudEntrevistasListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Auditoria_Entrevistas.objects.all()
    serializer_class = AudEntrevistasSerializer

# -- Vistas para Auditorias_Usuarios (exclusivo del admin) ----------------
class AudUserListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = Auditoria_User.objects.all()
    serializer_class = AudUserSerializer
