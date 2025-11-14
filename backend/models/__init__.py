from backend.app import db

from .paciente import Paciente
from .medico import Medico
from .especialidad import Especialidad
from .medico_especialidad import MedicoEspecialidad
from .turno import Turno
from .historial_clinico import HistorialClinico
from .receta import Receta
from .recordatorio import Recordatorio

def init_models():
    print("Modelos cargados correctamente:")
    print(db.Model.metadata.tables.keys())
