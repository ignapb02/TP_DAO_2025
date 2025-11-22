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
        from backend.repositories.medico_especialidad_repository import MedicoEspecialidadRepository
        from backend.repositories.turno_repository import TurnoRepository
        
        especialidad = EspecialidadRepository.obtener_por_id(id_especialidad)
        if not especialidad:
            return False
        
        # Verificar si hay médicos con esta especialidad
        medicos_especialidades = MedicoEspecialidadRepository.obtener_por_especialidad(id_especialidad)
        if medicos_especialidades:
            raise ValueError(f"No se puede eliminar la especialidad porque hay {len(medicos_especialidades)} médico(s) con esta especialidad asignada.")
        
        # Verificar si hay turnos con esta especialidad
        todos_turnos = TurnoRepository.obtener_todos()
        turnos_especialidad = [t for t in todos_turnos if t.especialidad_id == id_especialidad]
        if turnos_especialidad:
            turnos_pendientes = [t for t in turnos_especialidad if t.estado == 'pendiente']
            if turnos_pendientes:
                raise ValueError(f"No se puede eliminar la especialidad porque tiene {len(turnos_pendientes)} turno(s) pendiente(s) asociado(s).")
            else:
                raise ValueError(f"No se puede eliminar la especialidad porque tiene {len(turnos_especialidad)} turno(s) histórico(s) asociado(s).")
        
        return EspecialidadRepository.eliminar(id_especialidad)
