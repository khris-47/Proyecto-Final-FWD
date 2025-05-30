from rest_framework.permissions import BasePermission


# -- Permiso de Administrador
class IsAdminUserGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Administrador").exists()
    
# -- Permiso de Usuario Regular
class IsRegularUserGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Regular").exists()
    
