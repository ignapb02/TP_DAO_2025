from backend.repositories.medico_repository import MedicoRepository

class MedicoService:

    @staticmethod
    def registrar_medico(nombre, apellido, matricula, email, telefono, dni):

        # Validación: matrícula única
        medicos = MedicoRepository.obtener_todos()
        if any(m.matricula == matricula for m in medicos):
            raise ValueError("La matrícula ya está registrada.")

        return MedicoRepository.crear(nombre, apellido, matricula, email, telefono, dni)

    @staticmethod
    def obtener_medico(id_medico):
        medico = MedicoRepository.obtener_por_id(id_medico)
        if not medico:
            raise ValueError("Médico no encontrado.")
        return medico

    @staticmethod
    def actualizar_medico(id_medico, **datos):
        medico = MedicoRepository.actualizar(id_medico, **datos)
        if not medico:
            raise ValueError("Médico no encontrado.")
        return medico

    @staticmethod
    def eliminar_medico(id_medico):
        ok = MedicoRepository.eliminar(id_medico)
        if not ok:
            raise ValueError("Médico no encontrado.")
        return ok
