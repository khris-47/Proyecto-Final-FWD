from rest_framework import serializers
from .models import *
from django.conf import settings
import boto3

from django.contrib.auth import get_user_model
User = get_user_model()


# ===========================================================================
# Funciones auxiliares para subir archivos a S3 -----------------------------
# ===========================================================================

# Funcion para subir/actualizar las imagenes
def _upload_to_s3(file, folder=""):
    # esta funcion se encarga de subir el archivo s3 y retornar la URL publica
    # file: archivo recibido del front. folder: subcarpeta dentro del bucket
     
    s3 = boto3.client(
        's3',
        aws_access_key_id = settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    ) 

    # generar la clave del objeto: folder/nombre
    file_key = f"{folder}/{file.name}"

    # subir archivos al s3
    s3.upload_fileobj(
        file,
        settings.AWS_STORAGE_BUCKET_NAME,
        file_key,
    )

    # construir la url publica
    url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_key}"
    return url 

# Funcion para subir/actualizar los pdf de los cuentos
def _upload_pdf_to_s3(file, folder=""):
    s3 = boto3.client(
        's3',
        aws_access_key_id = settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    file_key = f"{folder}/{file.name}"

    s3.upload_fileobj(
        file,
        settings.AWS_STORAGE_BUCKET_NAME,
        file_key,
        ExtraArgs={
            'ContentType': 'application/pdf', 
        }
    )

    url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_key}"
    return url


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
                'write_only':True, 'required': False
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

    # Entrada:
    # esto permite que portada sea adapatada como archivos en la solicitud, pero, no se devolvera en la respuesta
    # al momento del create hacemos el manejo de los mismos
    portada = serializers.FileField(write_only=True, required=False)

    # Salida: Mostrar URL guardada
    portada_url = serializers.CharField(source='portada', read_only=True)

    class Meta:
        model = Ubicaciones
        fields = [
            'id',
            'nombre',
            'portada',        # solo en escritura
            'portada_url',    # para lectura
            'descripcion'
        ]

    # -- Validaciones -----------------------------------------------
    def validate_nombre(self,value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre de la ubicacion debe tener al menos 5 caracteres")
        return value

    def validate_descripcion(self, value):
        if len(value) < 20: 
            raise serializers.ValidationError("La descripcion no puede ser tan corta, no menos de 20 caracteres")
        return value


    def create(self, validated_data):

        print("Datos recibidos en serializer create:", validated_data)

        # extraemos los archivos de la data y los quitamos del diccionario / objeto
        # ya que el modelo espera URLs (TextField), no archivos directamente.
        portada_file = validated_data.pop('portada', None)

        # Si hay imagen, la subimos a S3
        if portada_file:
            validated_data['portada'] = _upload_to_s3(portada_file, folder="ubicaciones")

        # creamos y retornamos la instacia del modelo con las URLs ya listas
        return super().create(validated_data)

    def update(self, instance, validated_data):

        # la configuracion es practicamente la misma que en el create
        portada_file = validated_data.pop('portada', None)

        # tambien valida si el archivo es una cadena vacia
        if portada_file and portada_file != "":
            instance.portada = _upload_to_s3(portada_file, folder="ubicaciones")

        # Para cualquier otro campo, se actualiza normalmente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Guardamos los cambios
        instance.save()
        return instance
    
    
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
    
    # Entrada:
    # esto permite que portada y cuento sean aceptados como archivos en la solicitud, pero, no se devolvera en la respuesta
    # al momento del create hacemos el manejo de los mismos
    portada = serializers.FileField(write_only=True, required=False)
    cuento = serializers.FileField(write_only=True, required=False)

    # Salida: Mostrar URL guardada
    portada_url = serializers.CharField(source='portada', read_only=True)
    cuento_url = serializers.CharField(source='cuento', read_only=True)
    
    # mostrar nombre de la ubicacion
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)


    class Meta:
        model = Cuentos
        fields = [
            'id',
            'nombre_Cuento',
            'portada',        # solo en escritura
            'portada_url',    # para lectura
            'cuento',         # solo en escritua
            'cuento_url',     # solo lectura
            'fecha_creacion',
            'estado',
            'ubicacion',
            'ubicacion_nombre' # solo lectura
        ]
   
    def validate_nombre_Cuento(self,value):
        if len(value) < 5:
            raise serializers.ValidationError("El nombre es muy corto, minimo 5 caracteres")
        return value
    
    def create(self, validated_data):

        print("Datos recibidos en serializer create:", validated_data)

        # extraemos los archivos de la data y los quitamos del diccionario / objeto
        # ya que el modelo espera URLs (TextField), no archivos directamente.
        portada_file = validated_data.pop('portada', None)
        cuento_file = validated_data.pop('cuento', None)

        # En caso de recibir una imagen, se sube a S3
        if portada_file:
            validated_data['portada'] = _upload_to_s3(portada_file, folder="portadas")

        # En caso de recibir un cuento en PDF, se sube a S3
        if cuento_file:
            validated_data['cuento'] = _upload_pdf_to_s3(cuento_file, folder="cuentos")

        # Creamos y retornamos la instancia del modelo con las URLs ya listas
        return super().create(validated_data)

    def update(self, instance, validated_data):

        # Extraer y limpiar archivos si existen y no están vacíos
        portada_file = validated_data.pop('portada', None)
        cuento_file = validated_data.pop('cuento', None)

        # tambien valida si el archivo es una cadena vacia ("")
        if portada_file and portada_file != "":
             instance.portada = _upload_to_s3(portada_file, folder="portadas")

        if cuento_file and cuento_file != "":
            instance.cuento = _upload_pdf_to_s3(cuento_file, folder="cuentos")

        # Para cualquier otro campo, se actualiza normalmente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Guardamos los cambios
        instance.save()
        return instance
    
    
