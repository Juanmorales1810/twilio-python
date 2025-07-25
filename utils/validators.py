import re
from datetime import datetime, date
from typing import Optional


def validate_email(email: str) -> bool:
    """Valida formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_date(date_str: str) -> Optional[datetime]:
    """Valida y convierte string de fecha a datetime"""
    try:
        # Intentar formato DD/MM/YYYY
        return datetime.strptime(date_str, "%d/%m/%Y")
    except ValueError:
        try:
            # Intentar formato DD-MM-YYYY
            return datetime.strptime(date_str, "%d-%m-%Y")
        except ValueError:
            try:
                # Intentar formato YYYY-MM-DD
                return datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                return None


def validate_time(time_str: str) -> Optional[str]:
    """Valida formato de hora"""
    try:
        # Limpiar el string
        time_str = time_str.strip()
        
        # Intentar diferentes formatos
        formats_to_try = [
            "%H:%M",      # 18:00
            "%H",         # 18
            "%I:%M %p",   # 6:00 PM  
            "%I %p"       # 6 PM
        ]
        
        time_obj = None
        for fmt in formats_to_try:
            try:
                time_obj = datetime.strptime(time_str, fmt)
                break
            except ValueError:
                continue
        
        if time_obj is None:
            return None
            
        hour = time_obj.hour
        
        # Validar que esté en horario de atención
        # Lunes a Viernes: 9:00-18:00, Sábado: 9:00-14:00
        # Permitir 6:00 como 18:00 (6 PM) 
        if hour == 6:
            # Probablemente es 6 PM = 18:00
            hour = 18
        
        if 9 <= hour <= 18:
            # Convertir a formato 24h estándar
            return f"{hour:02d}:{time_obj.minute:02d}"
        else:
            return None
    except Exception:
        return None


def validate_phone_number(phone: str) -> bool:
    """Valida formato de número telefónico"""
    # Remover espacios y caracteres especiales
    clean_phone = re.sub(r'[^\d+]', '', phone)
    
    # Validar longitud y formato básico
    if len(clean_phone) >= 10 and len(clean_phone) <= 15:
        return True
    return False


def format_currency(amount: float) -> str:
    """Formatea cantidad como moneda mexicana"""
    return f"${amount:,.2f} MXN"


def clean_text(text: str) -> str:
    """Limpia texto de caracteres especiales"""
    return re.sub(r'[^\w\s]', '', text).strip()


def extract_keywords(text: str) -> list:
    """Extrae palabras clave de un texto"""
    # Convertir a minúsculas y dividir en palabras
    words = text.lower().split()
    
    # Filtrar palabras comunes
    stop_words = {'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'me', 'una', 'como', 'las', 'del', 'los'}
    
    keywords = [word for word in words if len(word) > 2 and word not in stop_words]
    return keywords


def is_business_hours() -> bool:
    """Verifica si es horario de atención"""
    now = datetime.now()
    # Lunes a Viernes 9:00-18:00, Sábado 9:00-14:00
    if now.weekday() < 5:  # Lunes a Viernes
        return 9 <= now.hour < 18
    elif now.weekday() == 5:  # Sábado
        return 9 <= now.hour < 14
    else:  # Domingo
        return False
