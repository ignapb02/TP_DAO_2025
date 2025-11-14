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