# -- Serializer de Entrevistas ----------------------------
class EntrevistasSerializer(serializers.ModelSerializer):

    # mostrar nombre de la ubicacion
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)

    class Meta:
        model = Entrevistas
        fields =  '__all__'

    def validate_nombre_Persona(self,value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre es muy corto, minimo 3 caracteres")
        return value

    def validate_descripcion(self, value):
        if len(value) < 20: 
            raise serializers.ValidationError("La descripcion no puede ser tan corta, no menos de 20 caracteres")
        return value


# -- Serializer de Comentarios ----------------------------
class ComentariosSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Comentarios
        fields = '__all__'

    def validate_comentario(self, value):
        if len(value) < 5: 
            raise serializers.ValidationError("El comentario es muy corto, minimo 5 caracteres")
        return value


# -- Serializer de Emprendimientos ------------------------
class EmprendimientoSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)

    # Entrada 
    foto = serializers.FileField(write_only=True, required=False)

    # Salida
    foto_url = serializers.CharField(source='foto', read_only=True)
    ubicacion_nombre = serializers.CharField(source='ubicacion.nombre', read_only=True)

    class Meta: 
        model = Emprendimiento
        fields = '__all__'

    def create(self, validated_data):
        
        print('Datos entrantes ===================', validated_data)

        foto_file =  validated_data.pop('foto', None)

        if foto_file:
            # Subir a S3 en lugar de Cloudinary
            validated_data['foto'] = _upload_to_s3(foto_file, folder="emprendimientos")

        return super().create(validated_data)
    

# -- Serializer de Rating de cuentos --------------------
class RatingsCuentoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = RatingCuentos
        fields = '__all__'
        read_only_fields = ('user',) # el campo usuario no sera tomado desde l front, sino desde el token

    def create(self, validated_data):
        # obtenemos el usuario autenticado
        request_user = self.context['request'].user

        # Buscamos en la base el usuario y cuento especificado
        # si existe, lo actualiza, sino, lo crea
        rating, _ = RatingCuentos.objects.update_or_create(
            user=request_user,
            cuento=validated_data['cuento'],
            defaults={'valor': validated_data['valor']}
        )
        return rating # devolvemos la instancia

# ===========================================================================
# -- Bloqueos -------------------------------------------------------------
# ===========================================================================

# -- Serializer para el bloqueo del login
class LoginBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginBlock
        fields = ['visitor_id', 'failed_attempts', 'blocked_until']
        read_only_fields = ['failed_attempts', 'blocked_until']

class RecoveryBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryBlock
        fields = ['visitor_id', 'failed_attempts', 'blocked_until']
        read_only_fields = ['failed_attempts', 'blocked_until']

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