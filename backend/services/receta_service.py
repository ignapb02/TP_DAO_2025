from backend.repositories.receta_repository import RecetaRepository

class RecetaService:

    @staticmethod
    def crear_receta(historial_id):
        return RecetaRepository.crear(historial_id)
