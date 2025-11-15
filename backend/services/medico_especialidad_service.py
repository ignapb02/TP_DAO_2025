from backend.repositories.medico_especialidad_repository import MedicoEspecialidadRepository
from backend.repositories.medico_repository import MedicoRepository
from backend.repositories.especialidad_repository import EspecialidadRepository

class MedicoEspecialidadService:

    @staticmethod
    def asignar_especialidad(medico_id, especialidad_id, principal=False, fecha_obtencion=None):
        
        medico = MedicoRepository.obtener_por_id(medico_id)
        if not medico:
            raise ValueError("Médico no encontrado.")

        especialidad = EspecialidadRepository.obtener_por_id(especialidad_id)
        if not especialidad:
            raise ValueError("Especialidad no encontrada.")

        # Evitar asignación duplicada
        if MedicoEspecialidadRepository.obtener(medico_id, especialidad_id):
            raise ValueError("El médico ya tiene esta especialidad.")

        return MedicoEspecialidadRepository.asignar(
            medico_id, especialidad_id, principal, fecha_obtencion
        )
    
    @staticmethod
    def obtener_especialidades_medico(medico_id):
        medico = MedicoRepository.obtener_por_id(medico_id)
        if not medico:
            raise ValueError("Médico no encontrado.")
        return medico.especialidades

    @staticmethod
    def obtener_medicos_por_especialidad(especialidad_id):
        # Retornar lista de médicos que tienen asignada la especialidad indicada
        especial = EspecialidadRepository.obtener_por_id(especialidad_id)
        if not especial:
            raise ValueError("Especialidad no encontrada.")

        medicos = MedicoRepository.obtener_todos()
        resultado = []
        for m in medicos:
            # m.especialidades es una lista de MedicoEspecialidad
            if any(me.especialidad_id == especialidad_id for me in m.especialidades):
                resultado.append(m)
        return resultado
    
    @staticmethod
    def eliminar_especialidad(medico_id, especialidad_id):
        relacion = MedicoEspecialidadRepository.obtener(medico_id, especialidad_id)
        if not relacion:
            raise ValueError("La asignación no existe.")
        return MedicoEspecialidadRepository.eliminar(medico_id, especialidad_id)
