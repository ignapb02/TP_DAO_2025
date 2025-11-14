from backend.repositories.paciente_repository import PacienteRepository

class PacienteService:

    @staticmethod
    def registrar_paciente(nombre, apellido, dni, email, telefono=None):

        # Validación: DNI duplicado
        pacientes = PacienteRepository.obtener_todos()
        if any(p.dni == dni for p in pacientes):
            raise ValueError("El DNI ya está registrado.")

        return PacienteRepository.crear(nombre, apellido, dni, email, telefono)

    @staticmethod
    def obtener_todos():
        return PacienteRepository.obtener_todos()

    @staticmethod
    def obtener_paciente(id_paciente):
        paciente = PacienteRepository.obtener_por_id(id_paciente)
        if not paciente:
            raise ValueError("Paciente no encontrado.")
        return paciente

    @staticmethod
    def actualizar_paciente(id_paciente, **datos):
        paciente = PacienteRepository.actualizar(id_paciente, **datos)
        if not paciente:
            raise ValueError("Paciente no encontrado.")
        return paciente

    @staticmethod
    def eliminar_paciente(id_paciente):
        ok = PacienteRepository.eliminar(id_paciente)
        if not ok:
            raise ValueError("Paciente no encontrado.")
        return ok
