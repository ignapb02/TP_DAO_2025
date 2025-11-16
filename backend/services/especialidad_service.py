from backend.repositories.especialidad_repository import EspecialidadRepository

class EspecialidadService:

    @staticmethod
    def crear_especialidad(nombre):
        # Evitar duplicados
        especialidades = EspecialidadRepository.obtener_todos()
        if any(e.nombre.lower() == nombre.lower() for e in especialidades):
            raise ValueError("La especialidad ya existe.")
        return EspecialidadRepository.crear(nombre)

    @staticmethod
    def obtener_todas():
        return EspecialidadRepository.obtener_todos()

    @staticmethod
    def obtener_especialidad(id_especialidad):
        especialidad = EspecialidadRepository.obtener_por_id(id_especialidad)
        if not especialidad:
            raise ValueError("Especialidad no encontrada.")
        return especialidad
    
    @staticmethod
    def actualizar_especialidad(id_especialidad, nuevo_nombre):
        especialidad = EspecialidadRepository.obtener_por_id(id_especialidad)
        if not especialidad:
            raise ValueError("Especialidad no encontrada.")
        
        # Evitar duplicados
        especialidades = EspecialidadRepository.obtener_todos()
        if any(e.nombre.lower() == nuevo_nombre.lower() and e.id_especialidad != id_especialidad for e in especialidades):
            raise ValueError("Otra especialidad con ese nombre ya existe.")
        
        EspecialidadRepository.actualizar(id_especialidad, nuevo_nombre)
        return EspecialidadRepository.obtener_por_id(id_especialidad)
    
    @staticmethod
    def eliminar_especialidad(id_especialidad):
        especialidad = EspecialidadRepository.obtener_por_id(id_especialidad)
        if not especialidad:
            return False
        return EspecialidadRepository.eliminar(id_especialidad)
