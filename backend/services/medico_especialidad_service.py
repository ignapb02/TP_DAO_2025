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
