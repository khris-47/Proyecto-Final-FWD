from rest_framework import serializers
from .models import *
import cloudinary.uploader

from django.contrib.auth import get_user_model
User = get_user_model()


# ===========================================================================
# -- Tablas Principales -----------------------------------------------------
# ===========================================================================


# -- Serializer para la clase generica de usuarios --------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','first_name','last_name','password','date_joined']

        extra_kwargs = {
            'password' : {
                'write_only':True
            }
        }

    
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  
        user.save()
        return user
        
    def update(self, instance, validated_data):
        try:
          
            password = validated_data.pop('password', None)

            for attr, value in validated_data.items() :
                setattr(instance, attr, value)

            if password : 
                instance.set_password(password)

            instance.save()
            return instance
        
        except Exception as e:
            print(f"Error al actualizar usuario: {e}")  # Log para depuración
            raise serializers.ValidationError({"error": "No se pudo actualizar el usuario."})
       

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
    
    # esto permite que portada y cuento sean aceptados como archivos en la solicitud, pero, no se devolvera en la respuesta
    # al momento del create hacemos el manejo de los mismos
    portada = serializers.FileField(write_only=True, required=False)
    cuento = serializers.FileField(write_only=True, required=False)


    class Meta:
        model = Cuentos
        fields = '__all__'

    def validate_nombre_Cuento(self,value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre es muy corto, minimo 5 caracteres")
        return value
    
    def create(self, validate_data):

        print("Datos recibidos en serializer create:", validate_data)

        # extraemos los archivos de la data y los quitamos del diccionario / objeto
        # ya que el modelo espera URLs (TextField), no archivos directamente.
        portada_file = validate_data.pop('portada', None)
        cuento_file = validate_data.pop('cuento', None)

        # en caso de que, se haya recibido una imagen, se sube a cloudinary
        if portada_file:
            result =  cloudinary.uploader.upload(
                portada_file,               # el archivo recibido
                resource_type='image')      # indicamos que es una imagen
            
            # guardamos la URL segura de la imagen subida en el campo de portada
            validate_data['portada'] = result.get('secure_url')

        # en caso de haber recibido un cuento en PDF, se sube a Cloudinary
        if cuento_file:
            result =  cloudinary.uploader.upload(
                cuento_file,                # archibo recibido
                resource_type='raw')        # raw permite subir archivos como PDF, ZIP, DOC, etc.
            
            # guardmos la URL del archivo PDF en el campo de cuento
            validate_data['cuento'] = result.get('secure_url')

        # creamos y retornamos la instacia del modelo con las URLs ya listas
        return super().create(validate_data)

    def update(self, instance, validated_data):

        # la configuracion es practicamente la misma que en el create
        portada_file = validated_data.pop('portada', None)
        cuento_file = validated_data.pop('cuento', None)

        if portada_file:
            result = cloudinary.uploader.upload(portada_file, resource_type='image')
            instance.portada = result.get('secure_url')

        if cuento_file:
            result = cloudinary.uploader.upload(cuento_file, resource_type='raw')
            instance.cuento = result.get('secure_url')

        # Para cualquier otro campo, se actualiza normalmente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Guardamos los cambios
        instance.save()
        return instance
    
    
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
