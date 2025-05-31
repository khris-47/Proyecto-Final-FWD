from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView
from .models import *
from .serializers import *
from django.contrib.auth.models import Group

# importacion de permisos
from rest_framework.permissions import BasePermission, IsAuthenticated
from .permission import *


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
        
        # Obtiene o crea el grupo "Regular"
        regular_group, created = Group.objects.get_or_create(name='Regular')
        
        # Asigna el usuario al grupo "Regular"
        user.groups.add(regular_group)


class UserListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated] # -- solo autenticados
    queryset = User.objects.all()
    serializer_class = UserSerializer


# -- Vistas para los comentarios ---------------------------------------------
class ComentariosCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated] # -- solo autenticados
    queryset =  Comentarios.objects.all()
    serializer_class = ComentariosSerializer

class ComentariosListView(ListAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset =  Comentarios.objects.all()
    serializer_class = ComentariosSerializer

class ComentariosDetailsView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserGroup, IsAuthenticated] #--solo admin
    queryset =  Comentarios.objects.all()
    serializer_class = ComentariosSerializer



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
