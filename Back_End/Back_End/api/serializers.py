from rest_framework import serializers
from .models import *

from django.contrib.auth import get_user_model
User = get_user_model()


# ===========================================================================
# -- Tablas Principales -----------------------------------------------------
# ===========================================================================


# -- Serializer para la clase generica de usuarios --------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


# -- Serializer de Ubicaciones ----------------------------
class UbicacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicaciones
        fields = '__all__'

    # -- Validaciones -----------------------------------------------
    def validate_nombre(self,value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre de la ubicacion debe tener al menos 5 caracteres")
        return value

    def validate_descripcion(self, value):
        if len(value) < 20: 
            raise serializers.ValidationError("La descripcion no puede ser tan corta, no menos de 20 caracteres")
        return value
    
    
# -- Serializer de Estados --------------------------------
class EstadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estados
        fields = '__all__'

    def validate_tipoEstado(self,value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre es muy corto, minimo tres caracteres")
        return value


# -- Serializer de Cuentos --------------------------------
class CuentosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuentos
        fields = '__all__'

    def validate_nombre_Cuento(self,value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre es muy corto, minimo 5 caracteres")
        return value


# -- Serializer de Entrevistas ----------------------------
class EntrevistasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrevistas
        fields =  '__all__'

    def validate_nombre_Persona(self,value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre es muy corto, minimo 5 caracteres")
        return value

    def validate_descripcion(self, value):
        if len(value) < 20: 
            raise serializers.ValidationError("La descripcion no puede ser tan corta, no menos de 20 caracteres")
        return value


# -- Serializer de Comentarios ----------------------------
class ComentariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentarios
        fields = '__all__'

    def validate_comentario(self, value):
        if len(value) < 5: 
            raise serializers.ValidationError("El comentario es muy corto, minimo 5 caracteres")
        return value


# ===========================================================================
# -- Auditorias -------------------------------------------------------------
# ===========================================================================




# -- Serializer para la Auditoria de Entrevistas ---------
class AudEntrevistasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditoria_Entrevistas
        fields = '__all__'

# -- Serializer para la Auditoria de Cuentos -------------
class AudCuentosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditoria_Cuentos
        fields = '__all__'

# -- Serializer para la Auditoria de Usuarios ------------
class AudUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditoria_User
        fields =  '__all__'
