from backend.repositories.turno_repository import TurnoRepository
from backend.repositories.medico_repository import MedicoRepository
from backend.repositories.paciente_repository import PacienteRepository
from backend.repositories.medico_especialidad_repository import MedicoEspecialidadRepository

class TurnoService:

    @staticmethod
    def crear_turno(paciente_id, medico_id, especialidad_id, fecha, hora):

        # Validar existencia
        paciente = PacienteRepository.obtener_por_id(paciente_id)
        medico = MedicoRepository.obtener_por_id(medico_id)

        if not paciente:
            raise ValueError("Paciente inexistente.")
        if not medico:
            raise ValueError("Médico inexistente.")

        # Validar que el médico tenga esa especialidad
        if not MedicoEspecialidadRepository.obtener(medico_id, especialidad_id):
            raise ValueError("El médico no posee esa especialidad.")

        # Validar superposición
        turnos_medico = TurnoRepository.obtener_por_medico(medico_id)
        for t in turnos_medico:
            if t.fecha == fecha and t.hora == hora:
                raise ValueError("El médico ya tiene un turno asignado en ese horario.")

        # Crear turno
        return TurnoRepository.crear(
            paciente_id, medico_id, especialidad_id, fecha, hora
        )

    @staticmethod
    def cambiar_estado(id_turno, nuevo_estado):
        turno = TurnoRepository.obtener_por_id(id_turno)
        if not turno:
            raise ValueError("Turno inexistente.")
        
        turno.estado = nuevo_estado
        updated = TurnoRepository.actualizar(id_turno, estado=nuevo_estado)
        return updated

    @staticmethod
    def cancelar_turno(id_turno):
        return TurnoService.cambiar_estado(id_turno, "cancelado")

    @staticmethod
    def obtener_turnos_medico(id_medico):
        return TurnoRepository.obtener_por_medico(id_medico)

    @staticmethod
    def obtener_turnos_paciente(id_paciente):
        return TurnoRepository.obtener_por_paciente(id_paciente)
