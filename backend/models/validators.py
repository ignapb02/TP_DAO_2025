from datetime import datetime

_DEFAULT_MAX = 2000

def validate_required_str(value, name, max_len=None):
    if value is None:
        raise ValueError(f"El campo '{name}' es obligatorio")
    if not isinstance(value, str):
        raise ValueError(f"'{name}' debe ser una cadena de texto")
    s = value.strip()
    if max_len is None:
        max_len = _DEFAULT_MAX
    if len(s) == 0:
        raise ValueError(f"'{name}' no puede estar vacío")
    if len(s) > max_len:
        raise ValueError(f"'{name}' excede la longitud máxima de {max_len} caracteres")
    return s

def validate_optional_str(value, name, max_len=None):
    if value is None:
        return None
    if not isinstance(value, str):
        raise ValueError(f"'{name}' debe ser una cadena de texto")
    s = value.strip()
    if max_len is None:
        max_len = _DEFAULT_MAX
    if len(s) == 0:
        return None
    if len(s) > max_len:
        raise ValueError(f"'{name}' excede la longitud máxima de {max_len} caracteres")
    return s

def validate_name(value, name, max_len=None):
    s = validate_required_str(value, name, max_len=max_len)
    has_letter = False
    for ch in s:
        if ch.isdigit():
            raise ValueError(f"'{name}' no puede contener dígitos")
        if ch.isalpha():
            has_letter = True
        elif ch not in (" ", "-", "'"):
            raise ValueError(f"'{name}' contiene caracteres inválidos")
    if not has_letter:
        raise ValueError(f"'{name}' debe contener letras")
    return s

def validate_digits(value, name, min_len=None, max_len=None):
    if value is None:
        raise ValueError(f"El campo '{name}' es obligatorio")
    if not isinstance(value, (str, int)):
        raise ValueError(f"'{name}' debe ser numérico")
    s = str(value).strip()
    if max_len is None:
        max_len = _DEFAULT_MAX
    if len(s) == 0:
        raise ValueError(f"'{name}' no puede estar vacío")
    if not s.isdigit():
        raise ValueError(f"'{name}' debe contener sólo dígitos")
    if min_len is not None and len(s) < min_len:
        raise ValueError(f"'{name}' debe tener al menos {min_len} dígitos")
    if len(s) > max_len:
        raise ValueError(f"'{name}' excede la longitud máxima de {max_len} caracteres")
    return s

def validate_email(value, name='email', max_len=100):
    s = validate_required_str(value, name, max_len=max_len)
    if '@' not in s or s.startswith('@') or s.endswith('@'):
        raise ValueError(f"'{name}' no tiene un formato de correo válido")
    return s

def validate_required_int(value, name='value', min_value=1):
    if value is None:
        raise ValueError(f"El campo '{name}' es obligatorio")
    try:
        iv = int(value)
    except Exception:
        raise ValueError(f"'{name}' debe ser un entero válido")
    if min_value is not None and iv < min_value:
        raise ValueError(f"'{name}' debe ser mayor o igual que {min_value}")
    return iv

def parse_optional_datetime(value, name='fecha'):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value)
        except Exception:
            raise ValueError(f"'{name}' debe ser una cadena ISO o datetime")
    raise ValueError(f"'{name}' debe ser datetime o cadena ISO")
